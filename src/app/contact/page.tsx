'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Clock3, Mail, MapPin, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const { t, language } = useTranslation();
  const { toast } = useToast();

  const formSchema = z.object({
    name: z.string().min(2, {
      message: t('contact_page.validation.name_min'),
    }),
    email: z.string().email({
      message: t('contact_page.validation.email_invalid'),
    }),
    subject: z.string().min(5, {
      message: t('contact_page.validation.subject_min'),
    }),
    message: z.string().min(20, {
      message: t('contact_page.validation.message_min'),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const heroCopy =
    language === 'tr'
      ? {
          kicker: 'Iletisim ve proje destegi',
          intro:
            'Showroom randevusu, urun secimi veya mekan yonlendirmesi icin ekibimizle dogrudan iletisime gecebilirsin.',
          note:
            'Formu doldurabilir ya da dogrudan telefon uzerinden bize ulasarak daha hizli bir gorusme planlayabilirsin.',
          hours: 'Her gun 09:00 - 19:00',
          consultationTitle: 'Gorusmede neleri netlestiriyoruz?',
          consultationItems: ['Mekan olculeri', 'Urun kategorileri', 'Malzeme ve ton secimi'],
        }
      : language === 'fr'
        ? {
            kicker: 'Contact et accompagnement projet',
            intro:
              'Pour une visite showroom, un choix de collection ou une orientation projet, vous pouvez contacter directement notre equipe.',
            note:
              'Vous pouvez remplir le formulaire ou nous appeler pour organiser un echange plus rapide.',
            hours: 'Tous les jours 09:00 - 19:00',
            consultationTitle: 'Ce que nous clarifions ensemble',
            consultationItems: ['Dimensions de l espace', 'Categories de produits', 'Materiaux et tonalites'],
          }
        : {
            kicker: 'Contact and project support',
            intro:
              'For showroom visits, collection selection, or project guidance, you can reach our team directly.',
            note:
              'You can fill out the form or call us directly to arrange a faster conversation.',
            hours: 'Every day 09:00 - 19:00',
            consultationTitle: 'What we clarify together',
            consultationItems: ['Space dimensions', 'Product categories', 'Materials and tones'],
          };

  const contactCards = [
    {
      title: t('contact_page.showroom.address'),
      value: 'Masko Mobilyacilar Sitesi 18/B Blok No:35, Istanbul',
      Icon: MapPin,
    },
    {
      title: t('contact_page.showroom.phone'),
      value: '+90 546 789 89 68',
      Icon: Phone,
    },
    {
      title: t('contact_page.form.email'),
      value: 'info@brcinfinity.com',
      Icon: Mail,
    },
  ];

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: t('contact_page.toast.title'),
      description: t('contact_page.toast.description'),
    });
    form.reset();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <section className="theme-surface relative overflow-hidden px-4 pb-8 pt-3 md:pb-12 md:pt-4">
          <div className="photo-veil opacity-30" />
          <div className="ambient-orb animate-float-slow left-[-5rem] top-12 h-56 w-56 sm:h-72 sm:w-72" />
          <div className="ambient-orb animate-float-slower bottom-8 right-[-5rem] h-64 w-64 sm:h-80 sm:w-80" />
          <div className="container relative mx-auto px-0">
            <div className="theme-panel overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
                <div className="max-w-2xl">
                  <p className="section-kicker animate-reveal">{heroCopy.kicker}</p>
                  <h1 className="animate-reveal animate-reveal-delay-1 mt-5 font-headline text-5xl font-semibold leading-[0.98] text-primary md:text-7xl">
                    {t('contact_page.title')}
                  </h1>
                  <p className="animate-reveal animate-reveal-delay-2 mt-5 text-lg leading-8 text-primary/74 md:text-xl">
                    {heroCopy.intro}
                  </p>
                  <p className="animate-reveal animate-reveal-delay-3 mt-6 max-w-2xl text-base leading-8 text-primary/56">
                    {heroCopy.note}
                  </p>

                  <div className="animate-reveal animate-reveal-delay-3 mt-8 flex flex-wrap gap-3">
                    <a
                      href="tel:+905467898968"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.72rem] uppercase tracking-[0.16em] text-primary/64"
                    >
                      <Phone className="h-4 w-4 text-accent" />
                      +90 546 789 89 68
                    </a>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.72rem] uppercase tracking-[0.16em] text-primary/64">
                      <Clock3 className="h-4 w-4 text-accent" />
                      {heroCopy.hours}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  {contactCards.map(({ title, value, Icon }, index) => (
                    <Card
                      key={title}
                      className="theme-panel-lift animate-reveal rounded-[1.4rem]"
                      style={{ animationDelay: `${0.16 + index * 0.1}s` }}
                    >
                      <CardContent className="p-6">
                        <Icon className="h-5 w-5 text-accent" />
                        <p className="mt-5 text-[0.72rem] uppercase tracking-[0.16em] text-primary/44">{title}</p>
                        <p className="mt-3 text-sm leading-7 text-primary/68">{value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 pb-20 md:pb-24">
          <div className="container mx-auto px-0">
            <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
              <Card className="theme-panel-lift rounded-[1.8rem]">
                <CardContent className="p-8 sm:p-10">
                  <p className="section-kicker">{heroCopy.consultationTitle}</p>
                  <h2 className="mt-5 font-headline text-4xl font-semibold text-primary">{t('contact_page.showroom_title')}</h2>
                  <p className="mt-5 text-base leading-8 text-primary/58">{t('contact_page.showroom_description')}</p>

                  <div className="mt-8 space-y-3">
                    {heroCopy.consultationItems.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-primary/64"
                      >
                        <div className="h-2 w-2 rounded-full bg-accent/80" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 space-y-5 text-sm text-primary/64">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 h-4 w-4 text-accent" />
                      <span>Masko Mobilyacilar Sitesi 18/B Blok No:35, Istanbul</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-accent" />
                      <a href="tel:+905467898968" className="transition-colors hover:text-primary">
                        +90 546 789 89 68
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-accent" />
                      <a href="mailto:info@brcinfinity.com" className="transition-colors hover:text-primary">
                        info@brcinfinity.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[1.8rem]">
                <CardContent className="p-8 sm:p-10">
                  <div className="mb-8">
                    <p className="section-kicker">{t('contact_page.form_title')}</p>
                    <h2 className="mt-5 font-headline text-4xl font-semibold text-primary">
                      {language === 'tr' ? 'Mesajini birak' : language === 'fr' ? 'Laissez votre message' : 'Send your message'}
                    </h2>
                    <p className="mt-4 text-base leading-8 text-primary/58">{t('contact_page.subtitle')}</p>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('contact_page.form.name')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('contact_page.form.name_placeholder')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('contact_page.form.email')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('contact_page.form.email_placeholder')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact_page.form.subject')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('contact_page.form.subject_placeholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact_page.form.message')}</FormLabel>
                            <FormControl>
                              <Textarea placeholder={t('contact_page.form.message_placeholder')} rows={7} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" size="lg" className="h-12 rounded-full px-8">
                        {t('contact_page.form.submit_button')}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
