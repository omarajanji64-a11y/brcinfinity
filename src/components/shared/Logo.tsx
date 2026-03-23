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
    <Link href="/" className="group flex min-w-0 items-center justify-center gap-1.5">
      {logoUrl ? (
        <div className="relative h-[66px] w-[164px] shrink-0 sm:h-[76px] sm:w-[190px] md:h-[90px] md:w-[228px]">
          {canRenderWithNextImage ? (
            <Image
              src={logoUrl}
              alt="BRC INFINITY Logo"
              fill
              priority={priority}
              sizes="(max-width: 640px) 164px, (max-width: 768px) 190px, 228px"
              className="h-full w-full object-contain object-center"
            />
          ) : (
            <img
              src={logoUrl}
              alt="BRC INFINITY Logo"
              className="h-full w-full object-contain object-center"
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
