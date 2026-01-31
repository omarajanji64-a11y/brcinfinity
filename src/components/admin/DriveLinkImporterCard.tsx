"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { collection, doc, writeBatch } from "firebase/firestore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertTriangle, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import { Textarea } from "@/components/ui/textarea";
import { useFirestore } from "@/firebase/client-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DriveImportResponse = {
  imageUrls: string[];
  folderName?: string | null;
  source: "file" | "folder";
};

interface DriveLinkImporterCardProps {
  onProductImported?: () => void;
}

const DEFAULT_CATEGORY = {
  en: "Uncategorized",
  fr: "Non classé",
  tr: "Kategorize edilmemiş",
};

type ImportProductDraft = {
  id: string;
  imageUrl: string;
  name: string;
  category: string;
  style: "Modern" | "Classic";
  price: string;
  stock: string;
  shortDescription: string;
  description: string;
};

export default function DriveLinkImporterCard({ onProductImported }: DriveLinkImporterCardProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const firestore = useFirestore();

  const [link, setLink] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [importedImageUrls, setImportedImageUrls] = useState<string[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [productsToImport, setProductsToImport] = useState<ImportProductDraft[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleImport = async () => {
    if (!link) return;

    setIsImporting(true);
    setImportStatus("idle");
    setImportedImageUrls([]);
    setProductsToImport([]);

    try {
      const response = await fetch("/api/upload/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ link }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Import failed");
      }

      const { imageUrls, folderName } = (await response.json()) as DriveImportResponse;
      const newUrls = imageUrls || [];
      if (newUrls.length === 0) {
        throw new Error(t("admin_products.toast_drive_import_error_desc"));
      }

      setImportedImageUrls(newUrls);
      setImportStatus("success");

      const baseName = folderName?.trim() || t("admin_products.drive_import_default_name");
      const drafts: ImportProductDraft[] = newUrls.map((url, index) => ({
        id: uuidv4(),
        imageUrl: url,
        name: `${baseName} ${index + 1}`,
        category: "",
        style: "Modern",
        price: "0",
        stock: "1",
        shortDescription: "",
        description: "",
      }));

      setProductsToImport(drafts);
      setIsEditorOpen(true);

      toast({
        title: t("admin_products.toast_drive_import_success_title"),
        description: t("admin_products.toast_drive_import_success_desc"),
      });

    } catch (error: any) {
      console.error("Drive Import Error:", error);
      setImportStatus("error");
      toast({
        variant: "destructive",
        title: t("admin_products.toast_drive_import_error_title"),
        description: error.message || t("admin_products.toast_drive_import_error_desc"),
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDraftChange = (id: string, field: keyof ImportProductDraft, value: string) => {
    setProductsToImport((prev) =>
      prev.map((product) => (product.id === id ? { ...product, [field]: value } : product))
    );
  };

  const handleSaveProducts = async () => {
    if (productsToImport.length === 0) return;
    setIsSaving(true);

    try {
      const batch = writeBatch(firestore);
      const productCollection = collection(firestore, "products");

      productsToImport.forEach((product) => {
        const resolvedName = product.name.trim() || t("admin_products.drive_import_default_name");
        const resolvedCategory = product.category.trim();
        const localizedName = { en: resolvedName, fr: resolvedName, tr: resolvedName };
        const localizedCategory = resolvedCategory.length > 0
          ? { en: resolvedCategory, fr: resolvedCategory, tr: resolvedCategory }
          : DEFAULT_CATEGORY;
        const resolvedPrice = Number(product.price);
        const resolvedStock = Number(product.stock);

        const productData = {
          id: product.id,
          name: localizedName,
          category: localizedCategory,
          style: product.style,
          shortDescription: {
            en: product.shortDescription,
            fr: product.shortDescription,
            tr: product.shortDescription,
          },
          description: {
            en: product.description,
            fr: product.description,
            tr: product.description,
          },
          price: Number.isFinite(resolvedPrice) ? resolvedPrice : 0,
          stock: Number.isFinite(resolvedStock) ? resolvedStock : 0,
          imageUrl: product.imageUrl,
          imageUrls: [product.imageUrl],
        };

        const docRef = doc(productCollection, product.id);
        batch.set(docRef, productData, { merge: true });
      });

      await batch.commit();

      setIsEditorOpen(false);
      setProductsToImport([]);
      setLink("");
      onProductImported?.();
      toast({
        title: t("admin_products.toast_product_saved_title"),
        description: t("admin_products.toast_product_saved_desc"),
      });
    } catch (error: any) {
      console.error("Drive Import Save Error:", error);
      toast({
        variant: "destructive",
        title: t("admin_products.toast_drive_import_error_title"),
        description: error.message || t("admin_products.toast_drive_import_error_desc"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{t("admin_products.drive_import_editor_title")}</DialogTitle>
            <DialogDescription>{t("admin_products.drive_import_editor_desc")}</DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto p-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[90px]">{t("admin_products.table_header_image")}</TableHead>
                  <TableHead>{t("admin_products.table_header_name")}</TableHead>
                  <TableHead className="w-[140px]">{t("admin_products.drive_import_category_label")}</TableHead>
                  <TableHead className="w-[140px]">{t("admin_products.drive_import_style_label")}</TableHead>
                  <TableHead className="w-[120px]">{t("admin_products.table_header_price")}</TableHead>
                  <TableHead className="w-[120px]">{t("admin_products.table_header_stock")}</TableHead>
                  <TableHead>{t("admin_products.drive_import_short_desc_label")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsToImport.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={product.name}
                        onChange={(event) => handleDraftChange(product.id, "name", event.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={product.category}
                        onChange={(event) => handleDraftChange(product.id, "category", event.target.value)}
                        placeholder={t("admin_products.drive_import_category_placeholder")}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={product.style}
                        onValueChange={(value) => handleDraftChange(product.id, "style", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Modern">{t("admin_products.drive_import_style_modern")}</SelectItem>
                          <SelectItem value="Classic">{t("admin_products.drive_import_style_classic")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={product.price}
                        onChange={(event) => handleDraftChange(product.id, "price", event.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={product.stock}
                        onChange={(event) => handleDraftChange(product.id, "stock", event.target.value)}
                      />
                    </TableCell>
                    <TableCell className="min-w-[220px]">
                      <Textarea
                        value={product.shortDescription}
                        onChange={(event) => handleDraftChange(product.id, "shortDescription", event.target.value)}
                        placeholder={t("admin_products.drive_import_short_desc_placeholder")}
                      />
                      <Textarea
                        className="mt-2"
                        value={product.description}
                        onChange={(event) => handleDraftChange(product.id, "description", event.target.value)}
                        placeholder={t("admin_products.drive_import_desc_placeholder")}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)} disabled={isSaving}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSaveProducts} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("admin_products.drive_import_save_button", { count: productsToImport.length })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin_products.import_drive_link_title")}</CardTitle>
          <CardDescription>{t("admin_products.import_drive_link_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="drive-link">{t("admin_products.drive_link_label")}</Label>
              <Input
                id="drive-link"
                type="url"
                placeholder="https://drive.google.com/drive/folders/..."
                value={link}
                onChange={handleLinkChange}
              />
            </div>

            <Button onClick={handleImport} disabled={isImporting || !link}>
              {isImporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Link className="mr-2 h-4 w-4" />
              )}
              {t("admin_products.drive_import_button")}
            </Button>
          </div>
        </CardContent>
      {importStatus === "success" && importedImageUrls.length > 0 && (
        <CardFooter>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>{t("admin_products.import_success_title")}</AlertTitle>
            <AlertDescription>
              <div className="flex flex-col gap-2">
                <span>{t("admin_products.drive_import_success_count", { count: importedImageUrls.length })}</span>
                <a href={importedImageUrls[0]} target="_blank" rel="noopener noreferrer" className="underline">
                  {t("admin_products.view_imported_image")}
                </a>
              </div>
            </AlertDescription>
          </Alert>
        </CardFooter>
      )}
      {importStatus === "error" && (
        <CardFooter>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t("admin_products.import_error_title")}</AlertTitle>
          </Alert>
        </CardFooter>
      )}
      </Card>
    </>
  );
}
