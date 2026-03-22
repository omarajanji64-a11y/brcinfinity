
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail, Phone, MapPin } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";

export default function ContactPage() {
  const { t } = useTranslation();
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
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: t('contact_page.toast.title'),
      description: t('contact_page.toast.description'),
    });
    form.reset();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="theme-surface bg-secondary">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">{t('contact_page.title')}</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              {t('contact_page.subtitle')}
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-headline text-3xl font-bold mb-6">{t('contact_page.form_title')}</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          <Textarea placeholder={t('contact_page.form.message_placeholder')} rows={6} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="lg">{t('contact_page.form.submit_button')}</Button>
                </form>
              </Form>
            </div>
            <div className="space-y-8">
              <h2 className="font-headline text-3xl font-bold">{t('contact_page.showroom_title')}</h2>
              <p className="text-muted-foreground">
                {t('contact_page.showroom_description')}
              </p>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-accent mt-1" />
                    <div>
                      <h3 className="font-semibold">{t('contact_page.showroom.address')}</h3>
                      <p className="text-muted-foreground">Masko mobilyacılar sitesi 18/B No 35 Istanbul, Turkey</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-accent mt-1" />
                    <div>
                      <h3 className="font-semibold">{t('contact_page.showroom.phone')}</h3>
                      <p className="text-muted-foreground">+90 546 789 89 68</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
