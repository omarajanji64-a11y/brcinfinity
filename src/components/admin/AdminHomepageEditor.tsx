'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ArrowLeft, ImagePlus, Loader2, Save } from 'lucide-react';

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
import { useHomepageCategoryShowcase } from '@/hooks/use-homepage-category-showcase';
import { useToast } from '@/hooks/use-toast';
import {
  HOMEPAGE_SETTINGS_COLLECTION,
  HOMEPAGE_SETTINGS_DOC,
  buildHomepageCategoryShowcasePayload,
  isValidHomepageImageUrl,
} from '@/lib/homepage';
import { buildCloudinaryImageUrl } from '@/lib/image-utils';
import type { Language } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n';
import type { CategoryImage } from '@/lib/site-config';

type EditableCategoryImage = CategoryImage;

const getCategoryLabel = (item: CategoryImage, language: Language) =>
  item.name[language] || item.name.tr || item.name.en || item.name.fr || 'Kategori';

export default function AdminHomepageEditor() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { language } = useTranslation();
  const { categoryShowcaseImages, isLoading, error } = useHomepageCategoryShowcase();

  const [items, setItems] = useState<EditableCategoryImage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const hasLocalChangesRef = useRef(hasLocalChanges);

  useEffect(() => {
    hasLocalChangesRef.current = hasLocalChanges;
  }, [hasLocalChanges]);

  useEffect(() => {
    if (hasLocalChangesRef.current) {
      return;
    }

    setItems(categoryShowcaseImages.map((item) => ({ ...item })));
  }, [categoryShowcaseImages]);

  const updateItem = (id: string, value: string) => {
    setHasLocalChanges(true);
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              imageUrl: value,
            }
          : item
      )
    );
  };

  const handleUpload = async (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadingId(id);

    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Gorsel yuklenemedi.');
      }

      const uploadedUrl = Array.isArray(payload.imageUrls)
        ? payload.imageUrls.find((url: unknown): url is string => typeof url === 'string')
        : undefined;
      const uploadErrors = Array.isArray(payload.errors)
        ? payload.errors.filter((message: unknown): message is string => typeof message === 'string' && message.trim().length > 0)
        : [];

      if (!uploadedUrl) {
        throw new Error('Sunucudan gecerli gorsel adresi donmedi.');
      }

      updateItem(id, uploadedUrl);

      toast({
        title: 'Gorsel yuklendi',
        description:
          uploadErrors.length > 0
            ? `Gorsel yuklendi, ${uploadErrors.length} dosya atlandi.`
            : 'Yeni gorsel kaydetmeye hazir.',
      });
    } catch (uploadError) {
      toast({
        variant: 'destructive',
        title: 'Yukleme basarisiz',
        description: uploadError instanceof Error ? uploadError.message : 'Gorsel yuklenemedi.',
      });
    } finally {
      setUploadingId(null);
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    const invalidItem = items.find((item) => !isValidHomepageImageUrl(item.imageUrl));

    if (invalidItem) {
      toast({
        variant: 'destructive',
        title: 'Gecersiz gorsel adresi',
        description: 'Her kategori icin gecerli bir gorsel adresi veya yuklenmis dosya olmasi gerekiyor.',
      });
      return;
    }

    setIsSaving(true);

    try {
      await setDoc(
        doc(firestore, HOMEPAGE_SETTINGS_COLLECTION, HOMEPAGE_SETTINGS_DOC),
        {
          categoryShowcaseImages: buildHomepageCategoryShowcasePayload(items),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setHasLocalChanges(false);

      toast({
        title: 'Editor guncellendi',
        description: 'Ana sayfa kategori gorselleri basariyla kaydedildi.',
      });
    } catch (saveError) {
      toast({
        variant: 'destructive',
        title: 'Kaydetme basarisiz',
        description: saveError instanceof Error ? saveError.message : 'Degisiklikler kaydedilemedi.',
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
            <p className="text-xs uppercase tracking-[0.35em] text-accent">Editor Mode</p>
            <CardTitle className="font-headline text-3xl">Ana sayfa gorsel editoru</CardTitle>
            <CardDescription className="max-w-2xl">
              Ana sayfadaki uc kategori kartinin fotograflarini buradan degistirebilirsin. Gorseli yukle, onizle ve
              kaydet.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Urun yonetimine don
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Siteyi ac</Link>
            </Button>
            <AdminLogoutButton />
          </div>
        </CardHeader>
      </Card>

      <Card className="border-white/10 bg-background/95 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle>Uc kategori karti</CardTitle>
          <CardDescription>
            Oturma Odasi, Yemek Odasi ve Yatak Odasi gorsellerini tek yerden guncelle. Kayit sonrasi ana sayfada
            otomatik gorunur.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error ? (
            <div className="rounded-[1.1rem] border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Editor verisi okunurken bir sorun olustu. Varsayilan gorseller gosteriliyor; yine de yeni gorselleri
              kaydedebilirsin.
            </div>
          ) : null}

          {isLoading && items.length === 0 ? (
            <div className="flex items-center gap-2 rounded-[1.1rem] border border-white/10 p-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Editor verisi yukleniyor...</span>
            </div>
          ) : null}

          <div className="grid gap-5 xl:grid-cols-3">
            {items.map((item) => {
              const previewUrl = buildCloudinaryImageUrl(item.imageUrl, {
                width: 900,
                height: 1120,
                crop: 'fill',
                gravity: 'auto',
                quality: 'auto:good',
              });
              const isUploading = uploadingId === item.id;
              const isValidPreview = isValidHomepageImageUrl(item.imageUrl);

              return (
                <div key={item.id} className="rounded-[1.3rem] border border-white/10 bg-black/10 p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                      <ImagePlus className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-medium text-primary">{getCategoryLabel(item, language)}</p>
                      <p className="text-xs text-muted-foreground">Kategori karti gorseli</p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[1rem] border border-white/10 bg-black/20">
                    {isValidPreview ? (
                      <img
                        src={previewUrl}
                        alt={getCategoryLabel(item, language)}
                        className="aspect-[4/4.8] w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex aspect-[4/4.8] items-center justify-center px-6 text-center text-sm text-muted-foreground">
                        Gecerli bir gorsel adresi girildiginde onizleme burada gorunecek.
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor={`homepage-image-url-${item.id}`}>Gorsel adresi</Label>
                    <Input
                      id={`homepage-image-url-${item.id}`}
                      value={item.imageUrl}
                      onChange={(event) => updateItem(item.id, event.target.value)}
                      placeholder="https://... veya /gorsel.jpg"
                    />
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor={`homepage-image-upload-${item.id}`}>Cihazdan yukle</Label>
                    <Input
                      id={`homepage-image-upload-${item.id}`}
                      type="file"
                      accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif,.jfif"
                      onChange={(event) => handleUpload(item.id, event)}
                      disabled={isUploading}
                    />
                  </div>

                  <div className="mt-4 text-sm text-muted-foreground">
                    {isUploading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Gorsel yukleniyor...
                      </span>
                    ) : isValidPreview ? (
                      'Kaydet butonuna bastiginda bu gorsel yayina alinacak.'
                    ) : (
                      'Bu kart icin gecerli bir gorsel baglantisi gerekiyor.'
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={handleSave} disabled={isSaving || Boolean(uploadingId)}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? 'Kaydediliyor' : 'Degisiklikleri Kaydet'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
