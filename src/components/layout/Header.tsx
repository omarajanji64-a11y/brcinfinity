'use client';

import Link from 'next/link';
import { Download, Menu, X } from 'lucide-react';
import { doc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import Logo from '@/components/shared/Logo';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { Skeleton } from '../ui/skeleton';
import { useTranslation } from '@/lib/i18n';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import packageJson from '../../../package.json';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

type Catalog = {
  id: string;
  name: string;
  url: string;
};

type CatalogConfig = {
  catalogs: Catalog[];
};

function DownloadCatalogButton() {
    const { t } = useTranslation();
    const firestore = useFirestore();
    const catalogConfigRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'config/catalog');
    }, [firestore]);

    const { data: catalogConfig, isLoading } = useDoc<CatalogConfig>(catalogConfigRef);

    if (isLoading) {
        return <Skeleton className="h-10 w-44" />;
    }

    const catalogs = catalogConfig?.catalogs?.filter(c => c.url && c.name) || [];

    if (catalogs.length === 0) {
        return (
             <Button variant="outline" disabled className="text-white">
                <Download className="mr-2 h-4 w-4" />
                {t('header.download_catalog')}
            </Button>
        );
    }
    
    if (catalogs.length === 1) {
       return (
        <Button variant="outline" onClick={() => window.open(catalogs[0].url, '_blank')} className="text-white transition-transform duration-300 hover:scale-105">
            <Download className="mr-2 h-4 w-4" />
            {catalogs[0].name || t('header.download_catalog')}
        </Button>
       )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-white transition-transform duration-300 hover:scale-105">
                    <Download className="mr-2 h-4 w-4" />
                    {t('header.download_catalog')}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {catalogs.map((catalog) => (
                    <DropdownMenuItem key={catalog.id} onClick={() => window.open(catalog.url, '_blank')}>
                        {catalog.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


export default function Header() {
  const { t } = useTranslation();
  const navLinksLeft = [
    { href: '/', label: t('header.home') },
    { href: '/products', label: t('header.products') },
    { href: '/mission-vision', label: t('header.mission_vision') },
    { href: '/about-us', label: 'About Us' },
  ];
  const navLinksRight = [
    { href: '/contact', label: t('header.contact') },
  ];

  const version = packageJson.version;

  return (
    <header className="sticky top-0 z-50 bg-background/50 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto grid h-40 grid-cols-2 items-center px-4 md:grid-cols-3">
        <nav className="hidden md:flex items-center gap-6">
          {navLinksLeft.map(link => (
            <Link key={link.href} href={link.href} className="text-white hover:text-white/80 transition-colors font-medium">
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center justify-start md:justify-center col-start-1 md:col-start-2">
            <Logo />
        </div>
        
        <div className="hidden md:flex items-center justify-end gap-2">
          {navLinksRight.map(link => (
            <Link key={link.href} href={link.href} className="text-white hover:text-white/80 transition-colors font-medium">
              {link.label}
            </Link>
          ))}
          <DownloadCatalogButton />
          <LanguageSwitcher />
        </div>

        <div className="md:hidden flex items-center justify-end col-start-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="p-4">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center justify-center">
                    <Logo />
                  </div>
                  <SheetClose asChild>
                     <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                     </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col gap-6 text-lg">
                  {[...navLinksLeft, ...navLinksRight].map(link => (
                    <SheetClose asChild key={link.href}>
                      <Link href={link.href} className="text-foreground/80 hover:text-foreground transition-colors font-medium">
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-8 flex flex-col gap-4">
                  <DownloadCatalogButton />
                  <LanguageSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
