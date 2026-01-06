
'use client';

import Link from 'next/link';
import { Crown } from 'lucide-react';

export default function StaticLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
        <Crown className="h-7 w-7 text-accent group-hover:animate-pulse" />
        <span className="font-headline text-2xl font-bold tracking-tight text-animation">
            BRC INFINITY
        </span>
    </Link>
  );
}
