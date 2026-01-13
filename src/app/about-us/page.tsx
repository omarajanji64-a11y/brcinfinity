'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, ShieldCheck, Leaf, Sparkles } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="relative py-16 md:py-24 px-4 bg-gradient-to-b from-secondary/60 to-background overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-12 left-12 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
            <div
              className="absolute -bottom-8 right-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
              style={{ animationDelay: '2s' }}
            />
          </div>
          <div className="container mx-auto max-w-4xl relative z-10 text-center">
            <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 text-accent drop-shadow-lg">
              Hakkımızda
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              BRC Infinity, lüksü zamansız tasarımla buluşturan; klasik, güvenli ve sürdürülebilir mobilyalar üretmeyi
              amaçlayan bir marka. Her parça, yaşam alanlarını yücelten bir zarafet ve kalıcı bir kalite için tasarlanır.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">Misyonumuz</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Crown className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Amaçlı Lüks</h3>
                <p className="text-muted-foreground">
                  Klasik çizgiyi modern konforla birleştiren, her detayıyla ayrıcalık hissi veren mobilyalar üretmek.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <ShieldCheck className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Güvenli ve Dayanıklı</h3>
                <p className="text-muted-foreground">
                  Sağlam malzeme ve titiz işçilikle güvenli, uzun ömürlü ve aileler için konforlu yaşam alanları oluşturmak.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Leaf className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sürdürülebilir Zarafet</h3>
                <p className="text-muted-foreground">
                  Sorumlu tedarik ve çevre duyarlılığı ile lüksün doğayla uyumlu olabileceğini göstermek.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">Vizyonumuz</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Sparkles className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Zamansız İmza</h3>
                <p className="text-muted-foreground">
                  Klasik estetikte modern bir yorumla, dünyada zamansız ve güçlü bir marka izi bırakmak.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Crown className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ustalık Mirası</h3>
                <p className="text-muted-foreground">
                  Nesiller boyu değerini koruyan, güvenle tercih edilen bir ustalık mirası inşa etmek.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/80 shadow-lg border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Leaf className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sorumlu Lüks</h3>
                <p className="text-muted-foreground">
                  Sürdürülebilir üretimi lüksle buluşturarak sektör için kalıcı ve ilham veren bir standart oluşturmak.
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
