import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaChevronDown, FaCreditCard, FaHouse } from 'react-icons/fa6';
import useStore, { ALL_COUPONS } from '../store/useStore';
import { getRestaurantById } from '../data/restaurants';
import PaymentMethodModal from '../Components/PaymentMethodModal/PaymentMethodModal';
import CouponPickerModal from '../Components/Campaigns/CouponPickerModal';
import { calculateCouponDiscount, getCouponUnavailabilityReason } from '../Components/Campaigns/couponUtils';
import walletLogo from '../assets/Wallet2.png';

const formatPrice = (price: number): string => `${price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;

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
        checked ? 'bg-[#E30A17] border-[#E30A17]' : 'border-gray-300'
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
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('card');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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
    placeOrder,
    clearCart,
    chargeCard,
    chargeWallet,
    selectSavedCard,
  } = useStore();
  const savedCards = userName ? savedCardsByUser[userName] ?? [] : [];
  const selectedCard = userName
    ? savedCards.find((card) => card.id === selectedCardIdByUser[userName])
    : undefined;
  const walletBalance = userName ? walletBalanceByUser[userName] ?? 0 : 0;
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? addresses[0];
  const restaurant = cartItems.length > 0 ? getRestaurantById(cartItems[0].restaurantId) : undefined;
  const branchName = restaurant?.locations.find((location) => location.addressId === selectedAddressId)?.branchName;
  const selectedCoupon = selectedCouponCode ? ALL_COUPONS.find((coupon) => coupon.code === selectedCouponCode) : undefined;
  const isSelectedCouponApplicable = Boolean(
    selectedCoupon &&
      restaurant &&
      selectedCoupon.restaurantId === restaurant.id &&
      !getCouponUnavailabilityReason(selectedCoupon, cartItems),
  );
  const discountAmount =
    isSelectedCouponApplicable && selectedCoupon ? calculateCouponDiscount(selectedCoupon, cartItems) : 0;
  const cartTotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountedCartTotal = Math.max(0, cartTotal - discountAmount);
  const totalAmount = discountedCartTotal + (restaurant?.serviceFee ?? 0);
  const timeOptions: DropdownOption[] = restaurant
    ? generateTimeSlots(restaurant.openingHour, restaurant.closingHour).map((slot) => ({ value: slot, label: slot }))
    : [];
  const hasValidDeliveryTime = deliveryTiming === 'now' || (deliveryDate !== '' && deliveryTime !== '');
  const hasSufficientBalance =
    paymentMethod === 'wallet'
      ? walletBalance >= totalAmount
      : Boolean(selectedCard) && (selectedCard?.balance ?? 0) >= totalAmount;
  const canPlaceOrder = cartItems.length > 0 && hasSufficientBalance && hasValidDeliveryTime;

  const handleSelectWallet = () => {
    setPaymentMethod((prev) => (prev === 'wallet' ? 'card' : 'wallet'));
  };

  const handleSelectCard = (cardId: string) => {
    selectSavedCard(cardId);
    setPaymentMethod('card');
    setShowPaymentModal(false);
  };

  const handlePlaceOrder = () => {
    if (!canPlaceOrder || !restaurant) return;
    const charged =
      paymentMethod === 'wallet' ? chargeWallet(totalAmount) : selectedCard ? chargeCard(selectedCard.id, totalAmount) : false;
    if (!charged) {
      setPaymentError(
        paymentMethod === 'wallet'
          ? 'Cüzdan bakiyen yeterli değil. Ödeme gerçekleştirilemedi.'
          : 'Kartında yeterli bakiye yok. Ödeme gerçekleştirilemedi.',
      );
      return;
    }
    setPaymentError('');
    placeOrder({
      restaurantId: restaurant.id,
      restaurantTitle: restaurant.title,
      items: cartItems,
      totalAmount,
    });
    clearCart();
    navigate('/sana-gelsin');
  };

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
              className="bg-[#E30A17] text-white text-sm rounded-full px-5 py-2.5 shrink-0 hover:bg-[#c80914] transition-colors"
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
                  deliveryTiming === 'now' ? 'border-[#E30A17]' : 'border-gray-300'
                }`}
              >
                {deliveryTiming === 'now' && <span className="w-2.5 h-2.5 rounded-full bg-[#E30A17]" />}
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
                  deliveryTiming === 'later' ? 'border-[#E30A17]' : 'border-gray-300'
                }`}
              >
                {deliveryTiming === 'later' && <span className="w-2.5 h-2.5 rounded-full bg-[#E30A17]" />}
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

        <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-800 text-lg">Ödeme Yöntemi</h2>
            <button
              type="button"
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-2 text-[#E30A17] text-sm hover:underline"
            >
              Seç / Değiştir
              <FaArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 border border-gray-100 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-3">
              {paymentMethod === 'wallet' ? (
                <span className="w-8 h-8 rounded-lg bg-[#E30A17] flex items-center justify-center shrink-0 p-1.5">
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
                <FaCreditCard className="w-4 h-4 text-gray-700 shrink-0" />
              )}
              <div>
                {paymentMethod === 'wallet' ? (
                  <>
                    <span className="text-sm text-gray-800">Tıklapay Cüzdanım</span>
                    <p className="text-xs text-gray-400">Kalan bakiye: {formatPrice(walletBalance)}</p>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-gray-800">Kredi / Banka Kartı Online</span>
                    {selectedCard && (
                      <>
                        <p className="text-xs text-gray-400">
                          {selectedCard.cardHolderName} • **** {selectedCard.last4}
                        </p>
                        <p className="text-xs text-gray-400">Kalan kart limiti: {formatPrice(selectedCard.balance)}</p>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPaymentModal(true)}
              className="bg-[#E30A17] text-white text-sm rounded-full px-6 py-2.5 shrink-0 hover:bg-[#c80914] transition-colors"
            >
              {paymentMethod === 'wallet' || selectedCard ? 'Değiştir' : 'Ekle'}
            </button>
          </div>
          {!hasSufficientBalance && (
            <p className="text-xs text-[#E30A17]">
              {paymentMethod === 'wallet'
                ? `Cüzdan bakiyen yeterli değil. Sipariş tutarı ${formatPrice(totalAmount)}, bakiyen ${formatPrice(walletBalance)}.`
                : selectedCard
                  ? `Kartında yeterli bakiye yok. Sipariş tutarı ${formatPrice(totalAmount)}, kalan kart limiti ${formatPrice(selectedCard.balance)}.`
                  : 'Ödeme yöntemi seçmelisin.'}
            </p>
          )}
          {paymentError && <p className="text-xs text-[#E30A17]">{paymentError}</p>}
        </div>

        {showPaymentModal && (
          <PaymentMethodModal
            totalAmount={totalAmount}
            paymentMethod={paymentMethod}
            onClose={() => setShowPaymentModal(false)}
            onSelectWallet={handleSelectWallet}
            onSelectCard={handleSelectCard}
          />
        )}

        <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-gray-800 text-lg">Kampanyalar ve Kuponlar</h2>
          <div className="flex items-center justify-between gap-3 border border-gray-200 rounded-full pl-5 pr-1.5 py-1.5">
            <span className={`text-sm truncate ${isSelectedCouponApplicable ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
              {isSelectedCouponApplicable && selectedCoupon
                ? `${selectedCoupon.title} (-${formatPrice(discountAmount)})`
                : 'Kampanya veya kupon seç'}
            </span>
            <button
              type="button"
              onClick={() => setShowCouponPicker(true)}
              className="bg-[#E30A17] text-white text-sm rounded-full px-6 py-2.5 shrink-0 hover:bg-[#c80914] transition-colors"
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
              className="border border-gray-200 rounded-xl px-4 py-3 min-h-[110px] text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#E30A17] transition-colors resize-none"
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
          className="bg-[#E30A17] text-white text-sm rounded-full py-4 hover:bg-[#c80914] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
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
                  <span className="w-7 h-7 flex items-center justify-center rounded-full border border-[#E30A17] text-[#E30A17] text-sm shrink-0">
                    {item.quantity}
                  </span>
                </div>
                <p className="text-[#E30A17] text-sm mt-2">{formatPrice(item.unitPrice * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Sepet Tutarı</span>
            <span className="text-gray-700">{formatPrice(cartTotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Kupon İndirimi</span>
              <span className="text-[#E30A17]">-{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-gray-800">Toplam Tutar</span>
            <span className="text-[#E30A17] text-lg">{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
