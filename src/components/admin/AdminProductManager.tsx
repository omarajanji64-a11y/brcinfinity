'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, FileText, MoreHorizontal, PlusCircle } from 'lucide-react';

import ProductForm from '@/components/admin/ProductForm';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';
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
import { useProducts } from '@/hooks/use-products';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/i18n';
import {
  getLocalizedText,
  getProductCategoryLabel,
  getProductName,
  type Product,
} from '@/lib/products';

export default function AdminProductManager() {
  const { language, t } = useTranslation();
  const { toast } = useToast();
  const { products, isLoading, deleteProduct } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const sortedProducts = useMemo(
    () =>
      [...products].sort((left, right) =>
        getProductName(left, language, 'Adsiz urun').localeCompare(getProductName(right, language, 'Adsiz urun'), 'tr')
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
        description: `${getProductName(product, language, 'Adsiz urun')} listeden kaldirildi.`,
      });
    } catch (deleteError) {
      toast({
        variant: 'destructive',
        title: 'Silme basarisiz',
        description: deleteError instanceof Error ? deleteError.message : 'Urun silinemedi.',
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
              Fotograf, ad, aciklama, kategori ve diger urun bilgilerini bu ekrandan yonet.
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

      <div className="w-full max-w-7xl space-y-6">
        <Card className="border-white/10 bg-background/95 shadow-2xl shadow-black/30">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-accent">Admin Mode</p>
              <CardTitle className="font-headline text-3xl">Urun Yonetimi</CardTitle>
              <CardDescription className="max-w-2xl">
                Yeni urun ekle, mevcut urunleri duzenle, fotograflari guncelle ve kategorileri filtrelerle uyumlu
                tut.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Siteye don
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/catalogs">
                  <FileText className="mr-2 h-4 w-4" />
                  {t('admin_nav.catalogs')}
                </Link>
              </Button>
              <AdminLogoutButton />
              <Button onClick={openCreateDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Yeni urun
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-white/10 bg-background/95 shadow-2xl shadow-black/30">
          <CardHeader>
            <CardTitle>{t('admin_nav.products')}</CardTitle>
            <CardDescription>Kaydedilen urunler burada listelenir. Duzenle veya sil islemleri anlik uygulanir.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[96px]">Gorsel</TableHead>
                  <TableHead>Urun</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead className="w-[70px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <TableRow key={`product-skeleton-${index}`}>
                      <TableCell colSpan={5}>
                        <Skeleton className="h-12 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : sortedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      Henuz urun yok. Ilk urunu eklemek icin yukaridaki butonu kullan.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProducts.map((product) => {
                    const previewImage = product.imageUrls[0] || product.imageUrl;
                    const productName = getProductName(product, language, 'Adsiz urun');
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
                              <p className="max-w-md text-xs text-muted-foreground">{shortDescription}</p>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>{categoryLabel}</TableCell>
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

