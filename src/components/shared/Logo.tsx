'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Crown } from 'lucide-react';

import { FALLBACK_LOGO_URL } from '@/lib/site-config';
import { canUseNextImage } from '@/lib/image-utils';

export default function Logo() {
  const logoUrl = FALLBACK_LOGO_URL;
  const canRenderWithNextImage = logoUrl ? canUseNextImage(logoUrl) : false;

  return (
    <Link href="/" className="flex items-center justify-center group">
      {logoUrl ? (
        <div className="relative h-24 w-24 sm:h-28 sm:w-28">
          {canRenderWithNextImage ? (
            <Image
              src={logoUrl}
              alt="BRC INFINITY Logo"
              fill
              priority
              sizes="(max-width: 768px) 96px, 112px"
              className="h-full w-full object-contain"
            />
          ) : (
            <img
              src={logoUrl}
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
          <span className="font-headline text-2xl font-bold tracking-tight">BRC INFINITY</span>
        </>
      )}
    </Link>
  );
}
