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
