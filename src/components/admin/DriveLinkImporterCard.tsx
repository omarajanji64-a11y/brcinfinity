"use client";

import { useState } from "react";
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
import { Upload, Loader2, CheckCircle, AlertTriangle, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";

export default function DriveLinkImporterCard() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [link, setLink] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [importedImageUrl, setImportedImageUrl] = useState<string | null>(null);

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleImport = async () => {
    if (!link) return;

    setIsImporting(true);
    setImportStatus("idle");
    setImportedImageUrl(null);

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

      const { imageUrls } = await response.json();
      const newUrl = imageUrls[0];

      setImportedImageUrl(newUrl);
      setImportStatus("success");
      setLink(""); // Clear input on success

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin_products.import_drive_link_title")}</CardTitle>
        <CardDescription>{t("admin_products.import_drive_link_desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Label htmlFor="drive-link">{t("admin_products.drive_link_label")}</Label>
        <div className="flex gap-2">
          <Input
            id="drive-link"
            type="url"
            placeholder="https://drive.google.com/file/d/..."
            value={link}
            onChange={handleLinkChange}
          />
          <Button onClick={handleImport} disabled={isImporting || !link}>
            {isImporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Link className="mr-2 h-4 w-4" />
            )}
            {t("admin_products.import_button")}
          </Button>
        </div>
      </CardContent>
      {importStatus === "success" && importedImageUrl && (
        <CardFooter>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>{t("admin_products.import_success_title")}</AlertTitle>
            <AlertDescription>
              <a href={importedImageUrl} target="_blank" rel="noopener noreferrer" className="underline">
                {t("admin_products.view_imported_image")}
              </a>
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