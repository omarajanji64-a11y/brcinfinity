
'use client';

import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyUs from '@/components/home/WhyUs';
import CustomRequest from '@/components/home/CustomRequest';
import { Skeleton } from '@/components/ui/skeleton';
import CloudinaryCarousel from '@/components/home/CloudinaryCarousel';

function HomePageContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <CloudinaryCarousel />
        <Categories />
        <FeaturedProducts />
        <WhyUs />
        <CustomRequest />
      </main>
      <Footer />
    </div>
  );
}


export default function Home() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Skeleton className="h-[60vh] w-full" />
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
