
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { doc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
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
import { setDocumentNonBlocking } from '@/firebase';

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
  price: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive()),
  stock: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().int().min(0)),
  imageUrl: z.string().url('Please enter a valid URL.'),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: Product;
  onSave: () => void;
}

export default function ProductForm({ product, onSave }: ProductFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const firestore = useFirestore();

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
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    if (!firestore) return;
    const productRef = doc(firestore, 'products', data.id);
    
    const productToSave = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
    };

    setDocumentNonBlocking(productRef, productToSave, { merge: true });

    toast({
      title: t('admin_products.toast_product_saved_title'),
      description: t('admin_products.toast_product_saved_desc'),
    });
    onSave();
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
         <FormField name="imageUrl" label={t('product_form.image_url_label')} placeholder="https://example.com/image.png" errors={errors.imageUrl} register={register} />
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
