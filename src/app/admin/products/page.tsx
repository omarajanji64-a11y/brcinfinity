"use client";

import { useState } from "react";
import Papa from "papaparse";
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
  CardFooter,
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  PlusCircle,
  MoreHorizontal,
  Upload,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
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
  const { products, isLoading: isLoadingProducts, deleteProduct, addProducts } = useProducts();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [importedProductsPreview, setImportedProductsPreview] = useState<any[]>([]);

  const [productsToImport, setProductsToImport] = useState<ProductToImport[]>([]);
  const [isBulkImporting, setIsBulkImporting] = useState(false);
  const [isImportEditorOpen, setIsImportEditorOpen] = useState(false);
  const [loadingCounter, setLoadingCounter] = useState(0);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvFile(e.target.files?.[0] ?? null);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsBulkImporting(true);
    setLoadingCounter(0);
    const newProducts: ProductToImport[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        newProducts.push({
          id: `${file.name}-${Date.now()}`,
          name: file.name.split('.').slice(0, -1).join('.'), // filename without extension
          price: 0,
          stock: 1,
          imageFile: file,
          previewUrl: event.target?.result as string,
        });
        
        setLoadingCounter(prev => prev + 1);

        if (newProducts.length === files.length) {
          setProductsToImport(newProducts);
          setIsImportEditorOpen(true);
          setIsBulkImporting(false);
        }
      };
      
      reader.readAsDataURL(file);
    }
     // Reset file input
     e.target.value = '';
  };

  const handleImport = () => {
    if (!csvFile) return;
    setIsImporting(true);
    setImportStatus("idle");
    // ... (existing CSV import logic)
  };
  
  const handleProductToImportChange = (id: string, field: keyof ProductToImport, value: string | number) => {
    setProductsToImport(prev => 
      prev.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  };

  const handleFinalBulkImport = async () => {
    setIsBulkImporting(true);
    const formData = new FormData();
    
    const productMetadata = productsToImport.map(({ imageFile, previewUrl, ...meta }) => ({
        ...meta,
        fileName: imageFile.name,
    }));

    formData.append('products', JSON.stringify(productMetadata));

    productsToImport.forEach(p => {
        formData.append('files', p.imageFile);
    });

    try {
      await addProducts(formData);
      
      toast({
        title: t("admin_products.toast_bulk_import_success_title"),
        description: `${productsToImport.length} products added successfully.`,
      });
      
      setIsImportEditorOpen(false);
      setProductsToImport([]);

    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        variant: "destructive",
        title: t("admin_products.toast_bulk_import_error_title"),
        description: axiosError.response?.data?.message || t("admin_products.bulk_import_error_desc"),
      });
    } finally {
      setIsBulkImporting(false);
    }
  };


  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        {/* Main Product Form Dialog */}
        <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={selectedProduct}
            onSave={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isImportEditorOpen} onOpenChange={setIsImportEditorOpen}>
        {/* Bulk Import Editor Dialog */}
        <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Bulk Import Products</DialogTitle>
            <DialogDescription>
              Review and edit the products before importing.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto">
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
                {productsToImport.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Image src={p.previewUrl} alt={p.name} width={60} height={60} className="rounded-md object-cover"/>
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={p.name}
                        onChange={(e) => handleProductToImportChange(p.id, 'name', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number"
                        value={p.price}
                        onChange={(e) => handleProductToImportChange(p.id, 'price', Number(e.target.value))}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number"
                        value={p.stock}
                        onChange={(e) => handleProductToImportChange(p.id, 'stock', Number(e.target.value))}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportEditorOpen(false)} disabled={isBulkImporting}>Cancel</Button>
            <Button onClick={handleFinalBulkImport} disabled={isBulkImporting}>
              {isBulkImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add {productsToImport.length} Products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-headline font-bold">
            {t("admin_nav.products")}
          </h1>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("admin_products.add_product_button")}
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* DriveLinkImporterCard and CSV Importer */}
          <DriveLinkImporterCard />
          <Card>
            <CardHeader>
              <CardTitle>Bulk Product Import</CardTitle>
              <CardDescription>
                Upload multiple PNG images to create new products in bulk.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label>PNG Images</Label>
              <div className="flex gap-2">
                <Input type="file" accept="image/png" multiple onChange={handleImageFileChange} disabled={isBulkImporting} />
                {isBulkImporting && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading: {loadingCounter}/{productsToImport.length}</span>
                    </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin_products.product_list_title")}</CardTitle>
          </CardHeader>
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
                {isLoadingProducts ? (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ) : (
                  products?.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.name?.[language] ?? p.name?.en}</TableCell>
                      <TableCell>${p.price}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEdit(p)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(p.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
