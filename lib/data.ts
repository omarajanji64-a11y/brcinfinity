import { type Language } from '@/lib/i18n';

type LocalizedString = {
  [key in Language | 'en']: string;
}

export type Product = {
  id: string;
  name: LocalizedString;
  category: LocalizedString;
  style: 'Modern' | 'Classic';
  shortDescription: LocalizedString;
  description: LocalizedString;
  price: number;
  stock: number;
  imageUrl: string;
};

// This data is kept only as a local fallback seed.
const allProducts: Product[] = [
  {
    id: '1',
    name: {
      en: 'Gilded Mahogany Armchair',
      fr: 'Fauteuil en acajou doré',
      tr: 'Yaldızlı Maun Koltuk',
    },
    category: { en: 'Living Room', fr: 'Salon', tr: 'Oturma Odası' },
    style: 'Classic',
    shortDescription: {
      en: 'An opulent armchair with gold leaf accents.',
      fr: 'Un fauteuil opulent avec des accents de feuille d\'or.',
      tr: 'Altın varak vurgulu gösterişli bir koltuk.',
    },
    description: {
      en: 'An ornate, hand-carved mahogany armchair, upholstered in plush velvet with gilded gold leaf accents. Perfect for adding a regal touch to any living space.',
      fr: 'Un fauteuil en acajou sculpté à la main, orné, tapissé de velours moelleux avec des accents de feuille d\'or dorée. Parfait pour ajouter une touche royale à tout espace de vie.',
      tr: 'Süslü, el oyması maun bir koltuk, peluş kadife döşemeli ve yaldızlı altın varak vurgularıyla. Herhangi bir yaşam alanına kraliyet dokunuşu katmak için mükemmel.',
    },
    price: 2500,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1767050321604-a2654be8fad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjbGFzc2ljJTIwYXJtY2hhaXJ8ZW58MHx8fHwxNzY3NDQxNTczfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '2',
    name: {
      en: 'Imperial Four-Poster Bed',
      fr: 'Lit à baldaquin impérial',
      tr: 'İmparatorluk Karyolası',
    },
    category: { en: 'Bedroom', fr: 'Chambre', tr: 'Yatak Odası' },
    style: 'Classic',
    shortDescription: {
        en: 'A grandiose bed fit for royalty.',
        fr: 'Un lit grandiose digne de la royauté.',
        tr: 'Kraliyete layık görkemli bir yatak.',
    },
    description: {
      en: 'A majestic four-poster bed made from solid oak, featuring intricate carvings and draped with the finest silk curtains. Transform your bedroom into a palatial sanctuary.',
      fr: 'Un majestueux lit à baldaquin en chêne massif, avec des sculptures complexes et drapé des plus fins rideaux de soie. Transformez votre chambre en un sanctuaire palatial.',
      tr: 'Masif meşeden yapılmış, karmaşık oymalara sahip ve en iyi ipek perdelerle süslenmiş görkemli bir dört direkli yatak. Yatak odanızı saray gibi bir sığınağa dönüştürün.',
    },
    price: 7800,
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1668435528344-b70cedd6df88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxyb3lhbCUyMGJlZHxlbnwwfHx8fDE3Njc1MzQxODF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
];

export function getInitialProducts(lang: Language): Product[] {
    return allProducts;
}

export const websiteTrafficData = [
  { month: 'Jan', visits: 4103 },
  { month: 'Feb', visits: 3890 },
  { month: 'Mar', visits: 5021 },
  { month: 'Apr', visits: 4867 },
  { month: 'May', visits: 6312 },
  { month: 'Jun', visits: 6104 },
];

type SalesData = {
    category: string;
    sales: number;
}
export const salesData = (lang: Language): SalesData[] => {
    if (lang === 'fr') {
        return [
          { category: 'Salon', sales: 40000 },
          { category: 'Chambre', sales: 32000 },
          { category: 'Salle à manger', sales: 51000 },
        ];
    }
    if (lang === 'tr') {
        return [
          { category: 'Oturma Odası', sales: 40000 },
          { category: 'Yatak Odası', sales: 32000 },
          { category: 'Yemek Odası', sales: 51000 },
        ];
    }
    return [
      { category: 'Living Room', sales: 40000 },
      { category: 'Bedroom', sales: 32000 },
      { category: 'Dining', sales: 51000 },
    ];
};

export const engagementData = [
    { month: 'Jan', engagement: 68.2 },
    { month: 'Feb', engagement: 70.1 },
    { month: 'Mar', engagement: 69.5 },
    { month: 'Apr', engagement: 71.3 },
    { month: 'May', engagement: 72.8 },
    { month: 'Jun', engagement: 73.5 },
  ];
