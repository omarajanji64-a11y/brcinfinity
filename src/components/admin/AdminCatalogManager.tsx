'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ArrowLeft, FileText, Loader2, PlusCircle, Save, Trash2, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import AdminLogoutButton from '@/components/admin/AdminLogoutButton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirestore } from '@/firebase/client-provider';
import { useToast } from '@/hooks/use-toast';
import { useCatalogs } from '@/hooks/use-catalogs';
import {
  CATALOG_SETTINGS_COLLECTION,
  CATALOG_SETTINGS_DOC,
  isValidCatalogUrl,
  type Catalog,
} from '@/lib/catalogs';
import { useTranslation } from '@/lib/i18n';
import { sanitizeUploadFileName } from '@/lib/upload-utils';

type CatalogFormItem = Catalog;

const createEmptyCatalog = (): CatalogFormItem => ({
  id: uuidv4(),
  name: '',
  url: '',
});

const stripPdfExtension = (value: string) =>
  value
    .replace(/\.pdf$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export default function AdminCatalogManager() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { catalogs, isLoading, error } = useCatalogs();

  const [items, setItems] = useState<CatalogFormItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const hasLocalChangesRef = useRef(hasLocalChanges);

  useEffect(() => {
    hasLocalChangesRef.current = hasLocalChanges;
  }, [hasLocalChanges]);

  useEffect(() => {
    if (hasLocalChangesRef.current) {
      return;
    }

    setItems(catalogs.map((catalog) => ({ ...catalog })));
  }, [catalogs]);

  const updateItem = (id: string, field: keyof CatalogFormItem, value: string) => {
    setHasLocalChanges(true);
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const addCatalog = () => {
    setHasLocalChanges(true);
    setItems((current) => [...current, createEmptyCatalog()]);
  };

  const removeCatalog = (id: string) => {
    setHasLocalChanges(true);
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append('files', file, sanitizeUploadFileName(file, `katalog-${index + 1}`));
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'PDF dosyalari yuklenemedi.');
      }

      const uploadedUrls = Array.isArray(payload.pdfUrls)
        ? payload.pdfUrls.filter((url: unknown): url is string => typeof url === 'string')
        : Array.isArray(payload.uploadedUrls)
          ? payload.uploadedUrls.filter((url: unknown): url is string => typeof url === 'string')
          : [];

      if (uploadedUrls.length === 0) {
        throw new Error('Sunucudan gecerli PDF adresi donmedi.');
      }

      setHasLocalChanges(true);
      setItems((current) => [
        ...current,
        ...uploadedUrls.map((url, index) => ({
          id: uuidv4(),
          name: stripPdfExtension(files[index]?.name || `Katalog ${current.length + index + 1}`),
          url,
        })),
      ]);

      toast({
        title: 'PDF yuklendi',
        description: `${uploadedUrls.length} katalog forma eklendi. Kaydet butonuyla yayinlayabilirsin.`,
      });
    } catch (uploadError) {
      toast({
        variant: 'destructive',
        title: 'PDF yukleme basarisiz',
        description: uploadError instanceof Error ? uploadError.message : 'PDF dosyalari yuklenemedi.',
      });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    const preparedItems = items
      .map((item) => ({
        id: item.id.trim() || uuidv4(),
        name: item.name.trim(),
        url: item.url.trim(),
      }))
      .filter((item) => item.name || item.url);

    const invalidItem = preparedItems.find((item) => !item.name || !item.url || !isValidCatalogUrl(item.url));

    if (invalidItem) {
      toast({
        variant: 'destructive',
        title: 'Eksik katalog bilgisi',
        description: 'Her katalog icin ad ve gecerli bir PDF adresi girmen gerekiyor.',
      });
      return;
    }

    setIsSaving(true);

    try {
      await setDoc(
        doc(firestore, CATALOG_SETTINGS_COLLECTION, CATALOG_SETTINGS_DOC),
        {
          items: preparedItems,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setHasLocalChanges(false);

      toast({
        title: 'Kataloglar kaydedildi',
        description: 'PDF katalog listesi sitede kullanilmak uzere guncellendi.',
      });
    } catch (saveError) {
      toast({
        variant: 'destructive',
        title: 'Kaydetme basarisiz',
        description: saveError instanceof Error ? saveError.message : 'Kataloglar kaydedilemedi.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-6xl space-y-6">
      <Card className="border-white/10 bg-background/95 shadow-2xl shadow-black/30">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-accent">Admin Mode</p>
            <CardTitle className="font-headline text-3xl">{t('admin_nav.catalogs')}</CardTitle>
            <CardDescription className="max-w-2xl">
              PDF kataloglarini yukle, isimlendir ve sitedeki katalog indirme alaninda yayinla.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('admin_nav.products')}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Siteye don</Link>
            </Button>
            <AdminLogoutButton />
          </div>
        </CardHeader>
      </Card>

      <Card className="border-white/10 bg-background/95 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle>PDF katalog listesi</CardTitle>
          <CardDescription>
            PDF dosyalarini cihazindan yukleyebilir veya harici katalog baglantilarini manuel ekleyebilirsin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-[1.1rem] border border-white/10 bg-black/10 p-4">
            <div className="space-y-1">
              <Label htmlFor="catalog-pdf-upload">PDF yukle</Label>
              <p className="text-sm text-muted-foreground">
                Yuklenen her PDF yeni bir katalog satiri olarak eklenir. Son adimda kaydetmeyi unutma.
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
              <Input
                id="catalog-pdf-upload"
                type="file"
                accept="application/pdf,.pdf"
                multiple
                onChange={handlePdfUpload}
                disabled={isUploading}
                className="max-w-xl"
              />
              <div className="flex flex-wrap items-center gap-3">
                {isUploading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>PDF dosyalari yukleniyor...</span>
                  </div>
                ) : null}
                <Button type="button" variant="outline" onClick={addCatalog}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Bos katalog satiri ekle
                </Button>
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-[1.1rem] border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Kataloglar okunurken bir sorun olustu. Yine de duzenleme yapabilirsin, ancak kaydetmeden once baglantiyi
              kontrol etmen iyi olur.
            </div>
          ) : null}

          {isLoading && items.length === 0 ? (
            <div className="flex items-center gap-2 rounded-[1.1rem] border border-white/10 p-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Kataloglar yukleniyor...</span>
            </div>
          ) : null}

          {items.length === 0 ? (
            <div className="rounded-[1.1rem] border border-dashed border-white/12 p-8 text-center">
              <FileText className="mx-auto h-10 w-10 text-accent/80" />
              <p className="mt-4 text-base font-medium text-primary">Henuz katalog eklenmedi</p>
              <p className="mt-2 text-sm text-muted-foreground">
                PDF yukleyerek veya bos satir ekleyerek ilk katalogunu olusturabilirsin.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button type="button" variant="outline" onClick={addCatalog}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Bos katalog satiri
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => {
                const hasValidUrl = isValidCatalogUrl(item.url.trim());

                return (
                  <div key={item.id} className="rounded-[1.1rem] border border-white/10 p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-primary">Katalog {index + 1}</p>
                        <p className="text-xs text-muted-foreground">PDF baglantisi ve gorunen katalog adini duzenle.</p>
                      </div>
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeCatalog(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[1fr_1.6fr_auto]">
                      <div className="space-y-2">
                        <Label htmlFor={`catalog-name-${item.id}`}>Katalog adi</Label>
                        <Input
                          id={`catalog-name-${item.id}`}
                          value={item.name}
                          onChange={(event) => updateItem(item.id, 'name', event.target.value)}
                          placeholder="Ornek: 2026 Koleksiyonu"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`catalog-url-${item.id}`}>PDF adresi</Label>
                        <Input
                          id={`catalog-url-${item.id}`}
                          value={item.url}
                          onChange={(event) => updateItem(item.id, 'url', event.target.value)}
                          placeholder="https://example.com/katalog.pdf"
                        />
                      </div>

                      <div className="flex items-end">
                        {hasValidUrl ? (
                          <Button variant="outline" asChild className="w-full xl:w-auto">
                            <a href={item.url.trim()} target="_blank" rel="noopener noreferrer">
                              <Upload className="mr-2 h-4 w-4" />
                              PDF ac
                            </a>
                          </Button>
                        ) : (
                          <div className="w-full rounded-[0.9rem] border border-dashed border-white/10 px-4 py-2 text-sm text-muted-foreground xl:w-auto">
                            Gecerli link bekleniyor
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" onClick={handleSave} disabled={isSaving || isUploading}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? 'Kaydediliyor' : 'Kataloglari Kaydet'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
