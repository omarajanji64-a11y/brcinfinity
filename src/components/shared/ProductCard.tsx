
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/data';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { MessageCircle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface ProductCardProps {
  product: Product;
}

const transformCloudinaryUrl = (url: string) => {
    if (!url || !url.includes('/upload/')) {
        return url;
    }
    const parts = url.split('/upload/');
    const transformations = 'w_600,h_600,c_fill,g_auto';
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
}


export default function ProductCard({ product }: ProductCardProps) {
  const { t, language } = useTranslation();

  // Format price consistently on both server and client to avoid hydration mismatch
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  const productName = product.name[language] ?? product.name['en'];
  const phoneNumber = '905467898968'; // Your WhatsApp number
  const message = t('whatsapp.order_message', { 
    productName: productName,
    productImage: product.imageUrl || '' 
  });
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  const isValidUrl = typeof product.imageUrl === 'string' && product.imageUrl.startsWith('https://');
  const transformedUrl = isValidUrl ? transformCloudinaryUrl(product.imageUrl) : '';

  return (
    <Card className="overflow-hidden transition-all duration-500 group h-full flex flex-col border-0 shadow-lg hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-2 bg-secondary/30">
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden">
          {isValidUrl ? (
            <img
              src={transformedUrl}
              alt={productName}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col text-center">
        <CardTitle className="font-headline text-lg mt-2">{productName}</CardTitle>
        <div className='flex-grow' />
        <CardDescription className="mt-2 text-base text-accent font-bold">{formattedPrice.replace('$', '$ ')}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full transition-transform duration-300 hover:scale-105">
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t('common.order_whatsapp')}
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

    