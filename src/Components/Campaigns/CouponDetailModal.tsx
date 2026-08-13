import { FaXmark } from 'react-icons/fa6';
import type { CouponDetail } from '../../store/useStore';
import { formatCouponDate, getDaysRemaining } from './couponUtils';

interface CouponDetailModalProps {
  coupon: CouponDetail;
  onClose: () => void;
}

const CouponDetailModal = ({ coupon, onClose }: CouponDetailModalProps) => {
  const daysRemaining = getDaysRemaining(coupon.validUntil);
  const isExpired = daysRemaining < 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-sm overflow-hidden">
        <button
          type="button"
          aria-label="Kapat"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white/90 hover:text-white bg-black/20 rounded-full p-1.5"
        >
          <FaXmark className="w-4 h-4" />
        </button>

        <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-orange-100 via-rose-50 to-purple-100 flex items-center px-6">
          <img
            src={coupon.restaurantImage}
            alt={coupon.restaurantTitle}
            className="w-16 h-16 object-contain bg-white rounded-lg p-2 shrink-0"
          />
          <p className="ml-4 text-base text-gray-700 font-medium leading-snug">{coupon.description}</p>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-gray-800 text-lg font-semibold leading-snug">{coupon.title}</h2>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">Restoran</span>
              <span className="text-gray-800 font-medium">{coupon.restaurantTitle}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">Kupon Kodu</span>
              <span className="text-gray-800 font-medium">{coupon.code}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Geçerlilik Tarihi</span>
              <span className={`font-medium ${isExpired ? 'text-gray-400' : 'text-gray-800'}`}>
                {formatCouponDate(coupon.validUntil)}
              </span>
            </div>
          </div>

          {isExpired ? (
            <span className="text-center text-xs font-semibold text-gray-400 bg-gray-50 rounded-full py-2">
              Bu kuponun süresi doldu
            </span>
          ) : (
            <span className="text-center text-xs font-semibold text-[#E30A17] bg-red-50 rounded-full py-2">
              Son {daysRemaining} gün geçerli
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponDetailModal;
