
'use client'

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Crown, LayoutDashboard, ShoppingCart, BarChart, FileText, Bot, Home, Palette, Paintbrush, Image, BookOpen } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useTranslation } from '@/lib/i18n';
import Logo from '../shared/Logo';

export default function AdminNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  
  const navItems = [
    { href: '/admin/dashboard', label: t('admin_nav.dashboard'), icon: LayoutDashboard },
    { href: '/admin/products', label: t('admin_nav.products'), icon: ShoppingCart },
    { href: '/admin/homepage', label: t('admin_nav.homepage'), icon: Home },
    { href: '/admin/cloudinary', label: 'Carousel', icon: Image },
    { href: '/admin/catalogs', label: t('admin_nav.catalogs'), icon: BookOpen },
    { href: '/admin/theme', label: t('admin_nav.theme'), icon: Palette },
    { href: '/admin/branding', label: t('admin_nav.branding'), icon: Paintbrush },
    { href: '/admin/seo', label: t('admin_nav.seo'), icon: Bot },
    { href: '/admin/importer', label: 'Importer', icon: FileText },
  ];
  
  return (
    <div className="flex flex-col h-full">
        <div className="flex items-center justify-center p-4 border-b h-40">
            <Logo />
        </div>
        <div className="flex-1 overflow-y-auto">
            <SidebarMenu className="p-4">
                {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                         <Link href={item.href}>
                            <SidebarMenuButton
                                isActive={pathname.startsWith(item.href)}
                                className="justify-start gap-3"
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="text-base">{item.label}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </div>
    </div>
  );
}
