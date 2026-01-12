'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { collection, doc, deleteDoc, setDoc } from 'firebase/firestore';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Product } from "@/lib/data";
import { MoreHorizontal, PlusCircle, Upload, Loader2, AlertTriangle, CheckCircle, FileText, Bot, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { useTranslation, Language } from '@/lib/i18n';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProductForm from '@/components/admin/ProductForm';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { importProductsWithAi } from '@/ai/flows/product-importer-flow';

function AiProductImporterCard() {
    const { t } = useTranslation();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [rawProductText, setRawProductText] = useState('');
    const [isImportingAi, setIsImportingAi] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [importMessage, setImportMessage] = useState('');


    const handleAiImport = async () => {
        if (!firestore) return;
        if (!rawProductText.trim()) {
            toast({
                variant: 'destructive',
                title: t('toast_ai_import_no_text_title'),
                description: t('toast_ai_import_no_text_desc'),
            });
            return;
        }

        setIsImportingAi(true);
        setImportProgress(0);
        setImportMessage(t('admin_products.ai_import_status_parsing'));

        try {
            const { products: importedProducts } = await importProductsWithAi({ productText: rawProductText });

            if (!importedProducts || importedProducts.length === 0) {
                throw new Error(t('admin_products.ai_import_error_no_products'));
            }

            setImportMessage(t('admin_products.ai_import_status_uploading', { count: importedProducts.length }));
            
            const total = importedProducts.length;
            let completed = 0;

            for (const product of importedProducts) {
                const productRef = doc(firestore, 'products', product.id);
                // The AI generates an imageId, we construct a placeholder URL from it.
                const imageUrl = `https://picsum.photos/seed/${product.imageId}/600/600`;

                await setDoc(productRef, { ...product, imageUrl }, { merge: true });
                completed++;
                setImportProgress((completed / total) * 100);
            }
            
            setTimeout(() => {
                toast({
                    title: t('admin_products.ai_import_success_title'),
                    description: t('admin_products.ai_import_success_desc', { count: total }),
                });
            }, 500);

        } catch (error: any) {
            console.error(error);
            toast({
                variant: "destructive",
                title: t('admin_products.ai_import_failed_title'),
                description: error.message || t('admin_products.ai_import_failed_desc'),
            });
        } finally {
            setIsImportingAi(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-accent" />
                    {t('admin_products.ai_import_title')}</CardTitle>
                <CardDescription>{t('admin_products.ai_import_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-3">
                    <Label htmlFor="ai-product-input">{t('admin_products.ai_import_label')}</Label>
                    <Textarea
                        id="ai-product-input"
                        placeholder={t('admin_products.ai_import_placeholder')}
                        value={rawProductText}
                        onChange={(e) => setRawProductText(e.target.value)}
                        rows={8}
                        disabled={isImportingAi}
                    />
                </div>
                 <Button onClick={handleAiImport} disabled={isImportingAi || !rawProductText.trim()} className="w-full">
                    {isImportingAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                    {isImportingAi ? t('admin_products.ai_import_button_loading') : t('admin_products.ai_import_button')}
                </Button>
            </CardContent>
            {isImportingAi && (
                 <CardFooter className="flex flex-col gap-2">
                    <Progress value={importProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground">{importMessage}</p>
                 </CardFooter>
            )}
        </Card>
    );
}

export default function ProductsAdminPage() {
  const { t, language } = useTranslation();
  const firestore = useFirestore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importedProductsPreview, setImportedProductsPreview] = useState<Partial<Product>[]>([]);
  const { toast } = useToast();

  const productsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsCollectionRef);

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, "products", productId));
      toast({
        title: t('admin_products.toast_delete_success_title'),
        description: t('admin_products.toast_delete_success_desc'),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('admin_products.toast_delete_error_title'),
        description: error.message || t('admin_products.toast_delete_error_desc'),
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setCsvFile(file || null);
    setImportStatus('idle');
    setImportedProductsPreview([]);
  };

  const handleImport = () => {
    if (!csvFile || !firestore) return;

    setIsImporting(true);
    setImportStatus('idle');
    setImportedProductsPreview([]);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const parsedData = results.data as Partial<Product>[];
          setImportedProductsPreview(parsedData);

          // Basic validation before attempting to import
          if (!parsedData || parsedData.length === 0) {
            throw new Error(t('admin_products.toast_no_data_error_desc'));
          }

          // Upload to Firebase
          await Promise.all(parsedData.map(async (product) => {
            const newDocRef = doc(collection(firestore, 'products'));
            await setDoc(newDocRef, {
              ...product,
              id: newDocRef.id,
            });
          }));

          setImportStatus('success');
          toast({
            title: t('admin_products.toast_import_success_title'),
            description: t('admin_products.toast_import_success_desc', { count: parsedData.length }),
          });

        } catch (error: any) {
          console.error("CSV Processing Error:", error);
          setImportStatus('error');
          toast({
            variant: "destructive",
            title: t('admin_products.toast_import_failed_title'),
            description: error.message || t('admin_products.toast_parse_error_desc'),
          });
        } finally {
          setIsImporting(false);
          setCsvFile(null); 
        }
      },
      error: (error) => {
        console.error("PapaParse Error:", error);
        setIsImporting(false);
        setImportStatus('error');
        toast({
            variant: "destructive",
            title: t('admin_products.toast_import_error_title'),
            description: t('admin_products.toast_papa_parse_error_desc'),
        });
      },
    });
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <div className="space-y-8">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-headline font-bold">{t('admin_nav.products')}</h1>
            <div className="flex items-center gap-4">
            <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" /> {t('admin_products.add_product_button')}
            </Button>
            </div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            <AiProductImporterCard />
            <Card>
                <CardHeader>
                    <CardTitle>{t('admin_products.import_products_title')}</CardTitle>
                    <CardDescription>{t('admin_products.import_products_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-3">
                    <Label htmlFor="csv-import">{t('admin_products.csv_file_label')}</Label>
                    <div className="flex gap-2">
                        <Input id="csv-import" type="file" accept=".csv" onChange={handleFileChange} />
                        <Button onClick={handleImport} disabled={isImporting || !csvFile}>
                        {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        {t('admin_products.import_button')}
                        </Button>
                    </div>
                    </div>
                </CardContent>
                {importStatus === 'success' && importedProductsPreview.length > 0 && (
                    <CardFooter>
                        <Alert variant="default">
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>{t('admin_products.import_preview_title')}</AlertTitle>
                            <AlertDescription>
                                {t('admin_products.import_preview_success_desc', { count: importedProductsPreview.length })}
                            </AlertDescription>
                        </Alert>
                    </CardFooter>
                )}
                {importStatus === 'error' && (
                    <CardFooter>
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>{t('admin_products.toast_import_failed_title')}</AlertTitle>
                            <AlertDescription>
                                {t('admin_products.import_failed_desc')}</AlertDescription>
                        </Alert>
                    </CardFooter>
                )}
            </Card>
        </div>


        <Card>
            <CardHeader>
            <CardTitle>{t('admin_products.product_list_title')}</CardTitle>
            <CardDescription>{t('admin_products.product_list_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">{t('admin_products.table_header_image')}</TableHead>
                    <TableHead>{t('admin_products.table_header_name')}</TableHead>
                    <TableHead>{t('admin_products.table_header_category')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t('admin_products.table_header_price')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t('admin_products.table_header_stock')}</TableHead>
                    <TableHead>
                    <span className="sr-only">{t('admin_products.table_header_actions')}</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {isLoadingProducts ? (
                    [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell className="hidden sm:table-cell"><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-16" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                    ))
                ) : (
                    products?.map((product) => {
                    const productName = product.name[language] ?? product.name['en'];
                    // Get first image from imageUrls array, or fallback to imageUrl for backward compatibility
                    const displayImageUrl = (product.imageUrls && product.imageUrls.length > 0) 
                      ? product.imageUrls[0] 
                      : product.imageUrl;
                    const isValidUrl = typeof displayImageUrl === 'string' && displayImageUrl.startsWith('https://');
                    return (
                        <TableRow key={product.id}>
                        <TableCell className="hidden sm:table-cell">
                            {isValidUrl ? (
                            <img
                                alt={productName}
                                className="aspect-square rounded-md object-cover"
                                height="64"
                                src={displayImageUrl}
                                width="64"
                            />
                            ) : (
                            <div className="w-16 h-16 bg-secondary rounded-md flex items-center justify-center">
                                <FileText className="h-6 w-6 text-muted-foreground"/>
                            </div>
                            )}
                        </TableCell>
                        <TableCell className="font-medium">{productName}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{product.category[language] ?? product.category['en']}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">${product.price.toLocaleString()}</TableCell>
                        <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">{t('admin_products.actions_menu_label')}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(product)}>{t('common.edit')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-destructive">{t('common.delete')}</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    );
                    })
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
        </div>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>{selectedProduct ? t('admin_products.edit_product_title') : t('admin_products.add_product_title')}</DialogTitle>
                <DialogDescription>
                    {selectedProduct ? t('admin_products.edit_product_desc') : t('admin_products.add_product_desc')}</DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto pr-6">
                <ProductForm product={selectedProduct} onSave={() => setIsFormOpen(false)} />
            </div>
        </DialogContent>
    </Dialog>
  );
}
