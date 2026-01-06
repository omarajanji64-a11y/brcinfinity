'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Palette, CheckCircle } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { setDocumentNonBlocking } from '@/firebase';

const colorSchema = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  l: z.number().min(0).max(100),
});

const themeFormSchema = z.object({
  background: colorSchema,
  primary: colorSchema,
  accent: colorSchema,
});

type ThemeFormData = z.infer<typeof themeFormSchema>;

type PredefinedTheme = {
  nameKey: string;
  config: ThemeFormData;
};

const predefinedThemes: PredefinedTheme[] = [
  {
    nameKey: "admin_theme.themes.luxury_gold",
    config: {
      background: { h: 10, s: 10, l: 8 },
      primary: { h: 0, s: 0, l: 98 },
      accent: { h: 38, s: 82, l: 62 },
    },
  },
  {
    nameKey: "admin_theme.themes.royal_sapphire",
    config: {
      background: { h: 222, s: 47, l: 11 },
      primary: { h: 210, s: 40, l: 96 },
      accent: { h: 217, s: 91, l: 60 },
    },
  },
  {
    nameKey: "admin_theme.themes.classic_emerald",
    config: {
      background: { h: 140, s: 20, l: 15 },
      primary: { h: 150, s: 80, l: 95 },
      accent: { h: 150, s: 50, l: 45 },
    },
  },
    {
    nameKey: "admin_theme.themes.modern_rose",
    config: {
      background: { h: 350, s: 25, l: 12 },
      primary: { h: 350, s: 100, l: 97 },
      accent: { h: 340, s: 80, l: 70 },
    },
  },
];


export default function ThemeAdminPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const firestore = useFirestore();

  const themeConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config/theme');
  }, [firestore]);

  const { data: savedThemeConfig, isLoading } = useDoc<ThemeFormData>(themeConfigRef);

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<ThemeFormData>({
    resolver: zodResolver(themeFormSchema),
    defaultValues: predefinedThemes[0].config,
  });

  const activeTheme = watch();

  useEffect(() => {
    if (savedThemeConfig) {
      reset(savedThemeConfig);
    }
  }, [savedThemeConfig, reset]);

  const onSubmit: SubmitHandler<ThemeFormData> = async (data) => {
    if (!themeConfigRef) {
      toast({
        variant: 'destructive',
        title: t('admin_theme.toast_error_title'),
        description: t('admin_theme.toast_error_desc'),
      });
      return;
    }
    setIsSaving(true);
    
    setDocumentNonBlocking(themeConfigRef, data, { merge: true });

    toast({
      title: t('admin_theme.toast_success_title'),
      description: t('admin_theme.toast_success_desc'),
    });
    
    setIsSaving(false);
  };
  
  if (isLoading) {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold">{t('admin_theme.title')}</h1>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                           <Skeleton key={i} className="h-24 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }
  
  const isThemeActive = (themeConfig: ThemeFormData) => {
      if(!activeTheme?.background) return false;
      return (
          themeConfig.background.h === activeTheme.background.h &&
          themeConfig.background.s === activeTheme.background.s &&
          themeConfig.background.l === activeTheme.background.l &&
          themeConfig.primary.h === activeTheme.primary.h &&
          themeConfig.primary.s === activeTheme.primary.s &&
          themeConfig.primary.l === activeTheme.primary.l &&
          themeConfig.accent.h === activeTheme.accent.h &&
          themeConfig.accent.s === activeTheme.accent.s &&
          themeConfig.accent.l === activeTheme.accent.l
      );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">{t('admin_theme.title')}</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{t('admin_theme.card_title')}</CardTitle>
            <CardDescription>{t('admin_theme.card_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {predefinedThemes.map((theme) => {
                    const isActive = isThemeActive(theme.config);
                    return (
                         <div 
                            key={theme.nameKey} 
                            className={cn(
                                "relative p-4 rounded-lg border-2 cursor-pointer transition-all",
                                isActive ? "border-primary" : "border-muted-foreground/50 hover:border-muted-foreground"
                            )}
                            onClick={() => reset(theme.config)}
                         >
                            {isActive && (
                                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                    <CheckCircle className="h-4 w-4" />
                                </div>
                            )}
                            <h3 className="font-semibold mb-3">{t(theme.nameKey)}</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: `hsl(${theme.config.background.h}, ${theme.config.background.s}%, ${theme.config.background.l}%)`}} />
                                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: `hsl(${theme.config.primary.h}, ${theme.config.primary.s}%, ${theme.config.primary.l}%)`}} />
                                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: `hsl(${theme.config.accent.h}, ${theme.config.accent.s}%, ${theme.config.accent.l}%)`}} />
                            </div>
                        </div>
                    )
                })}
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button type="submit" size="lg" disabled={isSaving}>
            {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('common.saving')}...</> : <><Save className="mr-2 h-4 w-4" /> {t('common.save_changes')}</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
