"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import { collection, doc, writeBatch } from "firebase/firestore";

import { db } from "@/firebase/index";
import { useProducts } from "@/hooks/use-products";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";

import ProductForm from "@/components/admin/ProductForm";
import DriveLinkImporterCard from "@/components/admin/DriveLinkImporterCard";
import CloudinaryLinkImporterCard from "@/components/admin/CloudinaryLinkImporterCard";
import CsvLinkImporterCard from "@/components/admin/CsvLinkImporterCard";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, MoreHorizontal, Loader2 } from "lucide-react";

interface ProductToImport {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageFile: File;
  previewUrl: string;
}

interface UploadResponse {
  fileName: string;
  url: string;
}

interface MergeFormState {
  name: string;
  category: string;
  style: "Modern" | "Classic";
  price: string;
  stock: string;
  shortDescription: string;
  description: string;
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

  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [isMergeOpen, setIsMergeOpen] = useState(false);
  const [mergeForm, setMergeForm] = useState<MergeFormState>({
    name: "",
    category: "",
    style: "Modern",
    price: "0",
    stock: "0",
    shortDescription: "",
    description: "",
  });
  const [mergeImages, setMergeImages] = useState<string[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  const productList = products ?? [];

  const selectedCount = selectedProductIds.size;
  const selectedLabel = useMemo(
    () => t("admin_products.merge_selected_count", { count: selectedCount }),
    [selectedCount, t]
  );

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
              id: `${file.name.split(".").slice(0, -1).join(".")}-${Date.now()}`,
              name: file.name.split(".").slice(0, -1).join("."),
              price: 0,
              stock: 1,
              imageFile: file,
              previewUrl: event.target.result as string,
            });
          } else {
            reject(new Error(`Failed to read file: ${file.name}`));
          }
        };
        reader.onerror = () => reject(new Error(`Could not read file ${file.name}. It may be corrupt.`));
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
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsProcessing(false);
      e.target.value = "";
    }
  };

  const handleProductToImportChange = (id: string, field: keyof ProductToImport, value: string | number) => {
    setProductsToImport((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleFinalBulkImport = async () => {
    setIsProcessing(true);

    const imageFormData = new FormData();
    productsToImport.forEach((p) => {
      imageFormData.append("files", p.imageFile);
    });

    let uploadedImages: UploadResponse[];

    try {
      const response = await axios.post<{ message: string; uploads: UploadResponse[] }>(
        "/api/products/bulk",
        imageFormData
      );
      uploadedImages = response.data.uploads;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        variant: "destructive",
        title: "Image Upload Failed",
        description: axiosError.response?.data?.message || (error as Error).message,
      });
      setIsProcessing(false);
      return;
    }

    try {
      const batch = writeBatch(db);
      const productCollection = collection(db, "products");

      productsToImport.forEach((product) => {
        const uploadedImage = uploadedImages.find((up) => up.fileName === product.imageFile.name);
        if (!uploadedImage) {
          throw new Error(`Could not find uploaded image URL for ${product.imageFile.name}`);
        }

        const productData = {
          id: product.id,
          name: { en: product.name, fr: product.name, tr: product.name },
          category: { en: "Uncategorized", fr: "Non classé", tr: "Kategorize edilmemiş" },
          style: "Modern",
          shortDescription: { en: "", fr: "", tr: "" },
          description: { en: "", fr: "", tr: "" },
          price: product.price,
          stock: product.stock,
          imageUrl: uploadedImage.url,
        };

        const docRef = doc(productCollection, product.id);
        batch.set(docRef, productData);
      });

      await batch.commit();

      toast({
        title: "Bulk Import Successful",
        description: `${productsToImport.length} products have been added successfully.`,
      });
      mutateProducts();
      setIsImportEditorOpen(false);
      setProductsToImport([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Save Products",
        description: `The images were uploaded, but saving the products to the database failed. Reason: ${(error as Error).message}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSelected = (id: string) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAllSelected = (checked: boolean) => {
    if (!checked) {
      setSelectedProductIds(new Set());
      return;
    }
    setSelectedProductIds(new Set(productList.map((product) => product.id)));
  };

  const getLocalized = (value: any) => {
    if (!value) return "";
    return value?.[language] ?? value?.en ?? value?.tr ?? value?.fr ?? "";
  };

  const buildMergeImages = (selected: any[]) => {
    const merged: string[] = [];
    selected.forEach((product) => {
      const urls = Array.isArray(product.imageUrls) && product.imageUrls.length > 0
        ? product.imageUrls
        : product.imageUrl
          ? [product.imageUrl]
          : [];
      urls.forEach((url: string) => {
        if (url && !merged.includes(url)) merged.push(url);
      });
    });
    return merged;
  };

  const openMergeDialog = () => {
    const selected = productList.filter((product) => selectedProductIds.has(product.id));
    if (selected.length < 2) return;

    const first = selected[0];
    setMergeForm({
      name: getLocalized(first.name),
      category: getLocalized(first.category),
      style: first.style || "Modern",
      price: String(first.price ?? 0),
      stock: String(first.stock ?? 0),
      shortDescription: getLocalized(first.shortDescription),
      description: getLocalized(first.description),
    });

    setMergeImages(buildMergeImages(selected));
    setIsMergeOpen(true);
  };

  const handleMergeSave = async () => {
    const selected = productList.filter((product) => selectedProductIds.has(product.id));
    if (selected.length < 2) return;
    if (mergeImages.length === 0) {
      toast({
        variant: "destructive",
        title: t("admin_products.merge_error_title"),
        description: t("admin_products.merge_error_desc"),
      });
      return;
    }

    setIsMerging(true);

    try {
      const batch = writeBatch(db);
      const productCollection = collection(db, "products");
      const newId = uuidv4();

      const resolvedName = mergeForm.name.trim() || t("admin_products.image_links_default_name");
      const resolvedCategory = mergeForm.category.trim();
      const resolvedPrice = Number(mergeForm.price);
      const resolvedStock = Number(mergeForm.stock);

      const productData = {
        id: newId,
        name: { en: resolvedName, fr: resolvedName, tr: resolvedName },
        category: resolvedCategory
          ? { en: resolvedCategory, fr: resolvedCategory, tr: resolvedCategory }
          : { en: "Uncategorized", fr: "Non classé", tr: "Kategorize edilmemiş" },
        style: mergeForm.style,
        shortDescription: {
          en: mergeForm.shortDescription,
          fr: mergeForm.shortDescription,
          tr: mergeForm.shortDescription,
        },
        description: {
          en: mergeForm.description,
          fr: mergeForm.description,
          tr: mergeForm.description,
        },
        price: Number.isFinite(resolvedPrice) ? resolvedPrice : 0,
        stock: Number.isFinite(resolvedStock) ? resolvedStock : 0,
        imageUrl: mergeImages[0],
        imageUrls: mergeImages,
      };

      const newDocRef = doc(productCollection, newId);
      batch.set(newDocRef, productData);

      selected.forEach((product) => {
        const oldRef = doc(productCollection, product.id);
        batch.delete(oldRef);
      });

      await batch.commit();

      toast({
        title: t("admin_products.merge_success_title"),
        description: t("admin_products.merge_success_desc", { count: selected.length }),
      });

      setIsMergeOpen(false);
      setSelectedProductIds(new Set());
      mutateProducts();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("admin_products.merge_error_title"),
        description: error.message || t("admin_products.merge_error_desc"),
      });
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <ProductForm product={selectedProduct} onSave={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isImportEditorOpen} onOpenChange={setIsImportEditorOpen}>
        <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Bulk Import Products</DialogTitle>
            <DialogDescription>
              Review and edit the products before importing. This is a transactional operation - all products must be valid to proceed.
            </DialogDescription>
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
                {productsToImport.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Image
                        src={product.previewUrl}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={product.name}
                        onChange={(event) => handleProductToImportChange(product.id, "name", event.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={product.price}
                        onChange={(event) => handleProductToImportChange(product.id, "price", Number(event.target.value))}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={product.stock}
                        onChange={(event) => handleProductToImportChange(product.id, "stock", Number(event.target.value))}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportEditorOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleFinalBulkImport} disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add {productsToImport.length} Products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMergeOpen} onOpenChange={setIsMergeOpen}>
        <DialogContent className="max-w-[90vw] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("admin_products.merge_dialog_title")}</DialogTitle>
            <DialogDescription>{t("admin_products.merge_dialog_desc")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>{t("admin_products.merge_images_label")}</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {mergeImages.map((url, index) => (
                  <img
                    key={`merge-image-${index}`}
                    src={url}
                    alt={`Merge ${index + 1}`}
                    className="h-20 w-20 rounded-md object-cover"
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="merge-name">{t("product_form.name_label")}</Label>
                <Input
                  id="merge-name"
                  value={mergeForm.name}
                  onChange={(event) => setMergeForm((prev) => ({ ...prev, name: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="merge-category">{t("product_form.category_label")}</Label>
                <Input
                  id="merge-category"
                  value={mergeForm.category}
                  onChange={(event) => setMergeForm((prev) => ({ ...prev, category: event.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="merge-style">{t("product_form.style_label")}</Label>
                <Select
                  value={mergeForm.style}
                  onValueChange={(value) => setMergeForm((prev) => ({ ...prev, style: value as "Modern" | "Classic" }))}
                >
                  <SelectTrigger id="merge-style">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Modern">Modern</SelectItem>
                    <SelectItem value="Classic">Classic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="merge-price">{t("product_form.price_label")}</Label>
                <Input
                  id="merge-price"
                  type="number"
                  min="0"
                  value={mergeForm.price}
                  onChange={(event) => setMergeForm((prev) => ({ ...prev, price: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="merge-stock">{t("product_form.stock_label")}</Label>
                <Input
                  id="merge-stock"
                  type="number"
                  min="0"
                  value={mergeForm.stock}
                  onChange={(event) => setMergeForm((prev) => ({ ...prev, stock: event.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="merge-short">{t("product_form.short_desc_label")}</Label>
              <Textarea
                id="merge-short"
                value={mergeForm.shortDescription}
                onChange={(event) => setMergeForm((prev) => ({ ...prev, shortDescription: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="merge-desc">{t("product_form.long_desc_label")}</Label>
              <Textarea
                id="merge-desc"
                value={mergeForm.description}
                onChange={(event) => setMergeForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMergeOpen(false)} disabled={isMerging}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleMergeSave} disabled={isMerging}>
              {isMerging && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("admin_products.merge_save_button")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold">{t("admin_nav.products")}</h1>
            <p className="text-sm text-muted-foreground">{selectedLabel}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={openMergeDialog} disabled={selectedCount < 2}>
              {t("admin_products.merge_products_button", { count: selectedCount })}
            </Button>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("admin_products.add_product_button")}
            </Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <DriveLinkImporterCard onProductImported={mutateProducts} />
          <CloudinaryLinkImporterCard onProductImported={mutateProducts} />
          <CsvLinkImporterCard onProductImported={mutateProducts} />
          <Card>
            <CardHeader>
              <CardTitle>{t("admin_products.bulk_import_title")}</CardTitle>
              <CardDescription>{t("admin_products.bulk_import_desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Label>PNG Images</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/png"
                  multiple
                  onChange={handleImageFileChange}
                  disabled={isProcessing}
                  className="flex-grow"
                />
                {isProcessing && loadingCounter > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>
                      Loading: {loadingCounter}/{bulkImportTotal}
                    </span>
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
                  <TableHead className="w-[60px]">
                    <Checkbox
                      checked={selectedCount > 0 && selectedCount === productList.length}
                      onCheckedChange={(checked) => toggleAllSelected(checked === true)}
                      aria-label={t("admin_products.merge_select_label")}
                    />
                  </TableHead>
                  <TableHead>{t("admin_products.table_header_name")}</TableHead>
                  <TableHead>{t("admin_products.table_header_price")}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingProducts ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ) : (
                  productList.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProductIds.has(product.id)}
                          onCheckedChange={() => toggleSelected(product.id)}
                          aria-label={t("admin_products.merge_select_label")}
                        />
                      </TableCell>
                      <TableCell>{product.name?.[language] ?? product.name?.en}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEdit(product)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product.id)}>
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
