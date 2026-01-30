
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Plus, X } from 'lucide-react';
import { useFirestore } from '@/firebase/client-provider';
import { Product } from '@/lib/data';
import { useTranslation } from '@/lib/i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const localizedStringSchema = z.object({
  en: z.string(),
  fr: z.string(),
  tr: z.string(),
}).partial().refine(data => !!data.en || !!data.fr || !!data.tr, {
  message: 'At least one language must be filled for this field.',
  path: ['tr'], // Show error on the default tab
});

const productFormSchema = z.object({
  id: z.string(),
  name: localizedStringSchema,
  category: localizedStringSchema,
  style: z.enum(['Modern', 'Classic']),
  shortDescription: localizedStringSchema,
  description: localizedStringSchema,
  price: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().min(0)),
  stock: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().int().min(0)),
  imageUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  imageUrls: z.array(z.string().url('Please enter a valid URL.')).optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: Product | null;
  onSave: () => void;
}

export default function ProductForm({ product, onSave }: ProductFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const firestore = useFirestore();

  // Initialize imageUrls from product, or from imageUrl for backward compatibility
  // Always ensure at least one empty field is available
  const initialImageUrls = product?.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls 
    : (product?.imageUrl ? [product.imageUrl] : ['']);

  const defaultValues: ProductFormData = {
    id: product?.id || uuidv4(),
    name: product?.name || { en: '', fr: '', tr: '' },
    category: product?.category || { en: '', fr: '', tr: '' },
    style: product?.style || 'Classic',
    shortDescription: product?.shortDescription || { en: '', fr: '', tr: '' },
    description: product?.description || { en: '', fr: '', tr: '' },
    price: product?.price || 0,
    stock: product?.stock || 0,
    imageUrl: product?.imageUrl || '',
    imageUrls: initialImageUrls,
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const imageUrls = watch('imageUrls') || [];

  const addImageUrl = () => {
    const currentUrls = imageUrls || [];
    setValue('imageUrls', [...currentUrls, ''], { shouldValidate: true });
  };

  const removeImageUrl = (index: number) => {
    const currentUrls = imageUrls || [];
    const newUrls = currentUrls.filter((_, i) => i !== index);
    setValue('imageUrls', newUrls, { shouldValidate: true });
  };

  const updateImageUrl = (index: number, url: string) => {
    const currentUrls = imageUrls || [];
    const newUrls = [...currentUrls];
    newUrls[index] = url;
    setValue('imageUrls', newUrls, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    if (!firestore) return;
    const productRef = doc(firestore, 'products', data.id);
    
    // Filter out empty URLs and ensure we have at least one image
    const validImageUrls = (data.imageUrls || []).filter(url => url && url.trim() !== '');
    
    // For backward compatibility, set imageUrl to the first image if available
    const primaryImageUrl = validImageUrls.length > 0 ? validImageUrls[0] : (data.imageUrl || '');
    
    const productToSave = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        imageUrl: primaryImageUrl, // Keep for backward compatibility
        imageUrls: validImageUrls, // New field for multiple images
    };

    try {
      await setDoc(productRef, productToSave, { merge: true });
      toast({
        title: t('admin_products.toast_product_saved_title'),
        description: t('admin_products.toast_product_saved_desc'),
      });
      onSave();
    } catch (e) {
        console.error(e);
        toast({
            variant: "destructive",
            title: t('admin_products.toast_delete_error_title'),
            description: (e as Error).message,
        });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="tr" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tr">{t('product_form.lang_tab_tr')}</TabsTrigger>
          <TabsTrigger value="en">{t('product_form.lang_tab_en')}</TabsTrigger>
          <TabsTrigger value="fr">{t('product_form.lang_tab_fr')}</TabsTrigger>
        </TabsList>
        <TabsContent value="tr" className="space-y-4 pt-4">
          <FormField name="name.tr" label={t('product_form.name_label')} errors={errors.name} register={register} />
          <FormField name="category.tr" label={t('product_form.category_label')} errors={errors.category} register={register} />
          <FormField name="shortDescription.tr" label={t('product_form.short_desc_label')} errors={errors.shortDescription} register={register} isTextarea />
          <FormField name="description.tr" label={t('product_form.long_desc_label')} errors={errors.description} register={register} isTextarea />
        </TabsContent>
        <TabsContent value="en" className="space-y-4 pt-4">
          <FormField name="name.en" label={t('product_form.name_label')} errors={errors.name} register={register} />
          <FormField name="category.en" label={t('product_form.category_label')} errors={errors.category} register={register} />
          <FormField name="shortDescription.en" label={t('product_form.short_desc_label')} errors={errors.shortDescription} register={register} isTextarea />
          <FormField name="description.en" label={t('product_form.long_desc_label')} errors={errors.description} register={register} isTextarea />
        </TabsContent>
        <TabsContent value="fr" className="space-y-4 pt-4">
          <FormField name="name.fr" label={t('product_form.name_label')} errors={errors.name} register={register} />
          <FormField name="category.fr" label={t('product_form.category_label')} errors={errors.category} register={register} />
          <FormField name="shortDescription.fr" label={t('product_form.short_desc_label')} errors={errors.shortDescription} register={register} isTextarea />
          <FormField name="description.fr" label={t('product_form.long_desc_label')} errors={errors.description} register={register} isTextarea />
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         <div className="space-y-2">
            <Label htmlFor="style">{t('product_form.style_label')}</Label>
            <Select onValueChange={(value) => setValue('style', value as 'Modern' | 'Classic')} defaultValue={defaultValues.style}>
                <SelectTrigger id="style">
                    <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Modern">Modern</SelectItem>
                    <SelectItem value="Classic">Classic</SelectItem>
                </SelectContent>
            </Select>
         </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Product Images (Cloudinary URLs)</Label>
          <p className="text-sm text-muted-foreground">Add multiple Cloudinary image URLs for this product</p>
        </div>
        <div className="space-y-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-2 relative bg-card">
              <div className="flex gap-2 items-center">
                <Input
                  type="url"
                  placeholder="https://res.cloudinary.com/your-cloud/image/upload/v1234567/product.jpg"
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeImageUrl(index)}
                  disabled={imageUrls.length === 1}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {url && url.startsWith('https://') && (
                <div className="mt-2 rounded-md overflow-hidden border">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addImageUrl}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Image
          </Button>
        </div>
        {errors.imageUrls && (
          <p className="text-sm text-destructive">{errors.imageUrls.message}</p>
        )}
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField name="price" label={t('product_form.price_label')} type="number" errors={errors.price} register={register} />
        <FormField name="stock" label={t('product_form.stock_label')} type="number" errors={errors.stock} register={register} />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {t('common.save_changes')}
        </Button>
      </div>
    </form>
  );
}

// Helper component for form fields to reduce repetition
function FormField({ name, label, type = 'text', placeholder, errors, register, isTextarea = false }: any) {
  const Component = isTextarea ? Textarea : Input;
  const error = errors?.[name.split('.')[1]];
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Component id={name} type={type} placeholder={placeholder} {...register(name)} />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
