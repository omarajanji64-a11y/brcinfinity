'use client';

import Link from 'next/link';
import { Crown } from 'lucide-react';
import { FALLBACK_LOGO_URL } from '@/lib/site-config';

export default function Logo() {
  const logoUrl = FALLBACK_LOGO_URL;

  return (
    <Link href="/" className="flex items-center gap-2 group">
      {logoUrl ? (
        <div className="relative h-32 w-80">
            <img 
                src={logoUrl}
                alt="BRC INFINITY Logo"
                className="object-contain w-full h-full"
                loading="eager"
                decoding="async"
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
