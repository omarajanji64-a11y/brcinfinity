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
    <Link href="/" className="group flex min-w-0 items-center gap-2">
      {logoUrl ? (
        <div className="relative h-[68px] w-[170px] shrink-0 sm:h-[78px] sm:w-[200px] md:h-[96px] md:w-[250px]">
          {canRenderWithNextImage ? (
            <Image
              src={logoUrl}
              alt="BRC INFINITY Logo"
              fill
              priority={priority}
              sizes="(max-width: 640px) 170px, (max-width: 768px) 200px, 250px"
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
