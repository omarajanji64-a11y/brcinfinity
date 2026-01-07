'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Trash2, PlusCircle } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const createHomepageSchema = (t: (key: string) => string) => {
    const heroImageSchema = z.object({
      id: z.string(),
      imageUrl: z.string().url(t('validation.invalid_url')),
      description: z.string().min(3, t('validation.min_chars', {min: 3})),
    });

    const localizedStringSchema = z.object({
      en: z.string().optional().default(''),
      fr: z.string().optional().default(''),
      tr: z.string().optional().default(''),
    });

    const categoryImageSchema = z.object({
      id: z.string(),
      name: localizedStringSchema,
      imageUrl: z.string().url(t('validation.invalid_url')),
    });

    return z.object({
      title: localizedStringSchema,
      subtitle: localizedStringSchema,
      heroImages: z.array(heroImageSchema),
      categoryImages: z.array(categoryImageSchema),
    });
};

type HomepageFormData = z.infer<ReturnType<typeof createHomepageSchema>>;

const defaultValues: HomepageFormData = {
    title: {
      en: 'Experience True Luxury',
      fr: 'Vivez le vrai luxe',
      tr: 'Gerçek Lüksü Deneyimleyin',
    },
    subtitle: {
      en: 'Discover our collection of royal and classic furniture, where timeless elegance meets unparalleled craftsmanship.',
      fr: 'Découvrez notre collection de meubles royaux et classiques, où l\'élégance intemporelle rencontre un savoir-faire inégalé.',
      tr: 'Zamansız zarafetin benzersiz işçilikle buluştuğu royal ve klasik mobilya koleksiyonumuzu keşfedin.',
    },
    heroImages: [
        { id: 'hero-1', imageUrl: 'https://picsum.photos/seed/hero1/1280/720', description: 'Luxury living room' },
        { id: 'hero-2', imageUrl: 'https://picsum.photos/seed/hero2/1280/720', description: 'Elegant bedroom' },
    ],
    categoryImages: [
        { id: 'cat-living-room', name: { en: 'Living Room', fr: 'Salon', tr: 'Oturma Odası' }, imageUrl: 'https://picsum.photos/seed/cat-living/600/600' },
        { id: 'cat-dining-room', name: { en: 'Dining Room', fr: 'Salle à manger', tr: 'Yemek Odası' }, imageUrl: 'https://picsum.photos/seed/cat-dining/600/600' },
        { id: 'cat-bedroom', name: { en: 'Bedroom', fr: 'Chambre', tr: 'Yatak Odası' }, imageUrl: 'https://picsum.photos/seed/cat-bedroom/600/600' },
    ]
};


function HomepageForm({ initialData }: { initialData: HomepageFormData }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const firestore = useFirestore();

  const homepageSchema = createHomepageSchema(t);

  const homepageConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config/homepage');
  }, [firestore]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm<HomepageFormData>({
    resolver: zodResolver(homepageSchema),
    defaultValues: initialData,
  });

  const { fields: heroImageFields, append: appendHeroImage, remove: removeHeroImage } = useFieldArray({
    control,
    name: 'heroImages',
  });

  const { fields: categoryImageFields, append: appendCategoryImage, remove: removeCategoryImage } = useFieldArray({
      control,
      name: 'categoryImages',
  });

  const onSubmit: SubmitHandler<HomepageFormData> = async (data) => {
    if (!homepageConfigRef) {
        toast({
            variant: "destructive",
            title: t('admin_homepage.toast_error_title'),
            description: t('admin_homepage.toast_error_desc'),
        });
        return;
    }
    setIsSaving(true);
    
    try {
        await setDoc(homepageConfigRef, data, { merge: true });
        toast({
          title: t('admin_homepage.toast_success_title'),
          description: t('admin_homepage.toast_success_desc'),
        });
        reset(data);
    } catch(e) {
        console.error(e);
        toast({
            variant: "destructive",
            title: t('admin_homepage.toast_error_title'),
            description: (e as Error).message,
        });
    } finally {
        setIsSaving(false);
    }
  };
  
  const addNewHeroImage = () => {
    const newId = `new-hero-${Date.now()}`;
    appendHeroImage({ id: newId, imageUrl: 'https://picsum.photos/seed/new-image/1280/720', description: t('admin_homepage.new_hero_image_desc') });
  };

  const addNewCategory = () => {
      const newId = `new-cat-${Date.now()}`;
      appendCategoryImage({ id: newId, imageUrl: 'https://picsum.photos/seed/new-cat/600/600', name: { tr: t('admin_homepage.new_category_name'), en: '', fr: '' }});
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin_homepage.hero_content_title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="tr" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tr">{t('product_form.lang_tab_tr')}</TabsTrigger>
                  <TabsTrigger value="en">{t('product_form.lang_tab_en')}</TabsTrigger>
                  <TabsTrigger value="fr">{t('product_form.lang_tab_fr')}</TabsTrigger>
                </TabsList>
                <TabsContent value="tr" className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title.tr">{t('admin_homepage.main_title_label')}</Label>
                    <Input id="title.tr" {...register('title.tr')} />
                    {errors.title?.tr && <p className="text-sm text-destructive">{errors.title.tr.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitle.tr">{t('admin_homepage.subtitle_label')}</Label>
                    <Textarea id="subtitle.tr" {...register('subtitle.tr')} rows={4} />
                    {errors.subtitle?.tr && <p className="text-sm text-destructive">{errors.subtitle.tr.message}</p>}
                  </div>
                </TabsContent>
                <TabsContent value="en" className="pt-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title.en">{t('admin_homepage.main_title_label')}</Label>
                        <Input id="title.en" {...register('title.en')} />
                         {errors.title?.en && <p className="text-sm text-destructive">{errors.title.en.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subtitle.en">{t('admin_homepage.subtitle_label')}</Label>
                        <Textarea id="subtitle.en" {...register('subtitle.en')} rows={4} />
                         {errors.subtitle?.en && <p className="text-sm text-destructive">{errors.subtitle.en.message}</p>}
                    </div>
                </TabsContent>
                <TabsContent value="fr" className="pt-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title.fr">{t('admin_homepage.main_title_label')}</Label>
                        <Input id="title.fr" {...register('title.fr')} />
                        {errors.title?.fr && <p className="text-sm text-destructive">{errors.title.fr.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subtitle.fr">{t('admin_homepage.subtitle_label')}</Label>
                        <Textarea id="subtitle.fr" {...register('subtitle.fr')} rows={4} />
                        {errors.subtitle?.fr && <p className="text-sm text-destructive">{errors.subtitle.fr.message}</p>}
                    </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
             <CardHeader>
              <CardTitle>{t('admin_homepage.slideshow_config_title')}</CardTitle>
              <CardDescription>{t('admin_homepage.slideshow_config_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {heroImageFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-card">
                  <Label>{t('admin_homepage.image_label', { index: index + 1 })}</Label>
                    <div className="space-y-2">
                      <Label htmlFor={`heroImages.${index}.imageUrl`}>{t('admin_homepage.image_url_label')}</Label>
                      <Input
                        id={`heroImages.${index}.imageUrl`}
                        {...register(`heroImages.${index}.imageUrl`)}
                        placeholder="https://example.com/image.jpg"
                      />
                      {errors.heroImages?.[index]?.imageUrl && <p className="text-sm text-destructive">{errors.heroImages[index]?.imageUrl?.message}</p>}
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor={`heroImages.${index}.description`}>{t('admin_homepage.description_label')}</Label>
                      <Input
                        id={`heroImages.${index}.description`}
                        {...register(`heroImages.${index}.description`)}
                        placeholder={t('admin_homepage.description_placeholder')}
                      />
                      {errors.heroImages?.[index]?.description && <p className="text-sm text-destructive">{errors.heroImages[index]?.description?.message}</p>}
                    </div>
                    <Button type="button" variant="destructive" size="sm" className="absolute top-4 right-4" onClick={() => removeHeroImage(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addNewHeroImage}>
                <PlusCircle className="mr-2 h-4 w-4" /> {t('admin_homepage.add_new_image_button')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin_homepage.category_showcase_title')}</CardTitle>
              <CardDescription>{t('admin_homepage.category_showcase_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {categoryImageFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-card">
                  <Label>{t('admin_homepage.image_label', { index: index + 1 })}</Label>
                    <div className="space-y-2">
                        <Label htmlFor={`categoryImages.${index}.imageUrl`}>{t('admin_homepage.image_url_label')}</Label>
                        <Input
                            id={`categoryImages.${index}.imageUrl`}
                            {...register(`categoryImages.${index}.imageUrl`)}
                        />
                        {errors.categoryImages?.[index]?.imageUrl && <p className="text-sm text-destructive">{errors.categoryImages[index]?.imageUrl?.message}</p>}
                    </div>

                  <Tabs defaultValue="tr" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="tr">{t('product_form.lang_tab_tr')}</TabsTrigger>
                      <TabsTrigger value="en">{t('product_form.lang_tab_en')}</TabsTrigger>
                      <TabsTrigger value="fr">{t('product_form.lang_tab_fr')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tr" className="pt-4">
                        <div className="space-y-2">
                            <Label htmlFor={`categoryImages.${index}.name.tr`}>{t('admin_homepage.category_name_label')}</Label>
                            <Input id={`categoryImages.${index}.name.tr`} {...register(`categoryImages.${index}.name.tr`)} />
                            {errors.categoryImages?.[index]?.name?.tr && <p className="text-sm text-destructive">{errors.categoryImages[index]?.name?.tr?.message}</p>}
                        </div>
                    </TabsContent>
                    <TabsContent value="en" className="pt-4">
                       <div className="space-y-2">
                            <Label htmlFor={`categoryImages.${index}.name.en`}>{t('admin_homepage.category_name_label')}</Label>
                            <Input id={`categoryImages.${index}.name.en`} {...register(`categoryImages.${index}.name.en`)} />
                             {errors.categoryImages?.[index]?.name?.en && <p className="text-sm text-destructive">{errors.categoryImages[index]?.name?.en?.message}</p>}
                        </div>
                    </TabsContent>
                    <TabsContent value="fr" className="pt-4">
                        <div className="space-y-2">
                            <Label htmlFor={`categoryImages.${index}.name.fr`}>{t('admin_homepage.category_name_label')}</Label>
                            <Input id={`categoryImages.${index}.name.fr`} {...register(`categoryImages.${index}.name.fr`)} />
                            {errors.categoryImages?.[index]?.name?.fr && <p className="text-sm text-destructive">{errors.categoryImages[index]?.name?.fr?.message}</p>}
                        </div>
                    </TabsContent>
                  </Tabs>

                  <Button type="button" variant="destructive" size="sm" className="absolute top-4 right-4" onClick={() => removeCategoryImage(index)}>
                      <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addNewCategory}>
                <PlusCircle className="mr-2 h-4 w-4" /> {t('admin_homepage.add_new_category_button')}
              </Button>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-4">
            <Button type="submit" size="lg" disabled={isSaving || !isDirty}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('common.saving')}...</> : <><Save className="mr-2 h-4 w-4" /> {t('common.save_changes')}</>}
            </Button>
          </div>
        </div>
      </form>
  );
}

export default function HomePageAdminPage() {
  const { t } = useTranslation();
  const firestore = useFirestore();

  const homepageConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config/homepage');
  }, [firestore]);

  const { data: homepageConfig, isLoading } = useDoc<HomepageFormData>(homepageConfigRef);

  if (isLoading) {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold">{t('admin_homepage.title')}</h1>
             <div className="grid gap-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-24" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-24" />
                           <Skeleton className="h-24 w-full" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-48 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
  }

  // Merge server data with defaults to ensure all fields are present
  const initialData = {
    ...defaultValues,
    ...(homepageConfig || {}),
    title: { ...defaultValues.title, ...homepageConfig?.title },
    subtitle: { ...defaultValues.subtitle, ...homepageConfig?.subtitle },
    heroImages: (homepageConfig?.heroImages?.length ?? 0) > 0 ? homepageConfig!.heroImages : defaultValues.heroImages,
    categoryImages: (homepageConfig?.categoryImages?.length ?? 0) > 0 ? homepageConfig!.categoryImages : defaultValues.categoryImages,
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">{t('admin_homepage.title')}</h1>
      <HomepageForm key={JSON.stringify(initialData)} initialData={initialData} />
    </div>
  );
}
