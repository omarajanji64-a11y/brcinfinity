'use client';

import { Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogoutButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const response = await fetch('/api/admin-session', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Cikis yapilamadi.');
      }

      toast({
        title: 'Admin modu kapatildi',
        description: 'Sifre ekrani yeniden acildi.',
      });

      router.refresh();
    } catch (logoutError) {
      toast({
        variant: 'destructive',
        title: 'Cikis basarisiz',
        description: logoutError instanceof Error ? logoutError.message : 'Tekrar dene.',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button type="button" variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
      Cikis
    </Button>
  );
}
