'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';

type IconProps = {
  className?: string;
};

const IconFrame = ({ children }: { children: ReactNode }) => (
  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/20 via-transparent to-accent/5 shadow-[0_0_30px_rgba(255,215,130,0.18)]">
    <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-accent/60" />
    {children}
  </div>
);

const LuxuryIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <path d="M12 24 24 10h16l12 14-20 30-20-30Z" stroke="currentColor" strokeWidth="1.6" />
    <path d="M24 10 32 28 40 10" stroke="currentColor" strokeWidth="1.6" />
    <path d="M20 24h24" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const TimelessIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <path d="M20 12h24M20 52h24" stroke="currentColor" strokeWidth="1.6" />
    <path d="M24 12c0 10 16 10 16 20s-16 10-16 20" stroke="currentColor" strokeWidth="1.6" />
    <path d="M24 12h16M24 52h16" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="32" cy="32" r="3" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const LegacyIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <path d="M16 16h32M18 22h28" stroke="currentColor" strokeWidth="1.6" />
    <path d="M20 22v26M44 22v26" stroke="currentColor" strokeWidth="1.6" />
    <path d="M14 48h36M12 52h40" stroke="currentColor" strokeWidth="1.6" />
    <path d="M26 30h12M26 36h12" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const SafetyIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <path d="M32 8 52 16v16c0 14-9 22-20 24-11-2-20-10-20-24V16L32 8Z" stroke="currentColor" strokeWidth="1.6" />
    <path d="m22 32 6 6 14-14" stroke="currentColor" strokeWidth="1.8" />
    <path d="M22 44h20" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const SustainabilityIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <path d="M32 10c12 6 18 18 18 28 0 10-8 16-18 16s-18-6-18-16c0-10 6-22 18-28Z" stroke="currentColor" strokeWidth="1.6" />
    <path d="M32 20v26" stroke="currentColor" strokeWidth="1.6" />
    <path d="M26 30c4 2 8 2 12 0" stroke="currentColor" strokeWidth="1.6" />
    <path d="M24 40c5 3 11 3 16 0" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export default function AboutUsPage() {
  const { t } = useTranslation();

  const missionItems = [
    {
      title: 'Amaçlı Lüks',
      description:
        'Klasik çizgiyi modern konforla birleştiren, her detayıyla ayrıcalık hissi veren mobilyalar üretmek.',
      Icon: LuxuryIcon,
    },
    {
      title: 'Güvenli ve Dayanıklı',
      description:
        'Sağlam malzeme ve titiz işçilikle güvenli, uzun ömürlü ve aileler için konforlu yaşam alanları oluşturmak.',
      Icon: SafetyIcon,
    },
    {
      title: 'Sürdürülebilir Zarafet',
      description:
        'Sorumlu tedarik ve çevre duyarlılığı ile lüksün doğayla uyumlu olabileceğini göstermek.',
      Icon: SustainabilityIcon,
    },
  ];

  const visionItems = [
    {
      title: 'Zamansız İmza',
      description:
        'Klasik estetikte modern bir yorumla, dünyada zamansız ve güçlü bir marka izi bırakmak.',
      Icon: TimelessIcon,
    },
    {
      title: 'Ustalık Mirası',
      description:
        'Nesiller boyu değerini koruyan, güvenle tercih edilen bir ustalık mirası inşa etmek.',
      Icon: LegacyIcon,
    },
    {
      title: 'Sorumlu Lüks',
      description:
        'Sürdürülebilir üretimi lüksle buluşturarak sektör için kalıcı ve ilham veren bir standart oluşturmak.',
      Icon: LuxuryIcon,
    },
  ];

  const whyUs = [
    {
      title: t('home.why_us_1_title'),
      description: t('home.why_us_1_desc'),
    },
    {
      title: t('home.why_us_2_title'),
      description: t('home.why_us_2_desc'),
    },
    {
      title: t('home.why_us_3_title'),
      description: t('home.why_us_3_desc'),
    },
  ];

  const categories = [
    t('categories.living_room'),
    t('categories.dining_room'),
    t('categories.bedroom'),
  ];

  const styles = [
    t('product_page.style_all'),
    t('product_page.style_modern'),
    t('product_page.style_classic'),
  ];

  const contactFields = [
    t('contact_page.form.name'),
    t('contact_page.form.email'),
    t('contact_page.form.subject'),
    t('contact_page.form.message'),
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="relative overflow-hidden bg-gradient-to-b from-secondary/60 to-background">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-12 left-10 h-72 w-72 rounded-full bg-accent blur-3xl" />
            <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-accent blur-[140px]" />
          </div>
          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.3em] text-accent/80">{t('footer.tagline')}</p>
                <h1 className="font-headline text-5xl md:text-6xl font-bold text-foreground">Hakkımızda</h1>
                <p className="text-2xl md:text-3xl font-semibold text-accent">{t('hero.title')}</p>
                <p className="text-lg text-muted-foreground">{t('hero.subtitle')}</p>
                <p className="text-base text-muted-foreground">
                  BRC Infinity, lüksü zamansız tasarımla buluşturan; klasik, güvenli ve sürdürülebilir mobilyalar
                  üretmeyi amaçlayan bir marka. Her parça, yaşam alanlarını yücelten bir zarafet ve kalıcı bir kalite
                  için tasarlanır.
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t('footer.quick_links')}</p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="transition-transform duration-300 hover:scale-105">
                    <Link href="/products">{t('hero.explore_collections')}</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10">
                    <Link href="/contact">{t('home.custom_request_button')}</Link>
                  </Button>
                  <Button asChild size="lg" variant="ghost" className="text-accent hover:bg-accent/10">
                    <Link href="/products">{t('header.download_catalog')}</Link>
                  </Button>
                </div>
              </div>
              <Card className="border border-accent/20 bg-background/70 shadow-xl">
                <CardContent className="p-8 space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">BRC Infinity</p>
                    <h2 className="text-2xl font-headline font-semibold">{t('home.why_us_title')}</h2>
                  </div>
                  <div className="space-y-4">
                    {whyUs.map(({ title, description }) => (
                      <div key={title} className="flex gap-4">
                        <div>
                          <h3 className="font-semibold text-foreground">{title}</h3>
                          <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t('product_page.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('product_page.subtitle')}</p>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  {t('home.featured_products')}
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {t('footer.categories')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <span key={category} className="rounded-full border border-accent/30 px-4 py-1 text-sm text-foreground">
                      {category}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {styles.map((style) => (
                    <span key={style} className="rounded-full bg-secondary px-4 py-1 text-sm text-muted-foreground">
                      {style}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href="/products">{t('home.view_all_products')}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10">
                  <Link href="/products">{t('product_page.all_products')}</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-6">
              <Card className="border border-accent/20 bg-background/70 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">{t('footer.tagline')}</p>
                  <h3 className="text-2xl font-headline font-semibold">{t('hero.title')}</h3>
                  <p className="text-muted-foreground">{t('hero.subtitle')}</p>
                </CardContent>
              </Card>
              <Card className="border border-accent/20 bg-secondary/60 shadow-lg">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">{t('home.custom_request_title')}</h3>
                  <p className="text-muted-foreground">{t('home.custom_request_desc')}</p>
                  <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10">
                    <Link href="/contact">{t('home.custom_request_button')}</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Misyonumuz ve Vizyonumuz</h2>
            <p className="text-lg text-muted-foreground">{t('footer.tagline')}</p>
          </div>
          <div className="grid gap-10 lg:grid-cols-2">
            <Card className="border border-accent/20 bg-background/70 shadow-xl">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-headline font-semibold">Misyonumuz</h3>
                <div className="space-y-5">
                  {missionItems.map(({ title, description, Icon }) => (
                    <div key={title} className="flex gap-4">
                      <IconFrame>
                        <Icon className="h-7 w-7 text-accent" />
                      </IconFrame>
                      <div>
                        <h4 className="font-semibold text-foreground">{title}</h4>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border border-accent/20 bg-background/70 shadow-xl">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-headline font-semibold">Vizyonumuz</h3>
                <div className="space-y-5">
                  {visionItems.map(({ title, description, Icon }) => (
                    <div key={title} className="flex gap-4">
                      <IconFrame>
                        <Icon className="h-7 w-7 text-accent" />
                      </IconFrame>
                      <div>
                        <h4 className="font-semibold text-foreground">{title}</h4>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t('contact_page.title')}</h2>
            <p className="text-lg text-muted-foreground">{t('contact_page.subtitle')}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t('footer.contact_us')}</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="border border-accent/20 bg-background/70 shadow-xl">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-headline font-semibold">{t('contact_page.showroom_title')}</h3>
                <p className="text-muted-foreground">{t('contact_page.showroom_description')}</p>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <p className="uppercase tracking-[0.2em] text-xs text-muted-foreground">{t('contact_page.showroom.address')}</p>
                    <p>Masko mobilyacılar sitesi 18/B No 35 Istanbul, Turkey</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.2em] text-xs text-muted-foreground">{t('contact_page.showroom.phone')}</p>
                    <p className="font-code">+90 546 789 89 68</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-accent/20 bg-background/70 shadow-xl">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-headline font-semibold">{t('contact_page.form_title')}</h3>
                <p className="text-muted-foreground">{t('home.custom_request_desc')}</p>
                <div className="grid gap-3 text-sm text-muted-foreground">
                  {contactFields.map((field) => (
                    <div key={field} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-accent/70" />
                      <span>{field}</span>
                    </div>
                  ))}
                </div>
                <Button asChild size="lg" className="w-full">
                  <Link href="/contact">{t('contact_page.form.submit_button')}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
