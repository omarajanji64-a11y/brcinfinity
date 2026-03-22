
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Crown } from 'lucide-react';

import { canUseNextImage } from '@/lib/image-utils';
import { FALLBACK_LOGO_URL } from '@/lib/site-config';

export default function StaticLogo() {
  const canRenderWithNextImage = canUseNextImage(FALLBACK_LOGO_URL);

  return (
    <Link href="/" className="flex items-center justify-center group">
      {FALLBACK_LOGO_URL ? (
        <div className="relative h-28 w-28">
          {canRenderWithNextImage ? (
            <Image
              src={FALLBACK_LOGO_URL}
              alt="BRC INFINITY Logo"
              fill
              priority
              sizes="112px"
              className="h-full w-full object-contain"
            />
          ) : (
            <img
              src={FALLBACK_LOGO_URL}
              alt="BRC INFINITY Logo"
              className="h-full w-full object-contain"
              loading="eager"
              decoding="async"
            />
          )}
        </div>
      ) : (
        <>
        <Crown className="h-7 w-7 text-accent group-hover:animate-pulse" />
        <span className="font-headline text-2xl font-bold tracking-tight text-animation">
          BRC INFINITY
        </span>
        </>
      )}
    </Link>
  );
}
