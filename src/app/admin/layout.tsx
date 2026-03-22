'use client';

import React from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarContent } from '@/components/ui/sidebar';
import AdminNav from '@/components/layout/AdminNav';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarContent>
            <AdminNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 items-center justify-between border-b px-4 lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1" />
             <div className="flex items-center gap-2">
                <Button variant="outline" asChild className="transition-transform duration-300 hover:scale-105">
                    <a href="/" target="_blank" rel="noreferrer">{t('header.home')}</a>
                </Button>
                <LanguageSwitcher />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-secondary/50">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
