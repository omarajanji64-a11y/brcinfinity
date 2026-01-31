"use client";

import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc } from "firebase/firestore";
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

export default function DriveLinkImporterCard({ onProductImported }: DriveLinkImporterCardProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const firestore = useFirestore();

  const [link, setLink] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [style, setStyle] = useState<"Modern" | "Classic">("Modern");
  const [price, setPrice] = useState("0");
  const [stock, setStock] = useState("1");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [importedImageUrls, setImportedImageUrls] = useState<string[]>([]);

  const resolvedCategory = useMemo(() => {
    const trimmed = category.trim();
    return trimmed.length > 0 ? trimmed : null;
  }, [category]);

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleImport = async () => {
    if (!link) return;

    setIsImporting(true);
    setImportStatus("idle");
    setImportedImageUrls([]);

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

      const resolvedName = productName.trim() || folderName || t("admin_products.drive_import_default_name");
      const resolvedPrice = Number(price);
      const resolvedStock = Number(stock);
      const localizedName = { en: resolvedName, fr: resolvedName, tr: resolvedName };
      const localizedCategory = resolvedCategory
        ? { en: resolvedCategory, fr: resolvedCategory, tr: resolvedCategory }
        : DEFAULT_CATEGORY;

      const productData = {
        id: uuidv4(),
        name: localizedName,
        category: localizedCategory,
        style,
        shortDescription: {
          en: shortDescription,
          fr: shortDescription,
          tr: shortDescription,
        },
        description: {
          en: description,
          fr: description,
          tr: description,
        },
        price: Number.isFinite(resolvedPrice) ? resolvedPrice : 0,
        stock: Number.isFinite(resolvedStock) ? resolvedStock : 0,
        imageUrl: newUrls[0],
        imageUrls: newUrls,
      };

      const productRef = doc(firestore, "products", productData.id);
      await setDoc(productRef, productData, { merge: true });

      setImportedImageUrls(newUrls);
      setImportStatus("success");
      setLink(""); // Clear input on success
      setProductName("");
      setCategory("");
      setPrice("0");
      setStock("1");
      setShortDescription("");
      setDescription("");

      toast({
        title: t("admin_products.toast_drive_import_success_title"),
        description: t("admin_products.toast_drive_import_success_desc"),
      });

      onProductImported?.();
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

  return (
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="drive-product-name">{t("admin_products.drive_import_name_label")}</Label>
              <Input
                id="drive-product-name"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                placeholder={t("admin_products.drive_import_name_placeholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="drive-product-category">{t("admin_products.drive_import_category_label")}</Label>
              <Input
                id="drive-product-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder={t("admin_products.drive_import_category_placeholder")}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="drive-product-style">{t("admin_products.drive_import_style_label")}</Label>
              <Select value={style} onValueChange={(value) => setStyle(value as "Modern" | "Classic")}>
                <SelectTrigger id="drive-product-style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Modern">{t("admin_products.drive_import_style_modern")}</SelectItem>
                  <SelectItem value="Classic">{t("admin_products.drive_import_style_classic")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="drive-product-price">{t("admin_products.drive_import_price_label")}</Label>
              <Input
                id="drive-product-price"
                type="number"
                min="0"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="drive-product-stock">{t("admin_products.drive_import_stock_label")}</Label>
              <Input
                id="drive-product-stock"
                type="number"
                min="0"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="drive-product-short-desc">{t("admin_products.drive_import_short_desc_label")}</Label>
            <Textarea
              id="drive-product-short-desc"
              value={shortDescription}
              onChange={(event) => setShortDescription(event.target.value)}
              placeholder={t("admin_products.drive_import_short_desc_placeholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="drive-product-desc">{t("admin_products.drive_import_desc_label")}</Label>
            <Textarea
              id="drive-product-desc"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t("admin_products.drive_import_desc_placeholder")}
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
  );
}
