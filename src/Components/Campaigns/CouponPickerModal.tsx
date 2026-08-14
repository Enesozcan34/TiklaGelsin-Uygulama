import { FaXmark } from 'react-icons/fa6';
import useStore, { ALL_COUPONS, type CartItem, type CouponDetail } from '../../store/useStore';
import { calculateCouponDiscount, formatCouponPrice, getCouponUnavailabilityReason } from './couponUtils';

interface CouponPickerModalProps {
  selectedCode: string | null;
  restaurantId?: string;
  cartItems: CartItem[];
  onSelect: (code: string) => void;
  onClose: () => void;
}

const CouponPickerModal = ({ selectedCode, restaurantId, cartItems, onSelect, onClose }: CouponPickerModalProps) => {
  const { getUserCoupons, getCouponUsesRemaining } = useStore();
  const ownedCoupons: CouponDetail[] = getUserCoupons()
    .map((code) => ALL_COUPONS.find((coupon) => coupon.code === code))
    .filter((coupon): coupon is CouponDetail => Boolean(coupon))
    .filter((coupon) => !restaurantId || coupon.restaurantId === restaurantId);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <h2 className="text-gray-800 text-base font-semibold">Kampanya veya Kupon Seç</h2>
          <button type="button" aria-label="Kapat" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaXmark className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-2">
          {ownedCoupons.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              {restaurantId
                ? 'Sepetindeki restoran için kullanabileceğin bir kupon bulunmuyor.'
                : 'Hesabına tanımlı kupon bulunmamaktadır.'}
            </p>
          ) : (
            ownedCoupons.map((coupon) => {
              const usesRemaining = getCouponUsesRemaining(coupon.code);
              const unavailableReason = getCouponUnavailabilityReason(coupon, cartItems, usesRemaining);
              const discountAmount = calculateCouponDiscount(coupon, cartItems, usesRemaining);
              const isUsable = !unavailableReason;

              return (
                <button
                  key={coupon.code}
                  type="button"
                  disabled={!isUsable}
                  onClick={() => {
                    onSelect(coupon.code);
                    onClose();
                  }}
                  className={`text-left border rounded-2xl px-4 py-3 transition-colors ${
                    !isUsable
                      ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                      : selectedCode === coupon.code
                        ? 'border-[#E91D34] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="block text-sm font-semibold text-gray-800">{coupon.title}</span>
                    {isUsable && (
                      <span className="shrink-0 text-sm font-semibold text-[#E91D34]">
                        -{formatCouponPrice(discountAmount)}
                      </span>
                    )}
                  </span>
                  <span className="block text-xs text-gray-400 mt-0.5">
                    {coupon.restaurantTitle} • Kalan Kullanım: {usesRemaining} adet
                  </span>
                  {unavailableReason && <span className="block text-xs text-[#E91D34] mt-1">{unavailableReason}</span>}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponPickerModal;
