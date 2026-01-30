"use client";

import { useState } from "react";
import Papa from "papaparse";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Badge } from "@/components/ui/badge";
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
  FileText,
} from "lucide-react";

import { toast } from "@/hooks/use-toast";
import ProductForm from "./ProductForm";
import AiProductImporterCard from "./AiProductImporterCard";
import { useProducts } from "@/hooks/use-products";
import { useTranslation } from "react-i18next";

export default function ProductsPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  const { products, isLoading: isLoadingProducts, deleteProduct } = useProducts();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [importedProductsPreview, setImportedProductsPreview] = useState<any[]>([]);

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

  const handleImport = () => {
    if (!csvFile) return;

    setIsImporting(true);
    setImportStatus("idle");

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setImportedProductsPreview(results.data as any[]);
        setImportStatus("success");
        setIsImporting(false);
        setCsvFile(null);

        toast({
          title: t("admin_products.toast_import_success_title"),
          description: t("admin_products.toast_import_success_desc"),
        });
      },
      error: (error) => {
        console.error("PapaParse Error:", error);
        setIsImporting(false);
        setImportStatus("error");

        toast({
          variant: "destructive",
          title: t("admin_products.toast_import_error_title"),
          description: t("admin_products.toast_papa_parse_error_desc"),
        });
      },
    });
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
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

        {/* IMPORT */}
        <div className="grid gap-8 md:grid-cols-2">
          <AiProductImporterCard />
          <Card>
            <CardHeader>
              <CardTitle>{t("admin_products.import_products_title")}</CardTitle>
              <CardDescription>
                {t("admin_products.import_products_desc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label>CSV</Label>
              <div className="flex gap-2">
                <Input type="file" accept=".csv" onChange={handleFileChange} />
                <Button onClick={handleImport} disabled={isImporting || !csvFile}>
                  {isImporting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {t("admin_products.import_button")}
                </Button>
              </div>
            </CardContent>
            {importStatus === "success" && (
              <CardFooter>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Imported</AlertTitle>
                  <AlertDescription>
                    {importedProductsPreview.length} products ready
                  </AlertDescription>
                </Alert>
              </CardFooter>
            )}
            {importStatus === "error" && (
              <CardFooter>
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>CSV import failed</AlertDescription>
                </Alert>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* TABLE */}
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
                      <Skeleton className="h-6 w-full" />
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

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <ProductForm
            product={selectedProduct}
            onSave={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </div>
    </Dialog>
  );
}
