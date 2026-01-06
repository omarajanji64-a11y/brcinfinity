
'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase, useStorage } from '@/firebase/client-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const createBrandingSchema = (t: (key: string) => string) => z.object({
  logoUrl: z.string().url(t('validation.invalid_url')).or(z.literal('')),
});

type BrandingFormData = z.infer<ReturnType<typeof createBrandingSchema>>;

const defaultLogoUrl = "https://i.ibb.co/N2r4xFMc/Screenshot-2026-01-06-09-00-56-removebg-preview.png";

export default function BrandingAdminPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const firestore = useFirestore();
  const storage = useStorage();
  
  const brandingSchema = createBrandingSchema(t);

  const brandingConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config/branding');
  }, [firestore]);

  const { data: brandingConfig, isLoading } = useDoc<BrandingFormData>(brandingConfigRef);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
  });
  
  useEffect(() => {
    if (!isLoading && brandingConfig) {
        reset(brandingConfig);
    } else if (!isLoading) {
        reset({ logoUrl: defaultLogoUrl });
    }
  }, [isLoading, brandingConfig, reset]);

  const logoUrl = watch('logoUrl');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!imageFile || !storage) {
      toast({ variant: 'destructive', title: t('admin_branding.toast_no_file_title') });
      return;
    }
    setIsUploading(true);
    try {
      const storageRef = ref(storage, `branding/logo-${Date.now()}-${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setValue('logoUrl', downloadURL, { shouldDirty: true });
      toast({ title: t('admin_branding.toast_upload_success_title') });
    } catch (error) {
      console.error("Logo upload error:", error);
      toast({ variant: 'destructive', title: t('admin_branding.toast_upload_error_title') });
    } finally {
      setIsUploading(false);
      setImageFile(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };


  const onSubmit: SubmitHandler<BrandingFormData> = async (data) => {
    if (!brandingConfigRef) {
      toast({
        variant: "destructive",
        title: t('admin_branding.toast_error_title'),
        description: t('admin_branding.toast_error_desc'),
      });
      return;
    }
    setIsSaving(true);
    
    try {
      await setDoc(brandingConfigRef, data, { merge: true });
      toast({
        title: t('admin_branding.toast_success_title'),
        description: t('admin_branding.toast_success_desc'),
      });
      reset(data); // Mark form as not dirty after successful save
    } catch(e) {
        console.error(e);
        toast({
            variant: "destructive",
            title: t('admin_branding.toast_error_title'),
            description: (e as Error).message,
        });
    } finally {
        setIsSaving(false);
    }
  };
  
  const isValidUrl = (url: string | undefined | null): url is string => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
          <h1 className="text-3xl font-headline font-bold">{t('admin_branding.title')}</h1>
           <div className="grid gap-8">
              <Card>
                  <CardHeader>
                      <Skeleton className="h-8 w-1/2" />
                      <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                       <div className="space-y-4 rounded-lg border bg-card p-6">
                         <Skeleton className="h-6 w-1/4" />
                         <div className="flex items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/50 p-8 h-48">
                              <Skeleton className="h-32 w-full" />
                         </div>
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                  </CardContent>
                  <CardFooter>
                       <Skeleton className="h-12 w-48" />
                  </CardFooter>
              </Card>
          </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">{t('admin_branding.title')}</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{t('admin_branding.logo_title')}</CardTitle>
            <CardDescription>{t('admin_branding.logo_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 rounded-lg border bg-card p-6">
              <h3 className="font-medium">{t('admin_branding.logo_preview')}</h3>
              <div className="flex items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/50 p-8 h-48">
                {isValidUrl(logoUrl) ? (
                  <img
                    src={logoUrl}
                    alt="Logo Preview"
                    className="object-contain max-h-full max-w-full"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="mx-auto h-12 w-12" />
                    <p className="mt-2">{t('admin_branding.no_logo')}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">{t('admin_homepage.image_url_label')}</Label>
                <Input
                  id="logoUrl"
                  {...register('logoUrl')}
                  placeholder="https://example.com/logo.png"
                />
                {errors.logoUrl && <p className="text-sm text-destructive">{errors.logoUrl.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo-upload">{t('admin_branding.upload_from_device')}</Label>
                <div className="flex gap-2">
                  <Input id="logo-upload" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                  <Button type="button" onClick={handleUpload} disabled={!imageFile || isUploading}>
                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    {t('admin_branding.upload_button')}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" disabled={isSaving || !isDirty}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('common.saving')}...</> : <><Save className="mr-2 h-4 w-4" /> {t('common.save_changes')}</>}
            </Button>
          </CardFooter>
        </Card>
