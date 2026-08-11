import type { CartItem, CouponDetail } from '../../store/useStore';

const roundToCents = (value: number): number => Math.round(value * 100) / 100;

export const formatCouponPrice = (price: number): string =>
  `${price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;

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

export const getCouponUnavailabilityReason = (coupon: CouponDetail, cartItems: CartItem[]): string | null => {
  const { discount } = coupon;

  if (discount.kind === 'fixedAmount' && discount.minSpend) {
    const cartTotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    if (cartTotal < discount.minSpend) {
      return `Sepet tutarın en az ${formatCouponPrice(discount.minSpend)} olmalı.`;
    }
  }

  if (discount.kind === 'percentage' || discount.kind === 'fixedAmount') {
    if (discount.targetProductName && getMatchingUnitPrices(cartItems, discount.targetProductName).length === 0) {
      return `Bu kupon yalnızca ${discount.targetProductName} için geçerli.`;
    }
    return null;
  }

  // secondItemDiscount
  const matchingUnits = getMatchingUnitPrices(cartItems, discount.targetProductName);
  if (discount.targetProductName && matchingUnits.length === 0) {
    return `Bu kupon yalnızca ${discount.targetProductName} için geçerli.`;
  }
  if (matchingUnits.length < 2) {
    return discount.targetProductName
      ? `Bu kuponu kullanmak için sepetinde en az 2 adet ${discount.targetProductName} olmalı.`
      : 'Sepetinde en az 2 ürün olmalı.';
  }
  return null;
};

export const calculateCouponDiscount = (coupon: CouponDetail, cartItems: CartItem[]): number => {
  if (getCouponUnavailabilityReason(coupon, cartItems)) return 0;

  const { discount } = coupon;

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

export const formatCouponDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatCouponDateShort = (iso: string): string => {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
};

export const getDaysRemaining = (iso: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};
