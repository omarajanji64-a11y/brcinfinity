'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, Save, Trash2 } from 'lucide-react';

import { useHeroCarouselConfig } from '@/hooks/use-hero-carousel-config';
import { useToast } from '@/hooks/use-toast';
import {
  DEFAULT_HERO_CAROUSEL_CONFIG,
  DEFAULT_HERO_SLIDE_DURATION_SECONDS,
  isValidHeroCarouselImageUrl,
  sanitizeHeroCarouselConfig,
  type HeroCarouselConfig,
  type HeroCarouselSlide,
} from '@/lib/hero-carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const createSlideId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `hero-slide-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const createEmptySlide = (): HeroCarouselSlide => ({
  id: createSlideId(),
  imageUrl: '',
  durationSeconds: DEFAULT_HERO_SLIDE_DURATION_SECONDS,
});

const buildFormState = (config?: HeroCarouselConfig | null): HeroCarouselConfig => {
  const normalizedConfig = sanitizeHeroCarouselConfig(config ?? DEFAULT_HERO_CAROUSEL_CONFIG);

  return {
    ...normalizedConfig,
    slides: normalizedConfig.slides.map((slide) => ({ ...slide })),
  };
};

export default function AdminHeroCarouselManager() {
  const { toast } = useToast();
  const { config, isLoading, saveConfig } = useHeroCarouselConfig();

  const [form, setForm] = useState<HeroCarouselConfig>(() => buildFormState(config));
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setForm(buildFormState(config));
  }, [config]);

  const updateSlide = <K extends keyof HeroCarouselSlide>(
    index: number,
    key: K,
    value: HeroCarouselSlide[K]
  ) => {
    setForm((current) => {
      const nextSlides = [...current.slides];
      nextSlides[index] = {
        ...nextSlides[index],
        [key]: value,
      };

      return {
        ...current,
        slides: nextSlides,
      };
    });
  };

  const addSlide = () => {
    setForm((current) => ({
      ...current,
      slides: [...current.slides, createEmptySlide()],
    }));
  };

  const removeSlide = (index: number) => {
    setForm((current) => ({
      ...current,
      slides: current.slides.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const moveSlide = (index: number, direction: -1 | 1) => {
    setForm((current) => {
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= current.slides.length) {
        return current;
      }

      const nextSlides = [...current.slides];
      const [selectedSlide] = nextSlides.splice(index, 1);
      nextSlides.splice(targetIndex, 0, selectedSlide);

      return {
        ...current,
        slides: nextSlides,
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
        throw new Error(payload.error || 'Slayt gorselleri yuklenemedi.');
      }

      const uploadedUrls = Array.isArray(payload.imageUrls)
        ? payload.imageUrls.filter((url: unknown): url is string => typeof url === 'string')
        : [];

      if (uploadedUrls.length === 0) {
        throw new Error('Sunucudan gecerli gorsel adresi donmedi.');
      }

      setForm((current) => ({
        ...current,
        slides: [
          ...current.slides,
          ...uploadedUrls.map((imageUrl) => ({
            id: createSlideId(),
            imageUrl,
            durationSeconds: DEFAULT_HERO_SLIDE_DURATION_SECONDS,
          })),
        ],
      }));

      toast({
        title: 'Slayt gorselleri yuklendi',
        description: `${uploadedUrls.length} gorsel slider listesine eklendi.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Yukleme basarisiz',
        description: error instanceof Error ? error.message : 'Slayt gorselleri yuklenemedi.',
      });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const invalidSlide = form.slides.find(
      (slide) => slide.imageUrl.trim() && !isValidHeroCarouselImageUrl(slide.imageUrl)
    );

    if (invalidSlide) {
      toast({
        variant: 'destructive',
        title: 'Gecersiz gorsel adresi',
        description: 'Tum slayt gorselleri yerel yol veya gecerli https adresi olmali.',
      });
      return;
    }

    const nextConfig = sanitizeHeroCarouselConfig({
      autoplay: form.autoplay,
      randomOrder: form.randomOrder,
      slides: form.slides
        .map((slide) => ({
          ...slide,
          imageUrl: slide.imageUrl.trim(),
        }))
        .filter((slide) => slide.imageUrl),
      updatedAt: form.updatedAt,
    });

    setIsSaving(true);

    try {
      await saveConfig(nextConfig);

      toast({
        title: 'Slider kaydedildi',
        description: 'Ana sayfa slayt ayarlari guncellendi.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Kaydetme basarisiz',
        description: error instanceof Error ? error.message : 'Slider ayarlari kaydedilemedi.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-white/10 bg-background/95 shadow-2xl shadow-black/30">
      <CardHeader>
        <CardTitle>Ana sayfa slider yonetimi</CardTitle>
        <CardDescription>
          Slaytlari admin panelden yukle, sirala, sil ve her gorselin ekranda kalma suresini ayarla.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <Label htmlFor="hero-autoplay">Otomatik gecis</Label>
                <p className="text-sm text-muted-foreground">
                  Acik oldugunda slaytlar belirlediginiz surelere gore otomatik ilerler.
                </p>
              </div>
              <Switch
                id="hero-autoplay"
                checked={form.autoplay}
                onCheckedChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    autoplay: checked,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <Label htmlFor="hero-random-order">Rastgele sira</Label>
                <p className="text-sm text-muted-foreground">
                  Acik oldugunda bir sonraki slayt sirayla degil rastgele secilir.
                </p>
              </div>
              <Switch
                id="hero-random-order"
                checked={form.randomOrder}
                onCheckedChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    randomOrder: checked,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-1">
              <Label>Slayt gorselleri</Label>
              <p className="text-sm text-muted-foreground">
                Coklu gorsel yukleyebilir veya URL ile manuel slayt ekleyebilirsin.
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
              <Button type="button" variant="outline" onClick={addSlide}>
                <Plus className="mr-2 h-4 w-4" />
                Bos slayt ekle
              </Button>
              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Gorseller yukleniyor...</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {form.slides.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                  Henuz slayt eklenmedi. Yukleme yapabilir veya bos slayt ekleyip URL girebilirsin.
                </div>
              ) : (
                form.slides.map((slide, index) => {
                  const trimmedUrl = slide.imageUrl.trim();
                  const canPreview = isValidHeroCarouselImageUrl(trimmedUrl);

                  return (
                    <div key={slide.id} className="rounded-lg border p-4">
                      <div className="grid gap-4 lg:grid-cols-[240px,1fr]">
                        <div className="overflow-hidden rounded-md border bg-muted">
                          {canPreview ? (
                            <img
                              src={trimmedUrl}
                              alt={`Slayt ${index + 1}`}
                              className="aspect-[16/9] h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex aspect-[16/9] items-center justify-center text-sm text-muted-foreground">
                              <ImagePlus className="mr-2 h-4 w-4" />
                              Onizleme icin gorsel ekle
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="space-y-1">
                              <p className="font-medium">Slayt {index + 1}</p>
                              <p className="text-sm text-muted-foreground">
                                Siralamayi degistirebilir veya bu gorseli listeden kaldirabilirsin.
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => moveSlide(index, -1)}
                                disabled={index === 0}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => moveSlide(index, 1)}
                                disabled={index === form.slides.length - 1}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeSlide(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`hero-slide-url-${slide.id}`}>Gorsel URL</Label>
                            <Input
                              id={`hero-slide-url-${slide.id}`}
                              value={slide.imageUrl}
                              onChange={(event) => updateSlide(index, 'imageUrl', event.target.value)}
                              placeholder="https://... veya /gorsel.jpg"
                            />
                          </div>

                          <div className="max-w-[220px] space-y-2">
                            <Label htmlFor={`hero-slide-duration-${slide.id}`}>Bekleme suresi (saniye)</Label>
                            <Input
                              id={`hero-slide-duration-${slide.id}`}
                              type="number"
                              min="1"
                              step="1"
                              value={slide.durationSeconds}
                              onChange={(event) =>
                                updateSlide(
                                  index,
                                  'durationSeconds',
                                  Math.max(1, Number.parseInt(event.target.value || '1', 10) || 1)
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Mevcut ayarlar yukleniyor...' : 'Degisiklikleri kaydetmeden siteye yansimaz.'}
            </p>

            <Button type="submit" disabled={isSaving || isUploading}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? 'Kaydediliyor' : 'Slider ayarlarini kaydet'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
