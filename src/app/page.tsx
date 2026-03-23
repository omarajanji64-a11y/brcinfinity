import dynamic from 'next/dynamic';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroCarousel from '@/components/home/HeroCarousel';

function DeferredSectionPlaceholder() {
  return (
    <div className="px-4 py-20 md:py-24">
      <div className="container mx-auto px-0">
        <div className="theme-panel h-[320px] rounded-[1.8rem] opacity-60" />
      </div>
    </div>
  );
}

const Categories = dynamic(() => import('@/components/home/Categories'), {
  loading: () => <DeferredSectionPlaceholder />,
});

const FeaturedProducts = dynamic(() => import('@/components/home/FeaturedProducts'), {
  loading: () => <DeferredSectionPlaceholder />,
});

const WhyUs = dynamic(() => import('@/components/home/WhyUs'), {
  loading: () => <DeferredSectionPlaceholder />,
});

const CustomRequest = dynamic(() => import('@/components/home/CustomRequest'), {
  loading: () => <DeferredSectionPlaceholder />,
});

const deferredSectionStyle = {
  contentVisibility: 'auto',
  containIntrinsicSize: '1px 900px',
} as const;

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroCarousel />
        <div style={deferredSectionStyle}>
          <Categories />
        </div>
        <div style={deferredSectionStyle}>
          <FeaturedProducts />
        </div>
        <div style={deferredSectionStyle}>
          <WhyUs />
        </div>
        <div style={deferredSectionStyle}>
          <CustomRequest />
        </div>
      </main>
      <Footer />
    </div>
  );
}
