'use client';

import { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Bot, Loader2, Wand2, CheckCircle, Search, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { useTranslation, type Language } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { optimizeProductSeo, SeoOptimizationOutput } from '@/ai/flows/seo-optimizer-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

// Simulated data for SEO performance
const seoPerformanceData = [
  { week: 'Week 1', rank: 75 },
  { week: 'Week 2', rank: 68 },
  { week: 'Week 3', rank: 55 },
  { week: 'Week 4', rank: 42 },
  { week: 'Week 5', rank: 31 },
  { week: 'Week 6', rank: 22 },
];


export default function SeoAdminPage() {
  const { t, language } = useTranslation();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<SeoOptimizationOutput[]>([]);

  const productsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsCollectionRef);

  const handleOptimize = async () => {
    if (!products || products.length === 0) {
      toast({
        variant: 'destructive',
        title: t('admin_seo.toast_no_products_title'),
        description: t('admin_seo.toast_no_products_desc'),
      });
      return;
    }
    
    setIsLoading(true);
    setOptimizationResults([]);

    try {
      const optimizationPromises = products.map(product => 
        optimizeProductSeo({
          product: {
            id: product.id,
            name: product.name[language] || product.name.en,
            description: product.description[language] || product.description.en,
            category: product.category[language] || product.category.en,
            style: product.style,
            // @ts-ignore - keywords may not exist on old products
            currentKeywords: product.keywords || [],
          }
        })
      );

      const results = await Promise.all(optimizationPromises);

      // Now, update the products in Firestore with the new SEO data
      if (firestore) {
          for (const result of results) {
              const productRef = doc(firestore, 'products', result.productId);
              try {
                await setDoc(productRef, {
                    keywords: result.optimizedKeywords,
                    metaDescription: result.optimizedMetaDescription,
                }, { merge: true });
              } catch(e) {
                console.error("Failed to update product SEO:", e);
              }
          }
      }
      
      setOptimizationResults(results);
      toast({
        title: "Optimization Complete",
        description: `${results.length} products have been optimized and updated.`
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('admin_seo.toast_error_title'),
        description: (error as Error).message || t('admin_seo.toast_error_desc'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold">{t('admin_seo.title')}</h1>
        <Button onClick={handleOptimize} disabled={isLoading || isLoadingProducts}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {isLoading ? t('admin_seo.cta_loading_button') : t('admin_seo.cta_button')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin_seo.performance_title')}</CardTitle>
          <CardDescription>{t('admin_seo.performance_desc')}</CardDescription>
        </CardHeader>
        <CardContent>
           <ChartContainer config={{}} className="h-[300px] w-full">
                <ResponsiveContainer>
                    <LineChart data={seoPerformanceData}>
                    <XAxis dataKey="week" />
                    <YAxis reversed domain={['dataMin', 'dataMax']} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="rank" 
                        name="Average Keyword Rank"
                        stroke="hsl(var(--accent))" 
                        strokeWidth={2} 
                        dot={{ fill: "hsl(var(--accent))" }} 
                        activeDot={{ r: 8 }} 
                    />
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin_seo.results_title')}</CardTitle>
          <CardDescription>
             {optimizationResults.length > 0 ? t('admin_seo.results_description') : t('admin_seo.no_results')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
             </div>
          ) : (
             <Accordion type="single" collapsible className="w-full">
                {optimizationResults.map((result, index) => {
                    const product = products?.find(p => p.id === result.productId);
                    return (
                        <AccordionItem value={`item-${index}`} key={result.productId}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-4">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="font-semibold">{t('admin_seo.product_optimized')}: {product?.name[language] || product?.name.en}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <p className="text-sm italic text-muted-foreground">{result.changelog}</p>
                                <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">{t('admin_seo.new_meta_desc')}</h4>
                                        <p className="text-sm border-l-2 border-accent pl-2">{result.optimizedMetaDescription}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">{t('admin_seo.new_keywords')}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.optimizedKeywords.map(kw => (
                                                <Badge key={kw} variant="outline">{kw}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
