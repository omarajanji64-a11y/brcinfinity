'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Trash2, PlusCircle } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n';

const catalogSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Catalog name is required.'),
  url: z.string().url('Please enter a valid URL.'),
});

const catalogsFormSchema = z.object({
  catalogs: z.array(catalogSchema),
});

type CatalogsFormData = z.infer<typeof catalogsFormSchema>;

export default function CatalogsAdminPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const firestore = useFirestore();

  const catalogConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config/catalog');
  }, [firestore]);

  const { data: catalogConfig, isLoading } = useDoc<CatalogsFormData>(catalogConfigRef);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm<CatalogsFormData>({
    resolver: zodResolver(catalogsFormSchema),
    defaultValues: { catalogs: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'catalogs',
  });

  useEffect(() => {
    if (catalogConfig?.catalogs) {
      reset({ catalogs: catalogConfig.catalogs });
    }
  }, [catalogConfig, reset]);

  const onSubmit: SubmitHandler<CatalogsFormData> = async (data) => {
    if (!catalogConfigRef) {
      toast({
        variant: 'destructive',
        title: t('admin_catalogs.toast_error_title'),
        description: t('admin_catalogs.toast_error_desc'),
      });
      return;
    }
    setIsSaving(true);
    
    try {
      await setDoc(catalogConfigRef, data, { merge: true });
      toast({
        title: t('admin_catalogs.toast_success_title'),
        description: t('admin_catalogs.toast_success_desc'),
      });
      reset(data);
    } catch(e) {
        console.error(e);
        toast({
            variant: "destructive",
            title: t('admin_catalogs.toast_error_title'),
            description: (e as Error).message,
        });
    } finally {
        setIsSaving(false);
    }
  };

  const addNewCatalog = () => {
    append({ id: uuidv4(), name: '', url: '' });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-headline font-bold">{t('admin_catalogs.title')}</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-12 w-48" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">{t('admin_catalogs.title')}</h1>
      <p className="text-muted-foreground">{t('admin_catalogs.desc')}</p>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{t('admin_catalogs.card_title')}</CardTitle>
            <CardDescription>{t('admin_catalogs.card_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`catalogs.${index}.name`}>{t('admin_catalogs.catalog_name_label')}</Label>
                    <Input
                      id={`catalogs.${index}.name`}
                      {...register(`catalogs.${index}.name`)}
                      placeholder={t('admin_catalogs.catalog_name_placeholder')}
                    />
                    {errors.catalogs?.[index]?.name && <p className="text-sm text-destructive">{errors.catalogs[index]?.name?.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`catalogs.${index}.url`}>{t('admin_catalogs.catalog_url_label')}</Label>
                    <Input
                      id={`catalogs.${index}.url`}
                      {...register(`catalogs.${index}.url`)}
                      placeholder={t('admin_catalogs.catalog_url_placeholder')}
                    />
                    {errors.catalogs?.[index]?.url && <p className="text-sm text-destructive">{errors.catalogs[index]?.url?.message}</p>}
                  </div>
                </div>
                <Button type="button" variant="destructive" size="sm" className="absolute top-4 right-4" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addNewCatalog}>
              <PlusCircle className="mr-2 h-4 w-4" /> {t('admin_catalogs.add_button')}
            </Button>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" disabled={isSaving || !isDirty}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('common.saving')}...</> : <><Save className="mr-2 h-4 w-4" /> {t('common.save_changes')}</>}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
