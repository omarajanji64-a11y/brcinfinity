'use client';

import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, Plus, Trash2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  FIXED_CATEGORY_OPTIONS,
  createLocalizedText,
  getFixedCategoryAdminLabel,
  getLocalizedText,
  normalizeCategoryKey,
  type Product,
  type ProductStyle,
} from '@/lib/products';
import { upsertStoredProduct } from '@/lib/product-storage';

type ProductFormProps = {
  product?: Product | null;
  onSaved: () => void;
};

type ProductFormState = {
  id: string;
  name: string;
  category: string;
  style: ProductStyle;
  shortDescription: string;
  description: string;
  price: string;
  stock: string;
  imageUrls: string[];
};

const emptyFormState = (): ProductFormState => ({
  id: uuidv4(),
  name: '',
  category: '',
  style: 'Modern',
  shortDescription: '',
  description: '',
  price: '0',
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
    category:
      getFixedCategoryAdminLabel(product.categoryKey) ||
      getFixedCategoryAdminLabel(getLocalizedText(product.category, 'tr') || getLocalizedText(product.category, 'en')),
    style: product.style,
    shortDescription:
      getLocalizedText(product.shortDescription, 'tr') || getLocalizedText(product.shortDescription, 'en'),
    description: getLocalizedText(product.description, 'tr') || getLocalizedText(product.description, 'en'),
    price: String(product.price ?? 0),
    stock: String(product.stock ?? 0),
    imageUrls: product.imageUrls.length > 0 ? product.imageUrls : product.imageUrl ? [product.imageUrl] : [''],
  };
};

export default function ProductForm({ product, onSaved }: ProductFormProps) {
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
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Gorseller yuklenemedi.');
      }

      const uploadedUrls = Array.isArray(payload.imageUrls)
        ? payload.imageUrls.filter((url: unknown): url is string => typeof url === 'string')
        : [];

      if (uploadedUrls.length === 0) {
        throw new Error('Sunucudan gecerli gorsel adresi donmedi.');
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
        title: 'Gorseller yuklendi',
        description: `${uploadedUrls.length} gorsel forma eklendi.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Yukleme basarisiz',
        description: error instanceof Error ? error.message : 'Gorseller yuklenemedi.',
      });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = form.name.trim();
    const trimmedCategory = form.category.trim();
    const trimmedShortDescription = form.shortDescription.trim();
    const trimmedDescription = form.description.trim();
    const resolvedPrice = Number(form.price);
    const resolvedStock = Number(form.stock);

    if (!trimmedName) {
      toast({
        variant: 'destructive',
        title: 'Urun adi gerekli',
        description: 'Kaydetmeden once urun adini gir.',
      });
      return;
    }

    if (!trimmedCategory) {
      toast({
        variant: 'destructive',
        title: 'Kategori gerekli',
        description: 'Filtrelerin calismasi icin kategori gir.',
      });
      return;
    }

    if (validImageUrls.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Gorsel gerekli',
        description: 'En az bir gecerli https gorsel adresi ekle.',
      });
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        id: form.id,
        name: createLocalizedText(trimmedName),
        category: createLocalizedText(trimmedCategory),
        categoryKey: normalizeCategoryKey(trimmedCategory),
        style: form.style,
        shortDescription: createLocalizedText(trimmedShortDescription),
        description: createLocalizedText(trimmedDescription),
        price: Number.isFinite(resolvedPrice) ? resolvedPrice : 0,
        stock: Number.isFinite(resolvedStock) ? resolvedStock : 0,
        imageUrl: validImageUrls[0],
        imageUrls: validImageUrls,
      };

      upsertStoredProduct(payload);

      toast({
        title: 'Urun kaydedildi',
        description: 'Degisiklikler urun listesine yansitildi.',
      });

      onSaved();

      if (!product) {
        setForm(emptyFormState());
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Kaydetme basarisiz',
        description: error instanceof Error ? error.message : 'Urun kaydedilemedi.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="product-name">Urun adi</Label>
          <Input
            id="product-name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Ornek: Royal Koltuk Takimi"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-category">Kategori</Label>
          <Select value={form.category || undefined} onValueChange={(value) => updateField('category', value)}>
            <SelectTrigger id="product-category">
              <SelectValue placeholder="Kategori sec" />
            </SelectTrigger>
            <SelectContent>
              {FIXED_CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.key} value={option.adminLabel}>
                  {option.adminLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-style">Stil</Label>
          <Select value={form.style} onValueChange={(value) => updateField('style', value as ProductStyle)}>
            <SelectTrigger id="product-style">
              <SelectValue placeholder="Stil sec" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Modern">Modern</SelectItem>
              <SelectItem value="Classic">Klasik</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-price">Fiyat</Label>
          <Input
            id="product-price"
            type="number"
            min="0"
            value={form.price}
            onChange={(event) => updateField('price', event.target.value)}
          />
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
          <Label htmlFor="product-short-description">Kisa aciklama</Label>
          <Textarea
            id="product-short-description"
            rows={3}
            value={form.shortDescription}
            onChange={(event) => updateField('shortDescription', event.target.value)}
            placeholder="Listeleme kartinda gorunecek kisa bilgi"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="product-description">Detay aciklamasi</Label>
          <Textarea
            id="product-description"
            rows={6}
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Urun detaylari"
          />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <div className="space-y-1">
          <Label>Urun gorselleri</Label>
          <p className="text-sm text-muted-foreground">
            Dosya yukleyebilir veya gorsel URL&apos;lerini manuel ekleyebilirsin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={isUploading}
            className="max-w-sm"
          />
          {isUploading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Gorseller yukleniyor...</span>
            </div>
          )}
          <Button type="button" variant="outline" onClick={addImageField}>
            <Plus className="mr-2 h-4 w-4" />
            URL alani ekle
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
                  <img src={url.trim()} alt={`Urun gorseli ${index + 1}`} className="h-40 w-full object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSaving || isUploading}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          {isSaving ? 'Kaydediliyor' : 'Urunu Kaydet'}
        </Button>
      </div>
    </form>
  );
}
