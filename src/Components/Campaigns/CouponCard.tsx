import { Link } from 'react-router-dom';
import { FaArrowRight, FaChevronRight } from 'react-icons/fa6';
import useStore, { type CouponDetail } from '../../store/useStore';
import { formatCouponDateShort, getDaysRemaining } from './couponUtils';
import tiklaGelsinLogo from '../../assets/tikla-gelsin-logo-red.png';

interface CouponCardProps {
  coupon: CouponDetail;
}

const CouponCard = ({ coupon }: CouponCardProps) => {
  const { getCouponUsesRemaining } = useStore();
  const usesRemaining = getCouponUsesRemaining(coupon.code);
  const isExhausted = usesRemaining <= 0;
  const isExpired = getDaysRemaining(coupon.validUntil) < 0 || isExhausted;
  const detailHref = `/kuponlar/${coupon.code}`;

  const content = (
    <>
      <div className="flex flex-col items-center justify-center w-28 shrink-0 gap-3 px-2 py-4">
        <img src={tiklaGelsinLogo} alt="tıkla gelsin" className="max-w-[70%] object-contain" />
        <div className="text-center">
          <p className="text-xs text-gray-400">Geçerlilik Tarihi</p>
          <p className={`text-sm font-bold mt-0.5 ${isExpired ? 'text-gray-400' : 'text-gray-800'}`}>
            {formatCouponDateShort(coupon.validUntil)}
          </p>
        </div>
      </div>

      <div className="flex-1 min-w-0 h-full flex items-center justify-between gap-2 border-l border-dashed border-gray-200 px-4 py-4">
        <span className="text-sm font-semibold text-gray-800 leading-snug">{coupon.title}</span>
        <FaChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-full border-2 border-gray-200 rounded-3xl p-3">
      <Link
        to={detailHref}
        className="self-end flex items-center gap-1 text-sm font-semibold text-[#E91D34] hover:underline mb-1"
      >
        Detay <FaArrowRight className="w-3 h-3" />
      </Link>

      <div
        className={`relative flex flex-1 flex-col bg-white rounded-2xl border border-gray-200 ${
          isExpired ? 'opacity-60' : ''
        }`}
      >
        {isExpired ? (
          <div className="flex flex-1 items-center text-left">{content}</div>
        ) : (
          <Link to={detailHref} className="flex flex-1 items-center text-left">
            {content}
          </Link>
        )}

        <span className="absolute left-28 -translate-x-1/2 -top-px w-3.5 h-[7px] rounded-b-full bg-white border-x border-b border-gray-200" />
        <span className="absolute left-28 -translate-x-1/2 -bottom-px w-3.5 h-[7px] rounded-t-full bg-white border-x border-t border-gray-200" />
      </div>

      <span
        className={`mt-1 self-start relative z-10 text-white text-xs font-semibold rounded-full px-4 py-1.5 ${
          isExpired ? 'bg-gray-400' : 'bg-[#E91D34]'
        }`}
      >
        {isExhausted ? 'Tükendi' : isExpired ? 'Süresi Doldu' : coupon.restaurantTitle}
      </span>
    </div>
  );
};

export default CouponCard;
