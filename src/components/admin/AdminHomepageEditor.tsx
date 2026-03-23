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
import { appendUploadFile } from '@/lib/upload-utils';

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
      appendUploadFile(formData, 'files', file, `homepage-${id}`);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Görsel yüklenemedi.');
      }

      const uploadedUrl = Array.isArray(payload.imageUrls)
        ? payload.imageUrls.find((url: unknown): url is string => typeof url === 'string')
        : undefined;
      const uploadErrors = Array.isArray(payload.errors)
        ? payload.errors.filter((message: unknown): message is string => typeof message === 'string' && message.trim().length > 0)
        : [];

      if (!uploadedUrl) {
        throw new Error('Sunucudan geçerli görsel adresi dönmedi.');
      }

      updateItem(id, uploadedUrl);

      toast({
        title: 'Görsel yüklendi',
        description:
          uploadErrors.length > 0
            ? `Görsel yüklendi, ${uploadErrors.length} dosya atlandı.`
            : 'Yeni görsel kaydetmeye hazır.',
      });
    } catch (uploadError) {
      toast({
        variant: 'destructive',
        title: 'Yükleme başarısız',
        description: uploadError instanceof Error ? uploadError.message : 'Görsel yüklenemedi.',
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
        title: 'Geçersiz görsel adresi',
        description: 'Her kategori için geçerli bir görsel adresi veya yüklenmiş dosya olması gerekiyor.',
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
        title: 'Editör güncellendi',
        description: 'Ana sayfa kategori görselleri başarıyla kaydedildi.',
      });
    } catch (saveError) {
      toast({
        variant: 'destructive',
        title: 'Kaydetme başarısız',
        description: saveError instanceof Error ? saveError.message : 'Değişiklikler kaydedilemedi.',
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
            <CardTitle className="font-headline text-3xl">Ana sayfa görsel editörü</CardTitle>
            <CardDescription className="max-w-2xl">
              Ana sayfadaki üç kategori kartının fotoğraflarını buradan değiştirebilirsin. Görseli yükle, önizle ve
              kaydet.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Ürün yönetimine dön
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Siteyi aç</Link>
            </Button>
            <AdminLogoutButton />
          </div>
        </CardHeader>
      </Card>

      <Card className="border-white/10 bg-background/95 shadow-2xl shadow-black/30">
        <CardHeader>
          <CardTitle>Üç kategori kartı</CardTitle>
          <CardDescription>
            Oturma Odası, Yemek Odası ve Yatak Odası görsellerini tek yerden güncelle. Kayıt sonrası ana sayfada
            otomatik görünür.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error ? (
            <div className="rounded-[1.1rem] border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Editör verisi okunurken bir sorun oluştu. Varsayılan görseller gösteriliyor; yine de yeni görselleri
              kaydedebilirsin.
            </div>
          ) : null}

          {isLoading && items.length === 0 ? (
            <div className="flex items-center gap-2 rounded-[1.1rem] border border-white/10 p-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Editör verisi yükleniyor...</span>
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
                      <p className="text-xs text-muted-foreground">Kategori kartı görseli</p>
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
                        Geçerli bir görsel adresi girildiğinde önizleme burada görünecek.
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor={`homepage-image-url-${item.id}`}>Görsel adresi</Label>
                    <Input
                      id={`homepage-image-url-${item.id}`}
                      value={item.imageUrl}
                      onChange={(event) => updateItem(item.id, event.target.value)}
                      placeholder="https://... veya /gorsel.jpg"
                    />
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor={`homepage-image-upload-${item.id}`}>Cihazdan yükle</Label>
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
                        Görsel yükleniyor...
                      </span>
                    ) : isValidPreview ? (
                      'Kaydet butonuna bastığında bu görsel yayına alınacak.'
                    ) : (
                      'Bu kart için geçerli bir görsel bağlantısı gerekiyor.'
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={handleSave} disabled={isSaving || Boolean(uploadingId)}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? 'Kaydediliyor' : 'Değişiklikleri Kaydet'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
