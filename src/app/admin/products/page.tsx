"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "@/components/admin/ProductForm";
import DriveLinkImporterCard from "@/components/admin/DriveLinkImporterCard";
import { useProducts } from "@/hooks/use-products";
import { useTranslation } from "@/lib/i18n";
import axios, { AxiosError } from "axios";
import Image from "next/image";

interface ProductToImport {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageFile: File;
  previewUrl: string;
}

export default function ProductsPage() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const { products, isLoading: isLoadingProducts, deleteProduct, mutateProducts } = useProducts();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [productsToImport, setProductsToImport] = useState<ProductToImport[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImportEditorOpen, setIsImportEditorOpen] = useState(false);
  const [loadingCounter, setLoadingCounter] = useState(0);
  const [bulkImportTotal, setBulkImportTotal] = useState(0);

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setBulkImportTotal(files.length);
    setIsProcessing(true);
    setLoadingCounter(0);
    setProductsToImport([]);

    const readFileAsPromise = (file: File): Promise<ProductToImport> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setLoadingCounter((prev) => prev + 1);
            resolve({
              id: `${file.name.split('.').slice(0, -1).join('.')}-${Date.now()}`,
              name: file.name.split('.').slice(0, -1).join('.'),
              price: 0,
              stock: 1,
              imageFile: file,
              previewUrl: event.target.result as string,
            });
          } else {
            reject(new Error(`Failed to read file: ${file.name}`));
          }
        };
        reader.onerror = (error) => reject(new Error(`Could not read file ${file.name}. It may be corrupt.`));
        reader.readAsDataURL(file);
      });
    };

    try {
      const allFiles = Array.from(files);
      const newProducts = await Promise.all(allFiles.map(readFileAsPromise));
      setProductsToImport(newProducts);
      setIsImportEditorOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "File Reading Error",
        description: error instanceof Error ? error.message : "An unknown error occurred while reading files.",
      });
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleProductToImportChange = (id: string, field: keyof ProductToImport, value: string | number) => {
    setProductsToImport((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleFinalBulkImport = async () => {
    setIsProcessing(true);
    const formData = new FormData();

    const productMetadata = productsToImport.map(({ imageFile, previewUrl, ...meta }) => ({
      ...meta,
      fileName: imageFile.name,
    }));

    formData.append('products', JSON.stringify(productMetadata));
    productsToImport.forEach((p) => {
      formData.append('files', p.imageFile);
    });

    try {
      const response = await axios.post('/api/products/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast({
          title: "Bulk Import Successful",
          description: response.data.message,
        });
        mutateProducts();
        setIsImportEditorOpen(false);
        setProductsToImport([]);
      } else {
          // This case should ideally not be hit with the new backend logic
          throw new Error(response.data.message || `An unexpected status code was received: ${response.status}`);
      }

    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || (error as Error).message || "An unknown error occurred.";
        toast({
            variant: "destructive",
            title: "Bulk Import Failed",
            description: errorMessage,
            duration: 8000,
        });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{selectedProduct ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
          <ProductForm product={selectedProduct} onSave={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isImportEditorOpen} onOpenChange={setIsImportEditorOpen}>
        <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Bulk Import Products</DialogTitle>
            <DialogDescription>Review and edit the products before importing. This is a transactional operation - all products must be valid to proceed.</DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto p-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[120px]">Price</TableHead>
                  <TableHead className="w-[100px]">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsToImport.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell><Image src={p.previewUrl} alt={p.name} width={60} height={60} className="rounded-md object-cover" /></TableCell>
                    <TableCell><Input value={p.name} onChange={(e) => handleProductToImportChange(p.id, 'name', e.target.value)} /></TableCell>
                    <TableCell><Input type="number" value={p.price} onChange={(e) => handleProductToImportChange(p.id, 'price', Number(e.target.value))} /></TableCell>
                    <TableCell><Input type="number" value={p.stock} onChange={(e) => handleProductToImportChange(p.id, 'stock', Number(e.target.value))} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportEditorOpen(false)} disabled={isProcessing}>Cancel</Button>
            <Button onClick={handleFinalBulkImport} disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Add {productsToImport.length} Products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-headline font-bold">{t("admin_nav.products")}</h1>
          <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" />{t("admin_products.add_product_button")}</Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <DriveLinkImporterCard />
          <Card>
            <CardHeader>
              <CardTitle>{t("admin_products.bulk_import_title")}</CardTitle>
              <CardDescription>{t("admin_products.bulk_import_desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Label>PNG Images</Label>
              <div className="flex items-center gap-4">
                <Input type="file" accept="image/png" multiple onChange={handleImageFileChange} disabled={isProcessing} className="flex-grow" />
                {isProcessing && loadingCounter > 0 && (<div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap"><Loader2 className="h-4 w-4 animate-spin" /><span>Loading: {loadingCounter}/{bulkImportTotal}</span></div>)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>{t("admin_products.product_list_title")}</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingProducts ? (<TableRow><TableCell colSpan={3}><Skeleton className="h-8 w-full" /></TableCell></TableRow>) : (products?.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.name?.[language] ?? p.name?.en}</TableCell>
                      <TableCell>${p.price}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEdit(p)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(p.id)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )))
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
