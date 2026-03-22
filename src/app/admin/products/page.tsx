'use client';

import { useMemo, useState } from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';

import ProductForm from '@/components/admin/ProductForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/use-products';
import { useTranslation } from '@/lib/i18n';
import {
  getLocalizedText,
  getProductCategoryLabel,
  getProductName,
  type Product,
} from '@/lib/products';

export default function ProductsPage() {
  const { language, t } = useTranslation();
  const { toast } = useToast();
  const { products, isLoading, deleteProduct } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const sortedProducts = useMemo(
    () =>
      [...products].sort((left, right) =>
        getProductName(left, language).localeCompare(getProductName(right, language), 'tr')
      ),
    [language, products]
  );

  const openCreateDialog = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (product: Product) => {
    try {
      await deleteProduct(product.id);
      toast({
        title: 'Urun silindi',
        description: `${getProductName(product, language)} listeden kaldirildi.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Silme basarisiz',
        description: error instanceof Error ? error.message : 'Urun silinemedi.',
      });
    }
  };

  return (
    <>
      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) {
            setSelectedProduct(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Urunu duzenle' : 'Yeni urun ekle'}</DialogTitle>
            <DialogDescription>
              Admin panelden urun, gorsel ve filtre bilgilerini tek ekrandan yonet.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            product={selectedProduct}
            onSaved={() => {
              setIsFormOpen(false);
              setSelectedProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-bold">{t('admin_nav.products')}</h1>
            <p className="text-sm text-muted-foreground">
              Urunleri ekle, gorsel yukle, kategori ver ve vitrindeki filtreleri buradan kontrol et.
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Yeni urun
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Urun listesi</CardTitle>
            <CardDescription>Kaydedilen urunler anlik olarak burada gorunur.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[96px]">Gorsel</TableHead>
                  <TableHead>Urun</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Stil</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead className="w-[70px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <TableRow key={`product-skeleton-${index}`}>
                      <TableCell colSpan={7}>
                        <Skeleton className="h-12 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : sortedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                      Henuz urun yok. Ilk urunu eklemek icin sag ustteki butonu kullan.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProducts.map((product) => {
                    const previewImage = product.imageUrls[0] || product.imageUrl;
                    const productName = getProductName(product, language);
                    const categoryLabel = getProductCategoryLabel(product, language, t);
                    const shortDescription = getLocalizedText(product.shortDescription, language);

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="h-16 w-16 overflow-hidden rounded-md border bg-muted">
                            {previewImage ? (
                              <img src={previewImage} alt={productName} className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{productName}</div>
                            {shortDescription ? (
                              <p className="max-w-md text-xs text-muted-foreground">
                                {shortDescription}
                              </p>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>{categoryLabel}</TableCell>
                        <TableCell>{product.style === 'Classic' ? 'Klasik' : 'Modern'}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(product)}>
                                Duzenle
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(product)}
                              >
                                Sil
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
