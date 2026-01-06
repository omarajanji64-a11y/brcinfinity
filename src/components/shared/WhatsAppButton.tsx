
'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';

interface WhatsAppButtonProps {
    phoneNumber: string;
}

export default function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
  const { t } = useTranslation();
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <Button
      asChild
      size="icon"
      className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg z-50 animate-fade-in"
      aria-label={t('common.whatsapp_chat')}
    >
      <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="h-8 w-8" />
      </Link>
    </Button>
  );
}
