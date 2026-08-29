import type { CouponDetail, OrderDiscountLine } from '../store/useStore';
import type { CampaignItem } from '../Components/Campaigns/campaignsData';

export enum PaymentMethod {
  Wallet = 'wallet',
  TiklaPara = 'tiklapara',
  Card = 'card',
  Pluxee = 'pluxee',
  SetCard = 'setcard',
  Multinet = 'multinet',
  Vodafone = 'vodafone',
  Turkcell = 'turkcell',
  Cash = 'cash',
  CreditCard = 'creditCard',
}

export const buildOrderDiscountLines = ({
  autoCampaign,
  campaignDiscountAmount,
  isSelectedCouponApplicable,
  selectedCoupon,
  discountAmount,
}: {
  autoCampaign?: CampaignItem;
  campaignDiscountAmount: number;
  isSelectedCouponApplicable: boolean;
  selectedCoupon?: CouponDetail;
  discountAmount: number;
}): OrderDiscountLine[] => [
  ...(autoCampaign && campaignDiscountAmount > 0 ? [{ label: autoCampaign.title, amount: campaignDiscountAmount }] : []),
  ...(isSelectedCouponApplicable && selectedCoupon && discountAmount > 0
    ? [{ label: selectedCoupon.title, amount: discountAmount }]
    : []),
];

export type SplitPaymentLegType = 'tiklapara' | 'wallet' | 'other';

export interface SplitPaymentLeg {
  type: SplitPaymentLegType;
  amount: number;
}

const roundToCents = (value: number): number => Math.round(value * 100) / 100;

/**
 * Öncelik sırası: TıklaPara -> TıklaPay -> diğer ödeme yöntemleri.
 * Her bacak, bir öncekinin karşılayamadığı kalan tutarı üstlenir.
 */
export const computeSplitPaymentLegs = ({
  tiklaParaBalance,
  walletBalance,
  totalAmount,
}: {
  tiklaParaBalance: number;
  walletBalance: number;
  totalAmount: number;
}): SplitPaymentLeg[] => {
  const legs: SplitPaymentLeg[] = [];
  let remaining = roundToCents(totalAmount);

  const tiklaParaAmount = roundToCents(Math.min(tiklaParaBalance, remaining));
  if (tiklaParaAmount > 0) {
    legs.push({ type: 'tiklapara', amount: tiklaParaAmount });
    remaining = roundToCents(remaining - tiklaParaAmount);
  }

  if (remaining > 0) {
    const walletAmount = roundToCents(Math.min(walletBalance, remaining));
    if (walletAmount > 0) {
      legs.push({ type: 'wallet', amount: walletAmount });
      remaining = roundToCents(remaining - walletAmount);
    }
  }

  if (remaining > 0) {
    legs.push({ type: 'other', amount: remaining });
  }

  return legs;
};

export const isSplitPaymentActive = (legs: SplitPaymentLeg[]): boolean => legs.length >= 2;

export const getPaymentMethodLabel = ({
  paymentMethod,
  selectedFoodCardConfig,
  selectedMobilePaymentConfig,
  selectedCashOnDeliveryConfig,
}: {
  paymentMethod: PaymentMethod;
  selectedFoodCardConfig?: { displayName: string };
  selectedMobilePaymentConfig?: { displayName: string };
  selectedCashOnDeliveryConfig?: { displayName: string };
}): string =>
  paymentMethod === PaymentMethod.Wallet
    ? 'Tıklapay Cüzdanım'
    : paymentMethod === PaymentMethod.TiklaPara
      ? 'Tıkla Param'
      : paymentMethod === PaymentMethod.Pluxee
      ? 'Pluxee (Sodexo) Online'
      : (selectedFoodCardConfig?.displayName ??
        selectedMobilePaymentConfig?.displayName ??
        selectedCashOnDeliveryConfig?.displayName ??
        'Kredi / Banka Kartı Online');
