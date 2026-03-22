import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyUs from '@/components/home/WhyUs';
import CustomRequest from '@/components/home/CustomRequest';
import CloudinaryCarousel from '@/components/home/CloudinaryCarousel';

export default function Home() {
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
