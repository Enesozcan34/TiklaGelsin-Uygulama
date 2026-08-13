import popeyesLogo from '../../assets/popeyes-logo.png';
import burgerKingLogo from '../../assets/burger-king-logo.png';
import walletLogo from '../../assets/Wallet2.png';

export interface CampaignItem {
  id: string;
  title: string;
  headline: string;
  subheadline?: string;
  restaurantTitle: string;
  logo?: string;
  gradient: string;
  tags: string[];
}

export const CAMPAIGNS: CampaignItem[] = [
  {
    id: 'popeyes-sandwich',
    title: 'Chicken Sandwich Menü Alana, İkincisi Hediye',
    headline: '2. Sandviç',
    subheadline: 'Hediye!',
    restaurantTitle: 'Popeyes',
    logo: popeyesLogo,
    gradient: 'from-[#7a1220] to-[#E30A17]',
    tags: ['Sana Gelsin', 'Son 3 Gün'],
  },
  {
    id: 'burgerking-whopper',
    title: 'Whopper Menüde %20 İndirim',
    headline: '%20',
    subheadline: 'İndirim',
    restaurantTitle: 'Burger King',
    logo: burgerKingLogo,
    gradient: 'from-[#3a2a12] to-[#8a5a1c]',
    tags: ['Sana Gelsin', 'Gel Al'],
  },
  {
    id: 'amasya-et',
    title: '150 TL Üzeri Siparişe 30 TL İndirim',
    headline: '30 TL',
    subheadline: 'İndirim',
    restaurantTitle: 'Amasya Et Ürünleri',
    gradient: 'from-[#5c1010] to-[#c0392b]',
    tags: ['Sana Gelsin'],
  },
  {
    id: 'sut-kahvalti',
    title: 'Kahvaltı Tabağına Çay Hediye',
    headline: 'Çay',
    subheadline: 'Hediye!',
    restaurantTitle: 'Süt Kahvaltı Evi',
    gradient: 'from-[#8a6d1c] to-[#d4a017]',
    tags: ['Gel Al'],
  },
  {
    id: 'ogrenci-indirimi',
    title: 'Öğrenciye Lezzetli İndirim!',
    headline: 'Öğrenci olmanın',
    subheadline: 'avantajını yaşa! 100 TL indirim',
    restaurantTitle: 'Tıkla Gelsin',
    gradient: 'from-[#0f3d5c] to-[#1a7ac2]',
    tags: ['Sana Gelsin'],
  },
  {
    id: 'tiklapay-iade',
    title: "Tıklapay Cüzdanına Özel %10 İade",
    headline: '%10',
    subheadline: 'İade',
    restaurantTitle: 'Tıklapay',
    logo: walletLogo,
    gradient: 'from-[#4a0f14] to-[#E30A17]',
    tags: ['Sana Gelsin', 'Gel Al'],
  },
];
