
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
      className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg animate-fade-in hover:bg-accent/90 md:bottom-6 md:right-6 md:h-16 md:w-16"
      aria-label={t('common.whatsapp_chat')}
    >
      <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="h-7 w-7 md:h-8 md:w-8" />
      </Link>
    </Button>
  );
}
