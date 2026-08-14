import popeyesLogo from '../../assets/popeyes-logo.png';
import burgerKingLogo from '../../assets/burger-king-logo.png';
import walletLogo from '../../assets/Wallet2.png';
import popeyesCampaignBanner from '../../assets/popeyes-campaign-banner.png';
import { formatCouponDate } from './couponUtils';

export type CampaignDiscount =
  | { kind: 'percentage'; percent: number; targetProductName?: string }
  | { kind: 'fixedAmount'; amount: number; minSpend?: number; targetProductName?: string }
  | { kind: 'secondItemDiscount'; percent: number; targetProductName?: string };

export interface CampaignFaqItem {
  question: string;
  answer: string;
}

export interface CampaignItem {
  id: string;
  title: string;
  headline: string;
  subheadline?: string;
  restaurantId?: string;
  restaurantTitle: string;
  logo?: string;
  gradient: string;
  tags: string[];
  description?: string;
  validFrom?: string;
  validUntil?: string;
  discount?: CampaignDiscount;
  bannerImage?: string;
  faq?: CampaignFaqItem[];
}

const CHANNEL_TAGS = ['Sana Gelsin', 'Gel Al', 'Restoranda QR'];

const buildGenericFaq = (campaign: CampaignItem): CampaignFaqItem[] => {
  const channels = campaign.tags.filter((tag) => CHANNEL_TAGS.includes(tag));
  const validity =
    campaign.validFrom && campaign.validUntil
      ? `${formatCouponDate(campaign.validFrom)} - ${formatCouponDate(campaign.validUntil)} tarihleri arasında`
      : campaign.validUntil
        ? `${formatCouponDate(campaign.validUntil)} tarihine kadar`
        : 'kampanya süresince';

  return [
    {
      question: 'Kampanya hangi kanallarda geçerlidir?',
      answer: channels.length
        ? `Kampanya mobil uygulama üzerinden ${channels.join(' ve ')} kanalından yapılacak alışverişlerinde geçerlidir.`
        : 'Kampanya mobil uygulama üzerinden yapılacak alışverişlerde geçerlidir.',
    },
    {
      question: 'Kampanya hangi markalarda geçerlidir?',
      answer: `Kampanya sadece ${campaign.restaurantTitle} markasında geçerlidir.`,
    },
    {
      question: 'Kampanya şartları nelerdir?',
      answer: `${campaign.description ?? campaign.title} Kampanya ${validity} geçerlidir. Kampanya devam eden diğer kampanyalar ve kampanyalı ürünlerle birleştirilemez.`,
    },
    {
      question: 'Kampanya diğer açıklamaları',
      answer: `Kampanya başka promosyonlar, indirimler ve kampanyalarla birleştirilemez. ${campaign.restaurantTitle}'in önceden haber vermeden fiyatlarda değişiklik yapma ve kampanyayı durdurma hakkı saklıdır. Tıkla Gelsin® markası ve amblemi̇ni̇n tek hak sahibidir.`,
    },
  ];
};

export const getCampaignFaq = (campaign: CampaignItem): CampaignFaqItem[] => campaign.faq ?? buildGenericFaq(campaign);

export const CAMPAIGNS: CampaignItem[] = [
  {
    id: 'popeyes-sandwich',
    title: 'Chicken Sandwich Menü Alana, İkincisi Hediye',
    headline: '2. Sandviç',
    subheadline: 'Hediye!',
    restaurantId: 'Popeyes',
    restaurantTitle: 'Popeyes',
    logo: popeyesLogo,
    gradient: 'from-[#7a1220] to-[#E91D34]',
    tags: ['Sana Gelsin', 'Son 3 Gün'],
    description: "Popeyes Chicken Sandwich Menü'nden 2 adet alana ikincisi ücretsiz!",
    validFrom: '2026-08-01',
    validUntil: '2026-09-15',
    discount: { kind: 'secondItemDiscount', percent: 100, targetProductName: 'Popeyes Chicken Sandwich Menü' },
    bannerImage: popeyesCampaignBanner,
  },
  {
    id: 'burgerking-whopper',
    title: 'Whopper Menüde %20 İndirim',
    headline: '%20',
    subheadline: 'İndirim',
    restaurantId: 'BurgerKing',
    restaurantTitle: 'Burger King',
    logo: burgerKingLogo,
    gradient: 'from-[#3a2a12] to-[#8a5a1c]',
    tags: ['Sana Gelsin', 'Gel Al'],
    description: 'Whopper Menü siparişlerinde %20 indirim fırsatı.',
    validFrom: '2026-08-01',
    validUntil: '2026-09-30',
    discount: { kind: 'percentage', percent: 20, targetProductName: 'Whopper Menü' },
  },
  {
    id: 'amasya-et',
    title: '150 TL Üzeri Siparişe 30 TL İndirim',
    headline: '30 TL',
    subheadline: 'İndirim',
    restaurantId: 'AmasyaEtUrunleri',
    restaurantTitle: 'Amasya Et Ürünleri',
    gradient: 'from-[#5c1010] to-[#c0392b]',
    tags: ['Sana Gelsin'],
    description: '150 TL ve üzeri siparişlerde 30 TL indirim fırsatı.',
    validFrom: '2026-08-01',
    validUntil: '2026-09-30',
    discount: { kind: 'fixedAmount', amount: 30, minSpend: 150 },
  },
  {
    id: 'sut-kahvalti',
    title: 'Kahvaltı Tabağına Çay Hediye',
    headline: 'Çay',
    subheadline: 'Hediye!',
    restaurantId: 'SutKahvaltiEvi',
    restaurantTitle: 'Süt Kahvaltı Evi',
    gradient: 'from-[#8a6d1c] to-[#d4a017]',
    tags: ['Gel Al'],
    description: 'Serpme Kahvaltı Tabağı siparişlerinde çay ücretsiz!',
    validFrom: '2026-08-01',
    validUntil: '2026-09-30',
    discount: { kind: 'fixedAmount', amount: 25, targetProductName: 'Serpme Kahvaltı Tabağı (2 Kişilik)' },
  },
  {
    id: 'ogrenci-indirimi',
    title: 'Öğrenciye Lezzetli İndirim!',
    headline: 'Öğrenci olmanın',
    subheadline: 'avantajını yaşa! 100 TL indirim',
    restaurantTitle: 'Tıkla Gelsin',
    gradient: 'from-[#0f3d5c] to-[#1a7ac2]',
    tags: ['Sana Gelsin'],
    description: 'Öğrenci belgeni doğrula, tüm siparişlerinde geçerli avantajlardan yararlan.',
  },
  {
    id: 'tiklapay-iade',
    title: "Tıklapay Cüzdanına Özel %10 İade",
    headline: '%10',
    subheadline: 'İade',
    restaurantTitle: 'Tıklapay',
    logo: walletLogo,
    gradient: 'from-[#4a0f14] to-[#E91D34]',
    tags: ['Sana Gelsin', 'Gel Al'],
    description: 'Tıklapay Cüzdanı ile ödediğin siparişlerde %10 iade kazan.',
  },
];
