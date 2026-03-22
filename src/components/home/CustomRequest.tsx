'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { canUseNextImage } from '@/lib/image-utils';
import { useTranslation } from '@/lib/i18n';

const BACKGROUND_IMAGE_URL =
  'https://images.unsplash.com/photo-1598928373322-6175657d425c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8d29vZHdvcmtpbmd8ZW58MHx8fHwxNzY3NTg5OTU5fDA&ixlib=rb-4.1.0&q=80&w=1080';

export default function CustomRequest() {
  const { t } = useTranslation();
  return (
    <div className="relative py-24">
      {canUseNextImage(BACKGROUND_IMAGE_URL) ? (
        <Image
          src={BACKGROUND_IMAGE_URL}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <img
          src={BACKGROUND_IMAGE_URL}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative container mx-auto px-4 text-center text-white">
        <h2 className="font-headline text-4xl font-bold">{t('home.custom_request_title')}</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-white/80">
          {t('home.custom_request_desc')}
        </p>
        <Button asChild size="lg" className="mt-8 transition-transform duration-300 hover:scale-105">
          <Link href="/contact">{t('home.custom_request_button')}</Link>
        </Button>
      </div>
    </div>
  );
}
