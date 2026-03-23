'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation, type Language } from '@/lib/i18n';

type IconProps = {
  className?: string;
};

type LocalizedCopy = Record<Language, string>;

const IconFrame = ({ children }: { children: ReactNode }) => (
  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/20 via-transparent to-accent/5 shadow-[0_0_30px_rgba(255,215,130,0.16)]">
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

const getLocalizedValue = (copy: LocalizedCopy, language: Language) => copy[language] || copy.tr;

export default function AboutUsPage() {
  const { t, language } = useTranslation();

  const heroCopy =
    language === 'tr'
      ? {
          kicker: 'Marka hikayesi',
          title: 'Klasik ihtişamı daha rafine ve güven veren bir dile dönüştürüyoruz.',
          lead:
            'BRC Infinity, klasik mobilyayı sadece gösteri olarak değil; kalıcılık, denge ve mekan karakteri olarak ele alır.',
          body:
            'Her koleksiyonda oran, malzeme ve detay uyumunu aynı ciddiyetle ele alıyor; yaşam alanlarına zamansız, güçlü ve huzurlu bir atmosfer kazandırıyoruz.',
          sideTitle: 'Ne üzerine inşa ediyoruz?',
          sideDescription:
            'Seçili koleksiyon, sağlam işçilik ve showroom deneyimini tek çizgide birleştiren daha kontrollü bir marka dili.',
        }
      : language === 'fr'
        ? {
            kicker: 'Histoire de la marque',
            title: 'Nous reinterpretions la grandeur classique avec une presence plus raffinee et plus sure.',
            lead:
              'BRC Infinity traite le mobilier classique non comme une simple demonstration, mais comme un langage durable pour l espace.',
            body:
              'Dans chaque collection, nous travaillons l equilibre des proportions, des materiaux et des details afin d apporter une atmosphere intemporelle et sereine.',
            sideTitle: 'Notre base',
            sideDescription:
              'Une ligne de marque plus maitrisee qui reunit collections choisies, execution solide et experience showroom.',
          }
        : {
            kicker: 'Brand story',
            title: 'We reshape classical grandeur into a more refined and reassuring presence.',
            lead:
              'BRC Infinity approaches classical furniture not as spectacle, but as a lasting language for the interior.',
            body:
              'Across every collection, we balance proportion, material, and detail with the same discipline to create a timeless and composed atmosphere.',
            sideTitle: 'What we build on',
            sideDescription:
              'A more controlled brand language built on selected collections, solid craftsmanship, and a confident showroom experience.',
          };

  const stats = [
    {
      value: 'Masko',
      label:
        language === 'tr'
          ? 'Showroom merkezi'
          : language === 'fr'
            ? 'Showroom principal'
            : 'Main showroom',
    },
    {
      value: 'Classic',
      label:
        language === 'tr'
          ? 'İmza koleksiyon hissi'
          : language === 'fr'
            ? 'Signature classique'
            : 'Signature classic mood',
    },
    {
      value: 'Premium',
      label:
        language === 'tr'
          ? 'Malzeme ve detay seçimi'
          : language === 'fr'
            ? 'Selection des details'
            : 'Material and detail curation',
    },
  ];

  const pillars = [
    {
      title:
        language === 'tr'
          ? 'Klasik zarafet'
          : language === 'fr'
            ? 'Elegance classique'
            : 'Classical elegance',
      description:
        language === 'tr'
          ? 'Oyma, varak ve oran duygusunu daha sakin bir lüks anlayışıyla dengeliyoruz.'
          : language === 'fr'
            ? 'Nous equilibrons sculpture, dorure et proportions avec une idee du luxe plus calme.'
            : 'We balance carving, gilding, and proportion with a calmer idea of luxury.',
      Icon: LuxuryIcon,
    },
    {
      title:
        language === 'tr'
          ? 'Güven veren dayanıklılık'
          : language === 'fr'
            ? 'Durabilite rassurante'
            : 'Assured durability',
      description:
        language === 'tr'
          ? 'Uzun ömürlü kullanım için malzeme seçimini ve işçilik disiplinini birlikte ele alıyoruz.'
          : language === 'fr'
            ? 'Nous associons choix des materiaux et discipline d execution pour une utilisation durable.'
            : 'We pair material selection with disciplined execution for long-term use.',
      Icon: SafetyIcon,
    },
    {
      title:
        language === 'tr'
          ? 'Sorumlu ustalık'
          : language === 'fr'
            ? 'Savoir-faire responsable'
            : 'Responsible craftsmanship',
      description:
        language === 'tr'
          ? 'Mekanın değerini koruyan, gereksiz gösteriden uzak ama etkili bir ustalık anlayışı.'
          : language === 'fr'
            ? 'Une maitrise efficace, eloignee de l exces, qui respecte la valeur de l espace.'
            : 'An effective craft language that respects the space without unnecessary excess.',
      Icon: SustainabilityIcon,
    },
  ];

  const missionItems = [
    {
      title: getLocalizedValue({ tr: 'Amaçlı lüks', en: 'Purposeful luxury', fr: 'Luxe intentionnel' }, language),
      description: getLocalizedValue(
        {
          tr: 'Klasik çizgiyi modern konforla buluşturan, kullanıldıkça değer kazanan mekanlar kurmak.',
          en: 'To shape interiors where classical lines meet modern comfort and gain value over time.',
          fr: 'Creer des interieurs ou les lignes classiques rencontrent le confort moderne et gagnent en valeur.',
        },
        language
      ),
      Icon: LuxuryIcon,
    },
    {
      title: getLocalizedValue({ tr: 'Güvenli kalite', en: 'Reliable quality', fr: 'Qualite fiable' }, language),
      description: getLocalizedValue(
        {
          tr: 'Sağlam malzeme, kontrollü işçilik ve dengeli tasarımla uzun ömürlü kullanım sunmak.',
          en: 'To deliver longevity through solid materials, controlled execution, and balanced design.',
          fr: 'Offrir une longue duree de vie grace a des materiaux solides, une execution maitrisee et un design equilibre.',
        },
        language
      ),
      Icon: SafetyIcon,
    },
    {
      title: getLocalizedValue({ tr: 'Mekan uyumu', en: 'Spatial harmony', fr: 'Harmonie de l espace' }, language),
      description: getLocalizedValue(
        {
          tr: 'Ürünü tek başına değil, mekanın genel dili içinde değerlendiren bir seçim anlayışı kurmak.',
          en: 'To curate products not in isolation, but as part of a complete interior language.',
          fr: 'Choisir les pieces non isolees, mais comme partie d un langage interieur complet.',
        },
        language
      ),
      Icon: TimelessIcon,
    },
  ];

  const visionItems = [
    {
      title: getLocalizedValue({ tr: 'Zamansız imza', en: 'Timeless signature', fr: 'Signature intemporelle' }, language),
      description: getLocalizedValue(
        {
          tr: 'Klasik mobilyada daha rafine, daha seçici ve uzun ömürlü bir marka izi bırakmak.',
          en: 'To leave a more refined, selective, and lasting signature in classical furniture.',
          fr: 'Laisser une signature plus raffinee, selective et durable dans le mobilier classique.',
        },
        language
      ),
      Icon: TimelessIcon,
    },
    {
      title: getLocalizedValue({ tr: 'Ustalık mirası', en: 'Craft legacy', fr: 'Heritage du savoir-faire' }, language),
      description: getLocalizedValue(
        {
          tr: 'Nesiller boyunca güvenle anılacak bir kalite standardı inşa etmek.',
          en: 'To build a quality standard that can be trusted across generations.',
          fr: 'Construire un niveau de qualite reconnu et fiable au fil des generations.',
        },
        language
      ),
      Icon: LegacyIcon,
    },
    {
      title: getLocalizedValue({ tr: 'Seçili büyüme', en: 'Selective growth', fr: 'Croissance choisie' }, language),
      description: getLocalizedValue(
        {
          tr: 'Her yeni adımda marka tonunu ve koleksiyon kalitesini koruyan kontrollü bir genişleme.',
          en: 'Measured expansion that protects the tone of the brand and the quality of each collection.',
          fr: 'Une expansion maitrisee qui preserve le ton de la marque et la qualite de chaque collection.',
        },
        language
      ),
      Icon: SustainabilityIcon,
    },
  ];

  const categories = [t('categories.living_room'), t('categories.dining_room'), t('categories.bedroom')];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <section className="theme-surface relative overflow-hidden px-4 pb-8 pt-3 md:pb-12 md:pt-4">
          <div className="photo-veil opacity-30" />
          <div className="ambient-orb animate-float-slow left-[-5rem] top-10 h-56 w-56 sm:h-72 sm:w-72" />
          <div className="ambient-orb animate-float-slower bottom-8 right-[-5rem] h-64 w-64 sm:h-80 sm:w-80" />
          <div className="container relative mx-auto px-0">
            <div className="theme-panel overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
              <div className="grid items-start gap-10 lg:grid-cols-[1.12fr_0.88fr]">
                <div className="max-w-2xl">
                  <p className="section-kicker animate-reveal">{heroCopy.kicker}</p>
                  <h1 className="animate-reveal animate-reveal-delay-1 mt-5 font-headline text-5xl font-semibold leading-[0.98] text-primary md:text-7xl">
                    {heroCopy.title}
                  </h1>
                  <p className="animate-reveal animate-reveal-delay-2 mt-5 text-lg leading-8 text-primary/74 md:text-xl">
                    {heroCopy.lead}
                  </p>
                  <p className="animate-reveal animate-reveal-delay-3 mt-6 max-w-2xl text-base leading-8 text-primary/56">
                    {heroCopy.body}
                  </p>

                  <div className="animate-reveal animate-reveal-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button asChild size="lg" className="h-11 rounded-full px-6">
                      <Link href="/products">{t('hero.explore_collections')}</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="h-11 rounded-full px-6">
                      <Link href="/contact">{t('home.custom_request_button')}</Link>
                    </Button>
                  </div>

                  <div className="mt-10 grid gap-3 sm:grid-cols-3">
                    {stats.map((stat, index) => (
                      <div
                        key={stat.label}
                        className="animate-reveal rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-4"
                        style={{ animationDelay: `${0.36 + index * 0.08}s` }}
                      >
                        <p className="font-headline text-2xl font-semibold text-primary">{stat.value}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-primary/46">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <Card className="animate-reveal animate-reveal-delay-2 theme-panel-lift rounded-[1.6rem]">
                    <CardContent className="p-6 sm:p-7">
                      <p className="text-[0.72rem] uppercase tracking-[0.18em] text-accent/84">{heroCopy.sideTitle}</p>
                      <h2 className="mt-4 font-headline text-3xl font-semibold text-primary">{t('home.why_us_title')}</h2>
                      <p className="mt-4 text-sm leading-7 text-primary/58">{heroCopy.sideDescription}</p>
                    </CardContent>
                  </Card>

                  {pillars.map(({ title, description, Icon }, index) => (
                    <Card
                      key={title}
                      className="theme-panel-lift animate-reveal rounded-[1.4rem]"
                      style={{ animationDelay: `${0.24 + index * 0.1}s` }}
                    >
                      <CardContent className="flex gap-4 p-6">
                        <IconFrame>
                          <Icon className="h-7 w-7 text-accent" />
                        </IconFrame>
                        <div>
                          <h3 className="font-headline text-2xl font-semibold text-primary">{title}</h3>
                          <p className="mt-2 text-sm leading-7 text-primary/58">{description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="theme-surface-soft relative overflow-hidden px-4 py-20 md:py-24">
          <div className="photo-veil opacity-15" />
          <div className="container relative mx-auto px-0">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="section-kicker animate-reveal justify-center">{t('footer.tagline')}</p>
              <h2 className="section-title animate-reveal animate-reveal-delay-1 mt-5">
                {language === 'tr' ? 'Misyon ve vizyon' : language === 'fr' ? 'Mission et vision' : 'Mission and vision'}
              </h2>
              <p className="section-copy animate-reveal animate-reveal-delay-2 mt-5">
                {language === 'tr'
                  ? 'Tasarım dilimizi sadece ürün bazında değil, markanın uzun vadeli tutarlılığı için de kuruyoruz.'
                  : language === 'fr'
                    ? 'Nous construisons notre langage design non seulement pour le produit, mais aussi pour la coherence durable de la marque.'
                    : 'We shape our design language not only for individual products, but for the long-term consistency of the brand.'}
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="theme-panel-lift animate-reveal rounded-[1.6rem]" style={{ animationDelay: '0.12s' }}>
                <CardContent className="p-8 sm:p-9">
                  <p className="text-[0.72rem] uppercase tracking-[0.18em] text-accent/84">
                    {language === 'tr' ? 'Misyonumuz' : language === 'fr' ? 'Notre mission' : 'Our mission'}
                  </p>
                  <div className="mt-6 space-y-6">
                    {missionItems.map(({ title, description, Icon }) => (
                      <div key={title} className="flex gap-4">
                        <IconFrame>
                          <Icon className="h-7 w-7 text-accent" />
                        </IconFrame>
                        <div>
                          <h3 className="font-headline text-2xl font-semibold text-primary">{title}</h3>
                          <p className="mt-2 text-sm leading-7 text-primary/58">{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="theme-panel-lift animate-reveal rounded-[1.6rem]" style={{ animationDelay: '0.22s' }}>
                <CardContent className="p-8 sm:p-9">
                  <p className="text-[0.72rem] uppercase tracking-[0.18em] text-accent/84">
                    {language === 'tr' ? 'Vizyonumuz' : language === 'fr' ? 'Notre vision' : 'Our vision'}
                  </p>
                  <div className="mt-6 space-y-6">
                    {visionItems.map(({ title, description, Icon }) => (
                      <div key={title} className="flex gap-4">
                        <IconFrame>
                          <Icon className="h-7 w-7 text-accent" />
                        </IconFrame>
                        <div>
                          <h3 className="font-headline text-2xl font-semibold text-primary">{title}</h3>
                          <p className="mt-2 text-sm leading-7 text-primary/58">{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 pb-20 md:pb-24">
          <div className="container mx-auto px-0">
            <div className="theme-panel relative overflow-hidden rounded-[2rem] p-8 sm:p-10 lg:p-12">
              <div className="photo-veil opacity-30" />
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="max-w-3xl">
                  <p className="section-kicker animate-reveal">
                    {language === 'tr' ? 'Birlikte kuralım' : language === 'fr' ? 'Construisons ensemble' : 'Let us shape it together'}
                  </p>
                  <h2 className="animate-reveal animate-reveal-delay-1 mt-5 font-headline text-4xl font-semibold text-primary md:text-5xl">
                    {language === 'tr'
                      ? 'Mekana uygun klasik bir koleksiyon dili birlikte netleştirelim.'
                      : language === 'fr'
                        ? 'Definissons ensemble une ligne classique adaptee a votre interieur.'
                        : 'Let us define a classical collection language that fits your interior.'}
                  </h2>
                  <p className="animate-reveal animate-reveal-delay-2 mt-5 max-w-2xl text-base leading-8 text-primary/58">
                    {language === 'tr'
                      ? 'Yemek odası, yatak odası ve salon seçimlerini mekanınızın ölçüsü ve atmosferiyle uyumlu olacak şekilde yönlendiriyoruz.'
                      : language === 'fr'
                        ? 'Nous guidons les selections de salon, salle a manger et chambre selon les dimensions et l atmosphere de votre espace.'
                        : 'We guide living, dining, and bedroom selections according to the proportions and atmosphere of your space.'}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {categories.map((category, index) => (
                      <span
                        key={category}
                        className="animate-reveal rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.72rem] uppercase tracking-[0.16em] text-primary/58"
                        style={{ animationDelay: `${0.28 + index * 0.08}s` }}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="animate-reveal animate-reveal-delay-3 flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Button asChild size="lg" className="h-11 rounded-full px-6">
                    <Link href="/products">{t('home.view_all_products')}</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-11 rounded-full px-6">
                    <Link href="/contact">{t('home.custom_request_button')}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
