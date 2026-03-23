'use client';

import type { ComponentProps } from 'react';
import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/lib/i18n';
import { SITE_CATALOGS } from '@/lib/site-config';

type DownloadCatalogButtonProps = {
  className?: string;
  variant?: ComponentProps<typeof Button>['variant'];
};

export default function DownloadCatalogButton({
  className,
  variant = 'default',
}: DownloadCatalogButtonProps) {
  const { t } = useTranslation();
  const catalogs = SITE_CATALOGS.filter((catalog) => catalog.url && catalog.name);

  if (catalogs.length === 0) {
    return null;
  }

  if (catalogs.length === 1) {
    return (
      <Button variant={variant} className={className} asChild>
        <a href={catalogs[0].url} target="_blank" rel="noopener noreferrer">
          <Download className="mr-2 h-4 w-4" />
          {catalogs[0].name || t('header.download_catalog')}
        </a>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className={className}>
          <Download className="mr-2 h-4 w-4" />
          {t('header.download_catalog')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {catalogs.map((catalog) => (
          <DropdownMenuItem
            key={catalog.id}
            onClick={() => window.open(catalog.url, '_blank', 'noopener,noreferrer')}
          >
            {catalog.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
