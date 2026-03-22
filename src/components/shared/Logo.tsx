'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Crown } from 'lucide-react';
import { FALLBACK_LOGO_URL } from '@/lib/site-config';

export default function Logo() {
  const logoUrl = FALLBACK_LOGO_URL;

  return (
    <Link href="/" className="flex items-center gap-2 group">
      {logoUrl ? (
        <div className="relative h-32 w-80">
          <Image
            src={logoUrl}
            alt="BRC INFINITY Logo"
            fill
            priority
            sizes="(max-width: 768px) 220px, 320px"
            className="h-full w-full object-contain"
          />
        </div>
      ) : (
        <>
            <Crown className="h-7 w-7 text-accent group-hover:animate-pulse" />
            <span className="font-headline text-2xl font-bold tracking-tight">
                BRC INFINITY
            </span>
        </>
      )}
    </Link>
  );
}
