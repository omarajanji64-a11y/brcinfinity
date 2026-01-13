
'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Target, Heart, Zap } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-4 bg-gradient-to-b from-secondary/50 to-background overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-8 right-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center mb-16 animate-fade-in-up">
              <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 text-accent drop-shadow-lg">About Us</h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                At BRC Infinity, we are dedicated to redefining luxury living through timeless, classic, and sustainable furniture. Our mission is to craft pieces that not only elevate your space but also stand the test of time—ensuring safety, comfort, and elegance for generations.
              </p>
            </div>
          </div>
        </section>
        {/* Mission Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Sparkles className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Timeless Luxury</h3>
                <p className="text-muted-foreground">We create furniture that blends classic design with modern sensibilities, ensuring every piece is both luxurious and enduring.</p>
              </CardContent>
            </Card>
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Heart className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Crafted for Safety & Comfort</h3>
                <p className="text-muted-foreground">Our commitment to quality means every product is made with safe, sustainable materials and meticulous attention to detail.</p>
              </CardContent>
            </Card>
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Zap className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sustainable Excellence</h3>
                <p className="text-muted-foreground">We believe true luxury is responsible. Our mission is to lead the industry in sustainable practices, from sourcing to delivery.</p>
              </CardContent>
            </Card>
          </div>
        </section>
        {/* Vision Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">Our Vision</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Target className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Global Inspiration</h3>
                <p className="text-muted-foreground">To inspire homes and spaces worldwide with furniture that is both classic and innovative, reflecting the best of timeless design.</p>
              </CardContent>
            </Card>
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Sparkles className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Legacy of Trust</h3>
                <p className="text-muted-foreground">To build a legacy where every BRC Infinity piece is recognized for its quality, safety, and sustainability—cherished for generations.</p>
              </CardContent>
            </Card>
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Heart className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Community & Care</h3>
                <p className="text-muted-foreground">To foster a community that values classic beauty, sustainability, and the well-being of every customer and artisan.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
