'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Crown } from 'lucide-react';

import { HEADER_LOGO_URL } from '@/lib/site-config';
import { canUseNextImage } from '@/lib/image-utils';

type LogoProps = {
  priority?: boolean;
};

export default function Logo({ priority = false }: LogoProps) {
  const logoUrl = HEADER_LOGO_URL;
  const canRenderWithNextImage = logoUrl ? canUseNextImage(logoUrl) : false;

  return (
    <Link href="/" className="group inline-flex min-w-0 items-center gap-3">
      {logoUrl ? (
        <div className="relative flex h-[48px] w-[128px] shrink-0 items-center justify-center overflow-hidden sm:h-[56px] sm:w-[150px] md:h-[72px] md:w-[210px]">
          {canRenderWithNextImage ? (
            <Image
              src={logoUrl}
              alt="BRC INFINITY Logo"
              fill
              priority={priority}
              sizes="(max-width: 640px) 128px, (max-width: 768px) 150px, 210px"
              className="object-contain"
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
          <span className="font-headline text-2xl font-bold tracking-tight text-primary">BRC INFINITY</span>
        </>
      )}
    </Link>
  );
}
