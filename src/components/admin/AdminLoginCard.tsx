'use client';

import { useState } from 'react';
import { Loader2, LockKeyhole } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginCard() {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error || 'Sifre dogrulanamadi.');
      }

      toast({
        title: 'Admin modu acildi',
        description: 'Urun yonetim ekranina geciliyor.',
      });

      router.refresh();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Sifre hatali.';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Giris basarisiz',
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-white/10 bg-background/95 shadow-2xl shadow-black/30">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <CardTitle className="font-headline text-3xl">Admin Mode</CardTitle>
          <CardDescription>
            Urunleri duzenlemek ve yeni urun eklemek icin once sifreyi gir.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Sifre</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin sifresi"
              autoComplete="current-password"
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? 'Kontrol ediliyor' : 'Admin modunu ac'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
