'use client';

import Link from 'next/link';
import { Crown } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { Skeleton } from '../ui/skeleton';

type BrandingConfig = {
    logoUrl?: string;
}

const FALLBACK_LOGO_URL = "https://i.ibb.co/N2r4xFMc/Screenshot-2026-01-06-09-00-56-removebg-preview.png";

export default function Logo() {
  const firestore = useFirestore();

  const brandingConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config/branding');
  }, [firestore]);

  const { data: brandingConfig, isLoading } = useDoc<BrandingConfig>(brandingConfigRef);

  if (isLoading) {
    return (
        <div className="flex items-center gap-2">
            <Skeleton className="h-32 w-80" />
        </div>
    )
  }

  const logoUrl = brandingConfig?.logoUrl || FALLBACK_LOGO_URL;

  return (
    <Link href="/" className="flex items-center gap-2 group">
      {logoUrl ? (
        <div className="relative h-32 w-80">
            <img 
                src={logoUrl}
                alt="BRC INFINITY Logo"
                className="object-contain w-full h-full"
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
