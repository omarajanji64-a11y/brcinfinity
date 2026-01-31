"use client";

import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { collection, doc, writeBatch } from "firebase/firestore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import { useFirestore } from "@/firebase/client-provider";
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
import { Loader2, Link } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type ImportProductDraft = {
  id: string;
  imageUrl: string;
  imageUrls?: string[];
  name: string;
  category: string;
  style: "Modern" | "Classic";
  price: string;
  stock: string;
  shortDescription: string;
  description: string;
};

const DEFAULT_CATEGORY = {
  en: "Uncategorized",
  fr: "Non classé",
  tr: "Kategorize edilmemiş",
};

const splitLinks = (raw: string) => {
  return raw
    .split(/[\n,]+/)
    .map((link) => link.trim())
    .filter(Boolean);
};

interface CloudinaryLinkImporterCardProps {
  onProductImported?: () => void;
}

export default function CloudinaryLinkImporterCard({ onProductImported }: CloudinaryLinkImporterCardProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const firestore = useFirestore();

  const [links, setLinks] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [productsToImport, setProductsToImport] = useState<ImportProductDraft[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectedCount = selectedIds.size;
  const selectedLabel = useMemo(
    () => t("admin_products.merge_selected_count", { count: selectedCount }),
    [selectedCount, t]
  );

  const handleDraftChange = (id: string, field: keyof ImportProductDraft, value: string) => {
    setProductsToImport((prev) =>
      prev.map((product) => (product.id === id ? { ...product, [field]: value } : product))
    );
  };

  const handleImport = () => {
    const linkList = splitLinks(links);
    if (linkList.length === 0) {
      toast({
        variant: "destructive",
        title: t("admin_products.toast_drive_import_error_title"),
        description: t("admin_products.image_links_error_desc"),
      });
      return;
    }

      const drafts = linkList.map((url, index) => ({
        id: uuidv4(),
        imageUrl: url,
        imageUrls: [url],
        name: `${t("admin_products.image_links_default_name")} ${index + 1}`,
        category: "",
        style: "Modern",
        price: "0",
        stock: "1",
        shortDescription: "",
        description: "",
      }));

    setProductsToImport(drafts);
    setIsEditorOpen(true);
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleMergeSelected = () => {
    if (selectedIds.size < 2) return;

    setProductsToImport((prev) => {
      const selected = prev.filter((product) => selectedIds.has(product.id));
      if (selected.length < 2) return prev;

      const allUrls: string[] = [];
      selected.forEach((product) => {
        const urls = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [product.imageUrl];
        urls.forEach((url) => {
          if (!allUrls.includes(url)) allUrls.push(url);
        });
      });

      const base = selected[0];
      const merged: ImportProductDraft = {
        ...base,
        id: uuidv4(),
        imageUrl: allUrls[0],
        imageUrls: allUrls,
      };

      const remaining = prev.filter((product) => !selectedIds.has(product.id));
      return [merged, ...remaining];
    });

    setSelectedIds(new Set());
  };

  const handleSaveProducts = async () => {
    if (productsToImport.length === 0) return;
    setIsSaving(true);

    try {
      const batch = writeBatch(firestore);
      const productCollection = collection(firestore, "products");

      productsToImport.forEach((product) => {
        const resolvedName = product.name.trim() || t("admin_products.image_links_default_name");
        const resolvedCategory = product.category.trim();
        const localizedName = { en: resolvedName, fr: resolvedName, tr: resolvedName };
        const localizedCategory = resolvedCategory.length > 0
          ? { en: resolvedCategory, fr: resolvedCategory, tr: resolvedCategory }
          : DEFAULT_CATEGORY;
        const resolvedPrice = Number(product.price);
        const resolvedStock = Number(product.stock);

        const resolvedImages = product.imageUrls && product.imageUrls.length > 0
          ? product.imageUrls
          : [product.imageUrl];

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
          imageUrl: resolvedImages[0],
          imageUrls: resolvedImages,
        };

        const docRef = doc(productCollection, product.id);
        batch.set(docRef, productData, { merge: true });
      });

      await batch.commit();

      setIsEditorOpen(false);
      setProductsToImport([]);
      setLinks("");
      onProductImported?.();
      toast({
        title: t("admin_products.toast_product_saved_title"),
        description: t("admin_products.toast_product_saved_desc"),
      });
    } catch (error: any) {
      console.error("Image Links Import Save Error:", error);
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
            <DialogTitle>{t("admin_products.image_links_editor_title")}</DialogTitle>
            <DialogDescription>{t("admin_products.image_links_editor_desc")}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">{selectedLabel}</span>
            <Button
              variant="outline"
              onClick={handleMergeSelected}
              disabled={selectedCount < 2}
            >
              {t("admin_products.merge_selected_button", { count: selectedCount })}
            </Button>
          </div>
          <div className="flex-grow overflow-y-auto p-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70px]">{t("admin_products.merge_select_label")}</TableHead>
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
                      <Checkbox
                        checked={selectedIds.has(product.id)}
                        onCheckedChange={() => toggleSelected(product.id)}
                        aria-label={t("admin_products.merge_select_label")}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-24 w-24 rounded-md object-cover"
                        />
                        {product.imageUrls && product.imageUrls.length > 1 && (
                          <div className="flex flex-wrap gap-1">
                            {product.imageUrls.slice(0, 4).map((url, index) => (
                              <img
                                key={`${product.id}-thumb-${index}`}
                                src={url}
                                alt={`${product.name} ${index + 1}`}
                                className="h-10 w-10 rounded-sm object-cover"
                              />
                            ))}
                          </div>
                        )}
                      </div>
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
          <CardTitle>{t("admin_products.image_links_title")}</CardTitle>
          <CardDescription>{t("admin_products.image_links_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cloudinary-links">{t("admin_products.image_links_label")}</Label>
              <Textarea
                id="cloudinary-links"
                placeholder={t("admin_products.image_links_placeholder")}
                value={links}
                onChange={(event) => setLinks(event.target.value)}
              />
            </div>
            <Button onClick={handleImport} disabled={!links.trim()}>
              <Link className="mr-2 h-4 w-4" />
              {t("admin_products.image_links_button")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
