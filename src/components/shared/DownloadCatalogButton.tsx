'use client';

import type { ComponentProps } from 'react';
import { Download } from 'lucide-react';

import { useCatalogs } from '@/hooks/use-catalogs';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/lib/i18n';

type DownloadCatalogButtonProps = {
  className?: string;
  variant?: ComponentProps<typeof Button>['variant'];
};

export default function DownloadCatalogButton({
  className,
  variant = 'default',
}: DownloadCatalogButtonProps) {
  const { t } = useTranslation();
  const { catalogs } = useCatalogs();

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
          <DropdownMenuItem key={catalog.id} asChild>
            <a href={catalog.url} target="_blank" rel="noopener noreferrer">
              {catalog.name}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
