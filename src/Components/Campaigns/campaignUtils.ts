import type { CartItem } from '../../store/useStore';
import type { CampaignItem } from './campaignsData';

const roundToCents = (value: number): number => Math.round(value * 100) / 100;

const getMatchingUnitPrices = (cartItems: CartItem[], targetProductName?: string): number[] => {
  const relevantItems = targetProductName
    ? cartItems.filter((item) => item.productName === targetProductName)
    : cartItems;
  const unitPrices: number[] = [];
  relevantItems.forEach((item) => {
    for (let i = 0; i < item.quantity; i += 1) unitPrices.push(item.unitPrice);
  });
  return unitPrices;
};

export const getCampaignUnavailabilityReason = (campaign: CampaignItem, cartItems: CartItem[]): string | null => {
  const { discount } = campaign;
  if (!discount) return 'Bu kampanya bir indirim tanımı içermiyor.';

  if (discount.kind === 'fixedAmount' && discount.minSpend) {
    const cartTotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    if (cartTotal < discount.minSpend) {
      return `Sepet tutarın en az ${discount.minSpend.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL olmalı.`;
    }
  }

  if (discount.kind === 'percentage' || discount.kind === 'fixedAmount') {
    if (discount.targetProductName && getMatchingUnitPrices(cartItems, discount.targetProductName).length === 0) {
      return `Bu kampanya yalnızca ${discount.targetProductName} için geçerli.`;
    }
    return null;
  }

  // secondItemDiscount
  const matchingUnits = getMatchingUnitPrices(cartItems, discount.targetProductName);
  if (discount.targetProductName && matchingUnits.length === 0) {
    return `Bu kampanya yalnızca ${discount.targetProductName} için geçerli.`;
  }
  if (matchingUnits.length < 2) {
    return discount.targetProductName
      ? `Bu kampanyadan faydalanmak için sepetinde en az 2 adet ${discount.targetProductName} olmalı.`
      : 'Sepetinde en az 2 ürün olmalı.';
  }
  return null;
};

export const calculateCampaignDiscount = (campaign: CampaignItem, cartItems: CartItem[]): number => {
  if (getCampaignUnavailabilityReason(campaign, cartItems)) return 0;

  const { discount } = campaign;
  if (!discount) return 0;

  if (discount.kind === 'percentage') {
    const baseAmount = discount.targetProductName
      ? getMatchingUnitPrices(cartItems, discount.targetProductName).reduce((sum, price) => sum + price, 0)
      : cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    return roundToCents((baseAmount * discount.percent) / 100);
  }

  if (discount.kind === 'fixedAmount') {
    const cartTotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    return Math.min(discount.amount, cartTotal);
  }

  const unitPrices = getMatchingUnitPrices(cartItems, discount.targetProductName).sort((a, b) => b - a);
  const secondUnitPrice = unitPrices[1] ?? 0;
  return roundToCents((secondUnitPrice * discount.percent) / 100);
};
