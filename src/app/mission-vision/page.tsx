'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Target, Heart, Zap } from 'lucide-react';

export default function MissionVisionPage() {
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
              <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 text-accent drop-shadow-lg">Our Mission & Vision</h1>
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

// REMOVE ALL CODE BELOW THIS LINE (if any)
                      {item.icon}
                    </div>
                    <h3 className="font-headline text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-20 px-4 bg-secondary/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mb-4">
                {t('mission_vision.our_vision')}
              </h2>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                {t('mission_vision.vision_intro')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {visions.map((item, index) => (
                <Card 
                  key={index}
                  className="bg-background border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8 text-center">
                    <div className="mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="font-headline text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-background relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
          
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mb-6">
                {t('mission_vision.our_values')}
              </h2>
            </div>

            <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-8 md:p-12 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                {t('mission_vision.values_desc')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-1 bg-accent rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-accent mb-2">{t('mission_vision.value_quality')}</h4>
                    <p className="text-white/70">{t('mission_vision.value_quality_desc')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-accent rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-accent mb-2">{t('mission_vision.value_integrity')}</h4>
                    <p className="text-white/70">{t('mission_vision.value_integrity_desc')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-accent rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-accent mb-2">{t('mission_vision.value_passion')}</h4>
                    <p className="text-white/70">{t('mission_vision.value_passion_desc')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-accent rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-accent mb-2">{t('mission_vision.value_sustainability')}</h4>
                    <p className="text-white/70">{t('mission_vision.value_sustainability_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
