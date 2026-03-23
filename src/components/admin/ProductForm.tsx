'use client';

import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2, Plus, Trash2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase/client-provider';
import {
  FIXED_CATEGORY_OPTIONS,
  createLocalizedText,
  getLocalizedText,
  getProductCategoryKeys,
  type Product,
} from '@/lib/products';
import { appendUploadFile } from '@/lib/upload-utils';

type ProductFormProps = {
  product?: Product | null;
  onSaved: () => void;
};

type ProductFormState = {
  id: string;
  name: string;
  categoryKeys: string[];
  shortDescription: string;
  description: string;
  stock: string;
  imageUrls: string[];
};

const emptyFormState = (): ProductFormState => ({
  id: uuidv4(),
  name: '',
  categoryKeys: [],
  shortDescription: '',
  description: '',
  stock: '0',
  imageUrls: [''],
});

const buildFormState = (product?: Product | null): ProductFormState => {
  if (!product) {
    return emptyFormState();
  }

  return {
    id: product.id,
    name: getLocalizedText(product.name, 'tr') || getLocalizedText(product.name, 'en'),
    categoryKeys: getProductCategoryKeys(product).filter((key) =>
      FIXED_CATEGORY_OPTIONS.some((option) => option.key === key)
    ),
    shortDescription:
      getLocalizedText(product.shortDescription, 'tr') || getLocalizedText(product.shortDescription, 'en'),
    description: getLocalizedText(product.description, 'tr') || getLocalizedText(product.description, 'en'),
    stock: String(product.stock ?? 0),
    imageUrls: product.imageUrls.length > 0 ? product.imageUrls : product.imageUrl ? [product.imageUrl] : [''],
  };
};

export default function ProductForm({ product, onSaved }: ProductFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [form, setForm] = useState<ProductFormState>(() => buildFormState(product));
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setForm(buildFormState(product));
  }, [product]);

  const validImageUrls = useMemo(
    () => form.imageUrls.map((url) => url.trim()).filter((url) => url.startsWith('https://')),
    [form.imageUrls]
  );

  const updateField = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updateImageUrl = (index: number, value: string) => {
    setForm((current) => {
      const nextImageUrls = [...current.imageUrls];
      nextImageUrls[index] = value;
      return {
        ...current,
        imageUrls: nextImageUrls,
      };
    });
  };

  const toggleCategory = (categoryKey: string, isChecked: boolean) => {
    setForm((current) => {
      const nextCategoryKeys = isChecked
        ? Array.from(new Set([...current.categoryKeys, categoryKey]))
        : current.categoryKeys.filter((key) => key !== categoryKey);

      return {
        ...current,
        categoryKeys: nextCategoryKeys,
      };
    });
  };

  const addImageField = () => {
    setForm((current) => ({
      ...current,
      imageUrls: [...current.imageUrls, ''],
    }));
  };

  const removeImageField = (index: number) => {
    setForm((current) => {
      const nextImageUrls = current.imageUrls.filter((_, currentIndex) => currentIndex !== index);
      return {
        ...current,
        imageUrls: nextImageUrls.length > 0 ? nextImageUrls : [''],
      };
    });
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file, index) => {
        appendUploadFile(formData, 'files', file, `urun-gorsel-${index + 1}`);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Görseller yüklenemedi.');
      }

      const uploadedUrls = Array.isArray(payload.imageUrls)
        ? payload.imageUrls.filter((url: unknown): url is string => typeof url === 'string')
        : [];
      const uploadErrors = Array.isArray(payload.errors)
        ? payload.errors.filter((message: unknown): message is string => typeof message === 'string' && message.trim().length > 0)
        : [];

      if (uploadedUrls.length === 0) {
        throw new Error('Sunucudan geçerli görsel adresi dönmedi.');
      }

      setForm((current) => {
        const existingUrls = current.imageUrls.map((url) => url.trim()).filter(Boolean);
        const nextImageUrls = [...existingUrls, ...uploadedUrls];

        return {
          ...current,
          imageUrls: nextImageUrls.length > 0 ? nextImageUrls : [''],
        };
      });

      toast({
        title: 'Görseller yüklendi',
        description:
          uploadErrors.length > 0
            ? `${uploadedUrls.length} görsel eklendi, ${uploadErrors.length} dosya atlandı.`
            : `${uploadedUrls.length} görsel forma eklendi.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Yükleme başarısız',
        description: error instanceof Error ? error.message : 'Görseller yüklenemedi.',
      });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = form.name.trim();
    const selectedCategoryOptions = FIXED_CATEGORY_OPTIONS.filter((option) => form.categoryKeys.includes(option.key));
    const trimmedShortDescription = form.shortDescription.trim();
    const trimmedDescription = form.description.trim();
    const resolvedStock = Number(form.stock);

    if (selectedCategoryOptions.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Kategori gerekli',
        description: 'En az bir kategori seç.',
      });
      return;
    }

    if (validImageUrls.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Görsel gerekli',
        description: 'En az bir geçerli https görsel adresi ekle.',
      });
      return;
    }

    setIsSaving(true);

    try {
      const primaryCategory = selectedCategoryOptions[0];
      const payload = {
        id: form.id,
        name: createLocalizedText(trimmedName),
        category: createLocalizedText(primaryCategory.adminLabel),
        categoryKey: primaryCategory.key,
        categoryKeys: selectedCategoryOptions.map((option) => option.key),
        style: product?.style ?? 'Modern',
        shortDescription: createLocalizedText(trimmedShortDescription),
        description: createLocalizedText(trimmedDescription),
        price: product?.price ?? 0,
        stock: Number.isFinite(resolvedStock) ? resolvedStock : 0,
        imageUrl: validImageUrls[0],
        imageUrls: validImageUrls,
      };

      await setDoc(doc(firestore, 'products', form.id), payload, { merge: true });

      toast({
        title: 'Ürün kaydedildi',
        description: 'Değişiklikler ürün listesine yansıtıldı.',
      });

      onSaved();

      if (!product) {
        setForm(emptyFormState());
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Kaydetme başarısız',
        description: error instanceof Error ? error.message : 'Ürün kaydedilemedi.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="product-name">Ürün adı</Label>
          <Input
            id="product-name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Örnek: Royal Koltuk Takımı (isteğe bağlı)"
          />
        </div>

        <div className="space-y-3 sm:col-span-2">
          <Label>Kategoriler</Label>
          <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-3">
            {FIXED_CATEGORY_OPTIONS.map((option) => {
              const isChecked = form.categoryKeys.includes(option.key);

              return (
                <label
                  key={option.key}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-white/8 bg-white/[0.02] px-3 py-3 transition-colors hover:bg-white/[0.05]"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => toggleCategory(option.key, checked === true)}
                  />
                  <span className="text-sm text-primary">{option.adminLabel}</span>
                </label>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground">Bir ürün birden fazla kategoride görünebilir.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-stock">Stok</Label>
          <Input
            id="product-stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={(event) => updateField('stock', event.target.value)}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="product-short-description">Kısa açıklama</Label>
          <Textarea
            id="product-short-description"
            rows={3}
            value={form.shortDescription}
            onChange={(event) => updateField('shortDescription', event.target.value)}
            placeholder="Listeleme kartında görünecek kısa bilgi"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="product-description">Detay açıklaması</Label>
          <Textarea
            id="product-description"
            rows={6}
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Ürün detayları"
          />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <div className="space-y-1">
          <Label>Ürün görselleri</Label>
          <p className="text-sm text-muted-foreground">
            Dosya yükleyebilir veya görsel URL&apos;lerini manuel ekleyebilirsin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif,.jfif"
            multiple
            onChange={handleUpload}
            disabled={isUploading}
            className="max-w-sm"
          />
          {isUploading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Görseller yükleniyor...</span>
            </div>
          )}
          <Button type="button" variant="outline" onClick={addImageField}>
            <Plus className="mr-2 h-4 w-4" />
            URL alanı ekle
          </Button>
        </div>

        <div className="space-y-4">
          {form.imageUrls.map((url, index) => (
            <div key={`${form.id}-image-${index}`} className="rounded-lg border p-3">
              <div className="flex items-start gap-2">
                <Input
                  value={url}
                  onChange={(event) => updateImageUrl(index, event.target.value)}
                  placeholder="https://..."
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeImageField(index)}
                  disabled={form.imageUrls.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {url.trim().startsWith('https://') && (
                <div className="mt-3 overflow-hidden rounded-md border bg-muted">
                  <img src={url.trim()} alt={`Ürün görseli ${index + 1}`} className="h-40 w-full object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSaving || isUploading}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          {isSaving ? 'Kaydediliyor' : 'Ürünü Kaydet'}
        </Button>
      </div>
    </form>
  );
}
