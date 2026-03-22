import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyUs from '@/components/home/WhyUs';
import CustomRequest from '@/components/home/CustomRequest';
import CloudinaryCarousel from '@/components/home/CloudinaryCarousel';

const deferredSectionStyle = {
  contentVisibility: 'auto',
  containIntrinsicSize: '1px 900px',
} as const;

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <CloudinaryCarousel />
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
