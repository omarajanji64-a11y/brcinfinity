'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import { collection } from 'firebase/firestore';
import { useTranslation } from '@/lib/i18n';
import { websiteTrafficData, salesData } from '@/lib/data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

function InquiryStats() {
    const { t } = useTranslation();
    const firestore = useFirestore();
    const inquiriesCollectionRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'inquiries');
    }, [firestore]);
    const { data: inquiries, isLoading } = useCollection(inquiriesCollectionRef);
    const totalInquiries = inquiries?.length ?? 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('dashboard.total_inquiries')}</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <>
                        <Skeleton className="h-8 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                    </>
                ) : (
                    <>
                        <div className="text-2xl font-bold">{totalInquiries}</div>
                        <p className="text-xs text-muted-foreground">{t('dashboard.inquiries_change_text')}</p>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    const { t, language } = useTranslation();

    const chartConfig = {
      visits: {
        label: "Visits",
      },
      sales: {
        label: t('dashboard.sales_by_category'),
        color: "hsl(var(--accent))",
      },
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold">{t('dashboard.title')}</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <InquiryStats />
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('dashboard.website_visits')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5,329</div>
                        <p className="text-xs text-muted-foreground">{t('dashboard.visits_change_text', {change: '20.1'})}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('dashboard.engagement')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">73.5%</div>
                        <p className="text-xs text-muted-foreground">{t('dashboard.engagement_change_text', {change: '1.2'})}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.website_traffic')}</CardTitle>
                        <CardDescription>{t('dashboard.website_traffic_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                             <BarChart data={websiteTrafficData} accessibilityLayer>
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Bar dataKey="visits" fill="hsl(var(--primary))" radius={4} />
                             </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.sales_by_category')}</CardTitle>
                        <CardDescription>{t('dashboard.sales_by_category_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <ChartContainer config={chartConfig} className="h-[250px] w-full">
                         <BarChart data={salesData(language)} layout="vertical" accessibilityLayer>
                            <YAxis
                                dataKey="category"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                fontSize={12}
                                width={80}
                            />
                            <XAxis dataKey="sales" type="number" hide />
                            <ChartTooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                            <Bar dataKey="sales" layout="vertical" fill="hsl(var(--accent))" radius={4}>
                            </Bar>
                         </BarChart>
                       </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
