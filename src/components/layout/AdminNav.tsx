
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useTranslation } from '@/lib/i18n';
import Logo from '../shared/Logo';

export default function AdminNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  
  const navItems = [
    { href: '/admin/products', label: t('admin_nav.products'), icon: ShoppingCart },
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
