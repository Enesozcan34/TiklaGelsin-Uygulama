import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IconType } from 'react-icons';
import { FaArrowRight, FaCheck, FaChevronDown, FaCreditCard, FaHouse, FaMoneyBillWave, FaStar } from 'react-icons/fa6';
import useStore, { ALL_COUPONS, PLUXEE_VERIFICATION_CODE_BY_USER, type OrderDiscountLine } from '../store/useStore';
import { getRestaurantById } from '../data/restaurants';
import PaymentMethodModal from '../Components/PaymentMethodModal/PaymentMethodModal';
import PluxeeVerifyModal from '../Components/PluxeeVerifyModal/PluxeeVerifyModal';
import FoodCardVerifyModal from '../Components/FoodCardVerifyModal/FoodCardVerifyModal';
import MobilePaymentVerifyModal from '../Components/MobilePaymentVerifyModal/MobilePaymentVerifyModal';
import OrderConfirmationModal from '../Components/OrderConfirmationModal/OrderConfirmationModal';
import CouponPickerModal from '../Components/Campaigns/CouponPickerModal';
import { calculateCouponDiscount, getCouponUnavailabilityReason } from '../Components/Campaigns/couponUtils';
import { CAMPAIGNS } from '../Components/Campaigns/campaignsData';
import { calculateCampaignDiscount, getCampaignUnavailabilityReason } from '../Components/Campaigns/campaignUtils';
import {
  buildOrderDiscountLines,
  computeSplitPaymentLegs,
  getPaymentMethodLabel,
  isSplitPaymentActive,
  PaymentMethod,
  type SplitPaymentLeg,
} from './checkoutUtils';
import walletLogo from '../assets/Wallet2.png';

const formatPrice = (price: number): string => `${price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;
const formatTp = (value: number): string => `${value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TP`;
const maskFoodCardNumber = (digits: string): string => `${digits.slice(0, 4)}${'*'.repeat(digits.length - 6)}${digits.slice(-2)}`;
const maskPhoneNumber = (digits: string): string => `${digits.slice(0, 3)} *** ** ${digits.slice(-2)}`;

/** Kart limiti kontrolüne ihtiyaç duymayan, seçilir seçilmez ödemeyi karşılayan yöntemler. */
const isInstantChargeMethod = (paymentMethod: PaymentMethod): boolean =>
  paymentMethod === PaymentMethod.Pluxee ||
  paymentMethod === PaymentMethod.SetCard ||
  paymentMethod === PaymentMethod.Multinet ||
  paymentMethod === PaymentMethod.Vodafone ||
  paymentMethod === PaymentMethod.Turkcell ||
  paymentMethod === PaymentMethod.Cash ||
  paymentMethod === PaymentMethod.CreditCard;

type FoodCardId = PaymentMethod.SetCard | PaymentMethod.Multinet;
type MobilePaymentId = PaymentMethod.Vodafone | PaymentMethod.Turkcell;
type CashOnDeliveryId = PaymentMethod.Cash | PaymentMethod.CreditCard;

interface MobilePaymentConfig {
  title: string;
  heading: string;
  description: string;
  displayName: string;
  initial: string;
  color: string;
}

const MOBILE_PAYMENT_CONFIG: Record<MobilePaymentId, MobilePaymentConfig> = {
  [PaymentMethod.Vodafone]: {
    title: 'Vodafone Pay ile Faturana Yansıt',
    heading: 'Vodafone Pay telefon numaranı gir',
    description:
      'Bu servis sadece Vodafone Pay abonelerine açıktır. Vodafone Pay hattına ait bir cep telefon numarası girin.',
    displayName: 'Vodafone Pay ile Faturana Yansıt',
    initial: 'V',
    color: '#E60000',
  },
  [PaymentMethod.Turkcell]: {
    title: 'Turkcell Faturana Yansıt',
    heading: 'Turkcell telefon numaranı gir',
    description: 'Bu servis sadece Turkcell abonelerine açıktır. Turkcell hattına ait bir cep telefon numarası girin.',
    displayName: 'Turkcell Faturana Yansıt',
    initial: 'T',
    color: '#FFC20E',
  },
};

interface FoodCardConfig {
  brandName: string;
  displayName: string;
  logoLabel: string;
  logoColor: string;
  initial: string;
}

const FOOD_CARD_CONFIG: Record<FoodCardId, FoodCardConfig> = {
  [PaymentMethod.SetCard]: {
    brandName: 'Setcard',
    displayName: 'Setcard Online',
    logoLabel: 'SETCARD',
    logoColor: '#00A9A5',
    initial: 'S',
  },
  [PaymentMethod.Multinet]: {
    brandName: 'Multinet Card',
    displayName: 'Multinet Card Online',
    logoLabel: 'MULTINET',
    logoColor: '#22A559',
    initial: 'M',
  },
};

interface CashOnDeliveryConfig {
  displayName: string;
  icon: IconType;
}

const CASH_ON_DELIVERY_CONFIG: Record<CashOnDeliveryId, CashOnDeliveryConfig> = {
  [PaymentMethod.Cash]: { displayName: 'Kapıda Ödeme (Nakit)', icon: FaMoneyBillWave },
  [PaymentMethod.CreditCard]: { displayName: 'Kapıda Ödeme (Kredi Kartı)', icon: FaCreditCard },
};
type DeliveryTiming = 'now' | 'later';
type DeliveryDate = '' | 'today' | 'tomorrow';
type DropdownField = 'date' | 'time' | null;

interface DropdownOption {
  value: string;
  label: string;
}

const generateTimeSlots = (openingHour: string, closingHour: string): string[] => {
  const [openH, openM] = openingHour.split(':').map(Number);
  const [closeH, closeM] = closingHour.split(':').map(Number);
  const start = openH * 60 + openM;
  const end = closeH * 60 + closeM;
  const slots: string[] = [];
  for (let minutes = start; minutes <= end; minutes += 15) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    slots.push(`${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`);
  }
  return slots;
};

const LabeledDropdown = ({
  label,
  valueLabel,
  isOpen,
  disabled,
  onToggle,
  options,
  onSelect,
}: {
  label: string;
  valueLabel: string;
  isOpen: boolean;
  disabled?: boolean;
  onToggle: () => void;
  options: DropdownOption[];
  onSelect: (value: string) => void;
}) => (
  <div className="relative flex-1">
    <span
      className={`absolute left-4 top-0 -translate-y-1/2 bg-white px-1 text-[11px] ${
        disabled ? 'text-gray-300' : 'text-gray-500'
      }`}
    >
      {label}
    </span>
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={`w-full flex items-center justify-between border rounded-full pl-5 pr-4 pt-4 pb-2.5 text-sm transition-colors ${
        disabled ? 'border-gray-200 bg-gray-100 cursor-not-allowed' : 'border-gray-200 text-gray-700 hover:border-gray-300'
      }`}
    >
      <span className={valueLabel ? 'text-gray-700' : 'text-gray-300'}>{valueLabel || label}</span>
      <FaChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>

    {isOpen && !disabled && (
      <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl border border-gray-100 max-h-56 overflow-y-auto py-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className="w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {option.label}
          </button>
        ))}
      </div>
    )}
  </div>
);

const CheckboxOption = ({
  title,
  description,
  checked,
  onToggle,
}: {
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) => (
  <button type="button" onClick={onToggle} className="flex items-start gap-3 text-left">
    <span
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
        checked ? 'bg-[#E91D34] border-[#E91D34]' : 'border-gray-300'
      }`}
    >
      {checked && <FaCheck className="w-2.5 h-2.5 text-white" />}
    </span>
    <div>
      <p className="text-sm text-gray-800">{title}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  </button>
);

const DATE_OPTIONS: DropdownOption[] = [
  { value: 'today', label: 'Bugün' },
  { value: 'tomorrow', label: 'Yarın' },
];

const CheckoutPage = () => {
  const [deliveryTiming, setDeliveryTiming] = useState<DeliveryTiming>('now');
  const [deliveryDate, setDeliveryDate] = useState<DeliveryDate>('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [openDropdown, setOpenDropdown] = useState<DropdownField>(null);
  const [contactlessDelivery, setContactlessDelivery] = useState(false);
  const [noDoorbell, setNoDoorbell] = useState(false);
  const [noCutlery, setNoCutlery] = useState(true);
  const navigate = useNavigate();
  const [paymentError, setPaymentError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Card);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPluxeeVerifyModal, setShowPluxeeVerifyModal] = useState(false);
  const [showOrderConfirmModal, setShowOrderConfirmModal] = useState(false);
  const [verifyingFoodCard, setVerifyingFoodCard] = useState<FoodCardId | null>(null);
  const [foodCardNumber, setFoodCardNumber] = useState('');
  const [verifyingMobilePayment, setVerifyingMobilePayment] = useState<MobilePaymentId | null>(null);
  const [mobilePaymentPhone, setMobilePaymentPhone] = useState('');
  const [showCouponPicker, setShowCouponPicker] = useState(false);
  const [selectedCouponCode, setSelectedCouponCode] = useState<string | null>(null);
  const {
    cartItems,
    addresses,
    selectedAddressId,
    userName,
    savedCardsByUser,
    selectedCardIdByUser,
    walletBalanceByUser,
    tiklaParaBalanceByUser,
    profilesByUser,
    placeOrder,
    clearCart,
    chargeCard,
    chargeWallet,
    chargeTiklaPara,
    selectSavedCard,
    getCouponUsesRemaining,
    useCouponUnit,
    pendingCouponCode,
    setPendingCouponCode,
  } = useStore();

  // Kupon detay sayfasındaki "Kuponu Uygula" akışıyla gelinmişse kuponu otomatik seçili getir.
  useEffect(() => {
    if (pendingCouponCode) {
      setSelectedCouponCode(pendingCouponCode);
      setPendingCouponCode(null);
    }
  }, [pendingCouponCode, setPendingCouponCode]);
  const savedCards = userName ? savedCardsByUser[userName] ?? [] : [];
  const selectedCard = userName
    ? savedCards.find((card) => card.id === selectedCardIdByUser[userName])
    : undefined;
  const walletBalance = userName ? walletBalanceByUser[userName] ?? 0 : 0;
  const tiklaParaBalance = userName ? tiklaParaBalanceByUser[userName] ?? 0 : 0;
  const userPhone = userName ? profilesByUser[userName]?.phone ?? '' : '';
  const expectedPluxeeCode = userName ? PLUXEE_VERIFICATION_CODE_BY_USER[userName] ?? '' : '';
  const selectedFoodCardConfig =
    paymentMethod === PaymentMethod.SetCard || paymentMethod === PaymentMethod.Multinet
      ? FOOD_CARD_CONFIG[paymentMethod]
      : undefined;
  const selectedMobilePaymentConfig =
    paymentMethod === PaymentMethod.Vodafone || paymentMethod === PaymentMethod.Turkcell
      ? MOBILE_PAYMENT_CONFIG[paymentMethod]
      : undefined;
  const selectedCashOnDeliveryConfig =
    paymentMethod === PaymentMethod.Cash || paymentMethod === PaymentMethod.CreditCard
      ? CASH_ON_DELIVERY_CONFIG[paymentMethod]
      : undefined;
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? addresses[0];
  const restaurant = cartItems.length > 0 ? getRestaurantById(cartItems[0].restaurantId) : undefined;
  const branchName = restaurant?.locations.find((location) => location.addressId === selectedAddressId)?.branchName;
  const selectedCoupon = selectedCouponCode ? ALL_COUPONS.find((coupon) => coupon.code === selectedCouponCode) : undefined;
  const selectedCouponUsesRemaining = selectedCoupon ? getCouponUsesRemaining(selectedCoupon.code) : 0;
  const isSelectedCouponApplicable = Boolean(
    selectedCoupon &&
      restaurant &&
      selectedCoupon.restaurantId === restaurant.id &&
      !getCouponUnavailabilityReason(selectedCoupon, cartItems, selectedCouponUsesRemaining),
  );
  const discountAmount =
    isSelectedCouponApplicable && selectedCoupon
      ? calculateCouponDiscount(selectedCoupon, cartItems, selectedCouponUsesRemaining)
      : 0;
  const autoCampaign = restaurant
    ? CAMPAIGNS.find((campaign) => campaign.restaurantId === restaurant.id && campaign.discount && !getCampaignUnavailabilityReason(campaign, cartItems))
    : undefined;
  const campaignDiscountAmount = autoCampaign ? calculateCampaignDiscount(autoCampaign, cartItems) : 0;
  const orderDiscountLines: OrderDiscountLine[] = buildOrderDiscountLines({
    autoCampaign,
    campaignDiscountAmount,
    isSelectedCouponApplicable,
    selectedCoupon,
    discountAmount,
  });
  const paymentMethodLabel = getPaymentMethodLabel({
    paymentMethod,
    selectedFoodCardConfig,
    selectedMobilePaymentConfig,
    selectedCashOnDeliveryConfig,
  });
  const cartTotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountedCartTotal = Math.max(0, cartTotal - discountAmount - campaignDiscountAmount);
  const totalAmount = discountedCartTotal + (restaurant?.serviceFee ?? 0);
  const timeOptions: DropdownOption[] = restaurant
    ? generateTimeSlots(restaurant.openingHour, restaurant.closingHour).map((slot) => ({ value: slot, label: slot }))
    : [];
  const hasValidDeliveryTime = deliveryTiming === 'now' || (deliveryDate !== '' && deliveryTime !== '');

  // Restoran bazlı parçalı ödeme: TıklaPara -> TıklaPay -> diğer ödeme yöntemleri önceliğiyle bacaklara bölünür.
  const isSplitPaymentEligible = Boolean(restaurant?.isSplitPaymentEnabled);
  const splitLegs: SplitPaymentLeg[] = useMemo(
    () =>
      isSplitPaymentEligible
        ? computeSplitPaymentLegs({ tiklaParaBalance, walletBalance, totalAmount })
        : [],
    [isSplitPaymentEligible, tiklaParaBalance, walletBalance, totalAmount],
  );
  const isSplitActive = isSplitPaymentEligible && isSplitPaymentActive(splitLegs);
  const singleAutoLeg =
    isSplitPaymentEligible && splitLegs.length === 1 && splitLegs[0].type !== 'other' ? splitLegs[0] : undefined;
  const otherLegAmount = splitLegs.find((leg) => leg.type === 'other')?.amount ?? 0;

  // Tek bacak (TıklaPara ya da TıklaPay) tüm tutarı karşılıyorsa o yöntemi otomatik seç.
  useEffect(() => {
    if (!singleAutoLeg) return;
    const autoMethod = singleAutoLeg.type === 'tiklapara' ? PaymentMethod.TiklaPara : PaymentMethod.Wallet;
    setPaymentMethod((prev) => (prev === autoMethod ? prev : autoMethod));
  }, [singleAutoLeg]);

  const isOtherMethodSufficient = (amount: number): boolean =>
    isInstantChargeMethod(paymentMethod) ? true : Boolean(selectedCard) && (selectedCard?.balance ?? 0) >= amount;

  const hasSufficientBalance = isSplitActive
    ? otherLegAmount === 0 || isOtherMethodSufficient(otherLegAmount)
    : paymentMethod === PaymentMethod.Wallet
      ? walletBalance >= totalAmount
      : paymentMethod === PaymentMethod.TiklaPara
        ? tiklaParaBalance >= totalAmount
        : isOtherMethodSufficient(totalAmount);
  const canPlaceOrder = cartItems.length > 0 && hasSufficientBalance && hasValidDeliveryTime;

  const handleSelectWallet = () => {
    setPaymentMethod((prev) => (prev === PaymentMethod.Wallet ? PaymentMethod.Card : PaymentMethod.Wallet));
  };

  const handleSelectTiklaPara = () => {
    setPaymentMethod((prev) => (prev === PaymentMethod.TiklaPara ? PaymentMethod.Card : PaymentMethod.TiklaPara));
  };

  const handleSelectCard = (cardId: string) => {
    selectSavedCard(cardId);
    setPaymentMethod(PaymentMethod.Card);
    setShowPaymentModal(false);
  };

  const handleSelectPluxee = () => {
    setPaymentMethod(PaymentMethod.Pluxee);
    setShowPaymentModal(false);
  };

  const handleSelectFoodCard = (cardId: FoodCardId) => {
    setShowPaymentModal(false);
    setVerifyingFoodCard(cardId);
  };

  const handleFoodCardVerified = (cardNumber: string) => {
    if (!verifyingFoodCard) return;
    setPaymentMethod(verifyingFoodCard);
    setFoodCardNumber(cardNumber);
    setVerifyingFoodCard(null);
  };

  const handleFoodCardBack = () => {
    setVerifyingFoodCard(null);
    setShowPaymentModal(true);
  };

  const handleSelectMobilePayment = (id: MobilePaymentId) => {
    setShowPaymentModal(false);
    setVerifyingMobilePayment(id);
  };

  const handleMobilePaymentVerified = (phone: string) => {
    if (!verifyingMobilePayment) return;
    setPaymentMethod(verifyingMobilePayment);
    setMobilePaymentPhone(phone);
    setVerifyingMobilePayment(null);
  };

  const handleMobilePaymentBack = () => {
    setVerifyingMobilePayment(null);
    setShowPaymentModal(true);
  };

  const handleSelectCashOnDelivery = (id: CashOnDeliveryId) => {
    setPaymentMethod(id);
    setShowPaymentModal(false);
  };

  const completeOrder = () => {
    setShowOrderConfirmModal(false);
    if (!restaurant) return;

    if (isSplitActive) {
      const tiklaParaLeg = splitLegs.find((leg) => leg.type === 'tiklapara');
      const walletLeg = splitLegs.find((leg) => leg.type === 'wallet');
      const otherLeg = splitLegs.find((leg) => leg.type === 'other');

      if (tiklaParaLeg && !chargeTiklaPara(tiklaParaLeg.amount)) {
        setPaymentError('Tıkla Para bakiyen yeterli değil. Ödeme gerçekleştirilemedi.');
        return;
      }
      if (walletLeg && !chargeWallet(walletLeg.amount, restaurant.title)) {
        setPaymentError('Cüzdan bakiyen yeterli değil. Ödeme gerçekleştirilemedi.');
        return;
      }
      if (otherLeg) {
        const otherCharged = isInstantChargeMethod(paymentMethod)
          ? true
          : selectedCard
            ? chargeCard(selectedCard.id, otherLeg.amount)
            : false;
        if (!otherCharged) {
          setPaymentError('Kartında yeterli bakiye yok. Ödeme gerçekleştirilemedi.');
          return;
        }
      }
      setPaymentError('');
      if (isSelectedCouponApplicable && selectedCoupon) {
        useCouponUnit(selectedCoupon.code);
      }
      const splitPaymentMethodLabel = splitLegs
        .map((leg) => (leg.type === 'tiklapara' ? 'Tıkla Param' : leg.type === 'wallet' ? 'Tıklapay Cüzdanım' : paymentMethodLabel))
        .join(' + ');
      placeOrder({
        restaurantId: restaurant.id,
        restaurantTitle: restaurant.title,
        items: cartItems,
        totalAmount,
        address: selectedAddress,
        paymentMethodLabel: splitPaymentMethodLabel,
        cartSubtotal: cartTotal,
        discounts: orderDiscountLines,
      });
      clearCart();
      navigate('/sana-gelsin');
      return;
    }

    const charged =
      paymentMethod === PaymentMethod.Wallet
        ? chargeWallet(totalAmount, restaurant.title)
        : paymentMethod === PaymentMethod.TiklaPara
          ? chargeTiklaPara(totalAmount)
          : isInstantChargeMethod(paymentMethod)
            ? true
            : selectedCard
              ? chargeCard(selectedCard.id, totalAmount)
              : false;
    if (!charged) {
      setPaymentError(
        paymentMethod === PaymentMethod.Wallet
          ? 'Cüzdan bakiyen yeterli değil. Ödeme gerçekleştirilemedi.'
          : paymentMethod === PaymentMethod.TiklaPara
            ? 'Tıkla Para bakiyen yeterli değil. Ödeme gerçekleştirilemedi.'
            : 'Kartında yeterli bakiye yok. Ödeme gerçekleştirilemedi.',
      );
      return;
    }
    setPaymentError('');
    if (isSelectedCouponApplicable && selectedCoupon) {
      useCouponUnit(selectedCoupon.code);
    }
    placeOrder({
      restaurantId: restaurant.id,
      restaurantTitle: restaurant.title,
      items: cartItems,
      totalAmount,
      address: selectedAddress,
      paymentMethodLabel,
      cartSubtotal: cartTotal,
      discounts: orderDiscountLines,
    });
    clearCart();
    navigate('/sana-gelsin');
  };

  const handlePlaceOrder = () => {
    if (!canPlaceOrder || !restaurant) return;
    if (paymentMethod === PaymentMethod.Pluxee) {
      setShowPluxeeVerifyModal(true);
      return;
    }
    setShowOrderConfirmModal(true);
  };

  const handlePluxeeVerified = () => {
    setShowPluxeeVerifyModal(false);
    setShowOrderConfirmModal(true);
  };

  const handleEditOrder = () => {
    setShowOrderConfirmModal(false);
    if (!restaurant || cartItems.length === 0) return;
    navigate(`/restaurant/${restaurant.id}?product=${encodeURIComponent(cartItems[0].productName)}`);
  };

  // "Diğer ödeme yöntemleri" bacağının (kart/yemek kartı/mobil ödeme/kapıda ödeme) ikon ve
  // detay gösterimi; hem tekli ödeme kartında hem parçalı ödemenin ilgili satırında kullanılır.
  const renderOtherMethodIcon = () =>
    paymentMethod === PaymentMethod.Pluxee ? (
      <span className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center shrink-0 text-white text-xs font-semibold">
        P
      </span>
    ) : selectedFoodCardConfig ? (
      <span
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-semibold"
        style={{ backgroundColor: selectedFoodCardConfig.logoColor }}
      >
        {selectedFoodCardConfig.initial}
      </span>
    ) : selectedMobilePaymentConfig ? (
      <span
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-semibold"
        style={{ backgroundColor: selectedMobilePaymentConfig.color }}
      >
        {selectedMobilePaymentConfig.initial}
      </span>
    ) : selectedCashOnDeliveryConfig ? (
      <span className="w-8 h-8 rounded-full border border-[#E91D34] flex items-center justify-center shrink-0 text-[#E91D34]">
        <selectedCashOnDeliveryConfig.icon className="w-3.5 h-3.5" />
      </span>
    ) : (
      <FaCreditCard className="w-4 h-4 text-gray-700 shrink-0" />
    );

  const renderOtherMethodDetails = () =>
    paymentMethod === PaymentMethod.Pluxee ? (
      <span className="text-sm text-gray-800">Pluxee (Sodexo) Online</span>
    ) : selectedFoodCardConfig ? (
      <>
        <span className="text-sm text-gray-800">{selectedFoodCardConfig.displayName}</span>
        <p className="text-xs text-gray-400">{maskFoodCardNumber(foodCardNumber)}</p>
      </>
    ) : selectedMobilePaymentConfig ? (
      <>
        <span className="text-sm text-gray-800">{selectedMobilePaymentConfig.displayName}</span>
        <p className="text-xs text-gray-400">{maskPhoneNumber(mobilePaymentPhone)}</p>
      </>
    ) : selectedCashOnDeliveryConfig ? (
      <span className="text-sm text-gray-800">{selectedCashOnDeliveryConfig.displayName}</span>
    ) : (
      <>
        <span className="text-sm text-gray-800">Kredi / Banka Kartı Online</span>
        {selectedCard && (
          <p className="text-xs text-gray-400">
            {selectedCard.cardHolderName} • **** {selectedCard.last4}
          </p>
        )}
      </>
    );

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      <div className="flex flex-col gap-6 w-full lg:flex-1">
        <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-gray-800 text-lg">Teslimat Bilgileri</h2>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FaHouse className="w-4 h-4 text-gray-700 shrink-0" />
              <div>
                <p className="text-gray-800 text-sm">{selectedAddress.label}</p>
                <p className="text-xs text-gray-400">{selectedAddress.fullAddress}</p>
              </div>
            </div>
            <button
              type="button"
              className="bg-[#E91D34] text-white text-sm rounded-full px-5 py-2.5 shrink-0 hover:bg-[#CA192D] transition-colors"
            >
              Değiştir
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-gray-800 text-lg">Teslimat Zamanı</h2>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setDeliveryTiming('now')}
              className="flex items-center gap-3 text-left"
            >
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  deliveryTiming === 'now' ? 'border-[#E91D34]' : 'border-gray-300'
                }`}
              >
                {deliveryTiming === 'now' && <span className="w-2.5 h-2.5 rounded-full bg-[#E91D34]" />}
              </span>
              <span className={`text-sm ${deliveryTiming === 'now' ? 'text-gray-800' : 'text-gray-500'}`}>
                Şimdi Gelsin
              </span>
            </button>
            <button
              type="button"
              onClick={() => setDeliveryTiming('later')}
              className="flex items-center gap-3 text-left"
            >
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  deliveryTiming === 'later' ? 'border-[#E91D34]' : 'border-gray-300'
                }`}
              >
                {deliveryTiming === 'later' && <span className="w-2.5 h-2.5 rounded-full bg-[#E91D34]" />}
              </span>
              <span className={`text-sm ${deliveryTiming === 'later' ? 'text-gray-800' : 'text-gray-500'}`}>
                İleri Tarihli Gelsin
              </span>
            </button>
          </div>

          {deliveryTiming === 'later' && (
            <>
              {openDropdown && <div className="fixed inset-0" onClick={() => setOpenDropdown(null)} />}
              <div className="relative z-10 flex items-center gap-3">
                <LabeledDropdown
                  label="Teslimat Tarihi"
                  valueLabel={DATE_OPTIONS.find((option) => option.value === deliveryDate)?.label ?? ''}
                  isOpen={openDropdown === 'date'}
                  onToggle={() => setOpenDropdown((prev) => (prev === 'date' ? null : 'date'))}
                  options={DATE_OPTIONS}
                  onSelect={(value) => {
                    setDeliveryDate(value as DeliveryDate);
                    setDeliveryTime('');
                    setOpenDropdown(null);
                  }}
                />
                <LabeledDropdown
                  label="Teslimat Saati"
                  valueLabel={deliveryTime}
                  disabled={!deliveryDate}
                  isOpen={openDropdown === 'time'}
                  onToggle={() => setOpenDropdown((prev) => (prev === 'time' ? null : 'time'))}
                  options={timeOptions}
                  onSelect={(value) => {
                    setDeliveryTime(value);
                    setOpenDropdown(null);
                  }}
                />
              </div>
            </>
          )}
        </div>

        {isSplitActive ? (
          <>
            {splitLegs.map((leg, index) => (
              <div key={leg.type} className="bg-white rounded-2xl p-6 flex flex-col gap-4">
                <h2 className="text-gray-800 text-lg">{index + 1}. Ödeme Yöntemi</h2>
                <div className="flex items-center justify-between gap-4 border border-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    {leg.type === 'tiklapara' ? (
                      <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                        <FaStar className="text-[#E91D34] w-4 h-4" />
                      </span>
                    ) : leg.type === 'wallet' ? (
                      <span className="w-8 h-8 rounded-lg bg-[#E91D34] flex items-center justify-center shrink-0 p-1.5">
                        <span
                          className="w-full h-full bg-white"
                          style={{
                            WebkitMaskImage: `url(${walletLogo})`,
                            maskImage: `url(${walletLogo})`,
                            WebkitMaskSize: 'contain',
                            maskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat',
                            maskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            maskPosition: 'center',
                          }}
                        />
                      </span>
                    ) : (
                      renderOtherMethodIcon()
                    )}
                    <div>
                      {leg.type === 'tiklapara' ? (
                        <span className="text-sm text-gray-800">Tıkla Param</span>
                      ) : leg.type === 'wallet' ? (
                        <span className="text-sm text-gray-800">Tıklapay Cüzdanım</span>
                      ) : (
                        renderOtherMethodDetails()
                      )}
                      <p className="text-xs text-gray-400">
                        Kullanılacak tutar: {leg.type === 'tiklapara' ? formatTp(leg.amount) : formatPrice(leg.amount)}
                      </p>
                    </div>
                  </div>
                  {leg.type === 'other' && (
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(true)}
                      className="bg-[#E91D34] text-white text-sm rounded-full px-6 py-2.5 shrink-0 hover:bg-[#CA192D] transition-colors"
                    >
                      {selectedFoodCardConfig || selectedMobilePaymentConfig || selectedCashOnDeliveryConfig || selectedCard || paymentMethod === PaymentMethod.Pluxee
                        ? 'Değiştir'
                        : 'Seç'}
                    </button>
                  )}
                </div>
                {leg.type === 'other' && !hasSufficientBalance && (
                  <p className="text-xs text-[#E91D34]">
                    {selectedCard
                      ? `Kartında yeterli bakiye yok. Kalan tutar ${formatPrice(otherLegAmount)}, kalan kart limiti ${formatPrice(selectedCard.balance)}.`
                      : `Kalan ${formatPrice(otherLegAmount)} tutar için bir ödeme yöntemi seçmelisin.`}
                  </p>
                )}
                {leg.type === 'other' && paymentError && <p className="text-xs text-[#E91D34]">{paymentError}</p>}
              </div>
            ))}
          </>
        ) : (
          <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-800 text-lg">Ödeme Yöntemi</h2>
              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center gap-2 text-[#E91D34] text-sm hover:underline"
              >
                Seç / Değiştir
                <FaArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center justify-between gap-4 border border-gray-100 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-3">
                {paymentMethod === PaymentMethod.Wallet ? (
                  <span className="w-8 h-8 rounded-lg bg-[#E91D34] flex items-center justify-center shrink-0 p-1.5">
                    <span
                      className="w-full h-full bg-white"
                      style={{
                        WebkitMaskImage: `url(${walletLogo})`,
                        maskImage: `url(${walletLogo})`,
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        maskPosition: 'center',
                      }}
                    />
                  </span>
                ) : paymentMethod === PaymentMethod.TiklaPara ? (
                  <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <FaStar className="text-[#E91D34] w-4 h-4" />
                  </span>
                ) : (
                  renderOtherMethodIcon()
                )}
                <div>
                  {paymentMethod === PaymentMethod.Wallet ? (
                    <>
                      <span className="text-sm text-gray-800">Tıklapay Cüzdanım</span>
                      <p className="text-xs text-gray-400">Kalan bakiye: {formatPrice(walletBalance)}</p>
                    </>
                  ) : paymentMethod === PaymentMethod.TiklaPara ? (
                    <>
                      <span className="text-sm text-gray-800">Tıkla Param</span>
                      <p className="text-xs text-gray-400">Kalan bakiye: {formatTp(tiklaParaBalance)}</p>
                    </>
                  ) : (
                    renderOtherMethodDetails()
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="bg-[#E91D34] text-white text-sm rounded-full px-6 py-2.5 shrink-0 hover:bg-[#CA192D] transition-colors"
              >
                {paymentMethod === PaymentMethod.Wallet ||
                paymentMethod === PaymentMethod.TiklaPara ||
                paymentMethod === PaymentMethod.Pluxee ||
                selectedFoodCardConfig ||
                selectedMobilePaymentConfig ||
                selectedCashOnDeliveryConfig ||
                selectedCard
                  ? 'Değiştir'
                  : 'Ekle'}
              </button>
            </div>
            {!hasSufficientBalance && (
              <p className="text-xs text-[#E91D34]">
                {paymentMethod === PaymentMethod.Wallet
                  ? `Cüzdan bakiyen yeterli değil. Sipariş tutarı ${formatPrice(totalAmount)}, bakiyen ${formatPrice(walletBalance)}.`
                  : paymentMethod === PaymentMethod.TiklaPara
                    ? `Tıkla Para bakiyen yeterli değil. Sipariş tutarı ${formatPrice(totalAmount)}, bakiyen ${formatTp(tiklaParaBalance)}.`
                    : selectedCard
                      ? `Kartında yeterli bakiye yok. Sipariş tutarı ${formatPrice(totalAmount)}, kalan kart limiti ${formatPrice(selectedCard.balance)}.`
                      : 'Ödeme yöntemi seçmelisin.'}
              </p>
            )}
            {paymentError && <p className="text-xs text-[#E91D34]">{paymentError}</p>}
          </div>
        )}

        {showPaymentModal && (
          <PaymentMethodModal
            totalAmount={isSplitActive ? otherLegAmount : totalAmount}
            paymentMethod={paymentMethod}
            hideWalletOptions={isSplitActive}
            onClose={() => setShowPaymentModal(false)}
            onSelectWallet={handleSelectWallet}
            onSelectTiklaPara={handleSelectTiklaPara}
            onSelectCard={handleSelectCard}
            onSelectPluxee={handleSelectPluxee}
            onSelectFoodCard={handleSelectFoodCard}
            onSelectMobilePayment={handleSelectMobilePayment}
            onSelectCashOnDelivery={handleSelectCashOnDelivery}
          />
        )}

        {showPluxeeVerifyModal && (
          <PluxeeVerifyModal
            phone={userPhone}
            expectedCode={expectedPluxeeCode}
            onClose={() => setShowPluxeeVerifyModal(false)}
            onVerified={handlePluxeeVerified}
          />
        )}

        {verifyingFoodCard && (
          <FoodCardVerifyModal
            brandName={FOOD_CARD_CONFIG[verifyingFoodCard].brandName}
            logoLabel={FOOD_CARD_CONFIG[verifyingFoodCard].logoLabel}
            logoColor={FOOD_CARD_CONFIG[verifyingFoodCard].logoColor}
            onBack={handleFoodCardBack}
            onClose={() => setVerifyingFoodCard(null)}
            onVerified={handleFoodCardVerified}
          />
        )}

        {verifyingMobilePayment && (
          <MobilePaymentVerifyModal
            title={MOBILE_PAYMENT_CONFIG[verifyingMobilePayment].title}
            heading={MOBILE_PAYMENT_CONFIG[verifyingMobilePayment].heading}
            description={MOBILE_PAYMENT_CONFIG[verifyingMobilePayment].description}
            phone={userPhone}
            onBack={handleMobilePaymentBack}
            onClose={() => setVerifyingMobilePayment(null)}
            onVerified={handleMobilePaymentVerified}
          />
        )}

        {showOrderConfirmModal && restaurant && (
          <OrderConfirmationModal
            address={selectedAddress}
            restaurant={restaurant}
            branchName={branchName}
            cartItems={cartItems}
            totalAmount={totalAmount}
            onComplete={completeOrder}
            onEdit={handleEditOrder}
          />
        )}

        <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-gray-800 text-lg">Kampanyalar ve Kuponlar</h2>
          <div className="flex items-center justify-between gap-3 border border-gray-200 rounded-full pl-5 pr-1.5 py-1.5">
            <span className={`text-sm truncate ${isSelectedCouponApplicable ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
              {isSelectedCouponApplicable && selectedCoupon
                ? `${selectedCoupon.title} (-${formatPrice(discountAmount)}) • Kalan: ${selectedCouponUsesRemaining} adet`
                : 'Kampanya veya kupon seç'}
            </span>
            <button
              type="button"
              onClick={() => setShowCouponPicker(true)}
              className="bg-[#E91D34] text-white text-sm rounded-full px-6 py-2.5 shrink-0 hover:bg-[#CA192D] transition-colors"
            >
              {isSelectedCouponApplicable ? 'Değiştir' : 'Seç'}
            </button>
          </div>
        </div>

        {showCouponPicker && (
          <CouponPickerModal
            selectedCode={selectedCouponCode}
            restaurantId={restaurant?.id}
            cartItems={cartItems}
            onSelect={setSelectedCouponCode}
            onClose={() => setShowCouponPicker(false)}
          />
        )}

        <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-gray-800 text-lg">Sipariş Notu</h2>
          <div className="flex flex-col gap-1">
            <textarea
              placeholder="Sipariş Notu"
              maxLength={250}
              className="border border-gray-200 rounded-xl px-4 py-3 min-h-[110px] text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#E91D34] transition-colors resize-none"
            />
            <span className="text-xs text-gray-400 text-right">0/250</span>
          </div>

          <hr className="border-gray-100" />

          <div className="flex flex-col gap-4">
            <CheckboxOption
              title="Temassız Teslimat"
              description="Siparişiniz kapınıza bırakılsın"
              checked={contactlessDelivery}
              onToggle={() => setContactlessDelivery((prev) => !prev)}
            />
            <CheckboxOption
              title="Zili Çalma"
              description="Kapı zilim çalınmasın"
              checked={noDoorbell}
              onToggle={() => setNoDoorbell((prev) => !prev)}
            />
            <CheckboxOption
              title="Servis İstemiyorum"
              description="Plastik, tabak, çatal, kaşık ve peçete istemiyorum"
              checked={noCutlery}
              onToggle={() => setNoCutlery((prev) => !prev)}
            />
          </div>
        </div>

        <button
          type="button"
          disabled={!canPlaceOrder}
          onClick={handlePlaceOrder}
          className="bg-[#E91D34] text-white text-sm rounded-full py-4 hover:bg-[#CA192D] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
        >
          Siparişi Oluştur
        </button>
      </div>

      <div className="flex flex-col gap-4 w-full lg:w-[380px] lg:shrink-0">
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-4">
          <h2 className="text-gray-800 text-lg">Sipariş Özeti</h2>

          {restaurant && (
            <div className="flex flex-col gap-1">
              <p className="text-gray-800 text-sm">
                {restaurant.title}
                {branchName ? ` (${branchName})` : ''}
              </p>
              <p className="text-xs text-gray-400">
                {restaurant.deliveryTime.replace(/dk$/, 'dakika')} • min {formatPrice(restaurant.minimumOrderAmount)}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {cartItems.map((item, index) => (
              <div key={item.id} className={index > 0 ? 'border-t border-gray-100 pt-4' : ''}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm">{item.productName}</p>
                    {item.options.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.options.flatMap((group) => group.choices).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="w-7 h-7 flex items-center justify-center rounded-full border border-[#E91D34] text-[#E91D34] text-sm shrink-0">
                    {item.quantity}
                  </span>
                </div>
                <p className="text-[#E91D34] text-sm mt-2">{formatPrice(item.unitPrice * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Sepet Tutarı</span>
            <span className="text-gray-700">{formatPrice(cartTotal)}</span>
          </div>
          {campaignDiscountAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Kampanya İndirimi</span>
              <span className="text-[#E91D34]">-{formatPrice(campaignDiscountAmount)}</span>
            </div>
          )}
          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Kupon İndirimi</span>
              <span className="text-[#E91D34]">-{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-gray-800">Toplam Tutar</span>
            <span className="text-[#E91D34] text-lg">{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
