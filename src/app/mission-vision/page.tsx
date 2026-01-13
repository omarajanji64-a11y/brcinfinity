'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, ShieldCheck, Leaf, Sparkles } from 'lucide-react';

export default function MissionVisionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="relative py-16 md:py-24 px-4 bg-gradient-to-b from-secondary/60 to-background overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-12 left-12 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
            <div className="absolute -bottom-8 right-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          <div className="container mx-auto max-w-4xl relative z-10 text-center">
            <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 text-accent drop-shadow-lg">
              Mission & Vision
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              BRC Infinity exists to craft luxury pieces that feel classic, timeless, safe, and sustainable. Every collection is designed to
              elevate the home while honoring enduring craftsmanship.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Crown className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Luxury with Purpose</h3>
                <p className="text-muted-foreground">
                  Craft furniture that embodies refined luxury and classic character, designed to feel exceptional in every detail.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <ShieldCheck className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Built for Safety</h3>
                <p className="text-muted-foreground">
                  Use trusted materials and rigorous craftsmanship so every piece is safe, dependable, and built to last.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Leaf className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sustainable Excellence</h3>
                <p className="text-muted-foreground">
                  Commit to responsible sourcing and sustainable processes so luxury remains timeless for the planet as well.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">Our Vision</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Sparkles className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Timeless Presence</h3>
                <p className="text-muted-foreground">
                  To become a global reference for timeless interiors, where classic design feels fresh and enduring.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Crown className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Legacy of Craft</h3>
                <p className="text-muted-foreground">
                  To build a legacy of craftsmanship that families trust, cherish, and pass down across generations.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Leaf className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sustainable Luxury</h3>
                <p className="text-muted-foreground">
                  To prove that luxury can be responsible, blending beauty and sustainability in every collection.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
