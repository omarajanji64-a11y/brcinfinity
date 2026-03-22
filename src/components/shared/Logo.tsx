'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Crown } from 'lucide-react';

import { HEADER_LOGO_URL } from '@/lib/site-config';
import { canUseNextImage } from '@/lib/image-utils';

export default function Logo() {
  const logoUrl = HEADER_LOGO_URL;
  const canRenderWithNextImage = logoUrl ? canUseNextImage(logoUrl) : false;

  return (
    <Link href="/" className="group inline-flex items-center gap-3">
      {logoUrl ? (
        <div className="relative flex h-[72px] w-[185px] items-center justify-center overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[0_18px_34px_rgba(0,0,0,0.14)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-accent/30 md:h-[84px] md:w-[235px]">
          {canRenderWithNextImage ? (
            <Image
              src={logoUrl}
              alt="BRC INFINITY Logo"
              fill
              priority
              sizes="(max-width: 768px) 185px, 235px"
              className="object-contain p-2"
            />
          ) : (
            <img
              src={logoUrl}
              alt="BRC INFINITY Logo"
              className="h-full w-full object-contain p-2"
              loading="eager"
              decoding="async"
            />
          )}
        </div>
      ) : (
        <>
          <Crown className="h-7 w-7 text-accent group-hover:animate-pulse" />
          <span className="font-headline text-2xl font-bold tracking-tight text-primary">BRC INFINITY</span>
        </>
      )}
    </Link>
  );
}
