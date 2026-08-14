import { Link, useParams } from 'react-router-dom';
import useStore, { getCouponDetail } from '../store/useStore';
import { getRestaurantById } from '../data/restaurants';
import { formatCouponDate, getDaysRemaining } from '../Components/Campaigns/couponUtils';
import tiklaGelsinLogo from '../assets/tikla-gelsin-logo-red.png';

const CouponDetailPage = () => {
  const { code } = useParams<{ code: string }>();
  const coupon = code ? getCouponDetail(code) : undefined;
  const { getCouponUsesRemaining } = useStore();

  if (!coupon) {
    return (
      <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-4 text-center">
        <h2 className="text-lg text-gray-700">Kupon bulunamadı</h2>
        <Link to="/kampanyalar" className="text-[#E91D34] hover:underline">
          Kuponlara geri dön
        </Link>
      </div>
    );
  }

  const usesRemaining = getCouponUsesRemaining(coupon.code);
  const isExhausted = usesRemaining <= 0;
  const daysRemaining = getDaysRemaining(coupon.validUntil);
  const isDateExpired = daysRemaining < 0;
  const isExpired = isDateExpired || isExhausted;

  const restaurant = getRestaurantById(coupon.restaurantId);
  const targetProduct =
    coupon.discount.targetProductName && restaurant
      ? restaurant.products.find((product) => product.name === coupon.discount.targetProductName)
      : undefined;

  const ctaHref = restaurant
    ? `/restaurant/${restaurant.id}?coupon=${coupon.code}${
        targetProduct ? `&product=${encodeURIComponent(targetProduct.name)}` : ''
      }`
    : null;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-white rounded-3xl p-4 flex flex-col gap-2">
        <div className="relative w-full aspect-[3/2] sm:aspect-[10/3] rounded-[32px] border-[6px] border-[#E91D34] overflow-hidden">
          <div className="absolute inset-0 rounded-[26px] border-[3px] border-[#F2F2F2] overflow-hidden">
            <div className="absolute inset-[-24px] sm:inset-0 flex flex-row p-10 sm:p-6 justify-between text-[11px] md:text-2xl">
              <div className="flex flex-col items-start justify-between w-[104px] sm:w-1/3">
                <img src={tiklaGelsinLogo} alt="tıkla gelsin" className="w-16 sm:w-32 object-contain" />
                <div>
                  <p className="text-[0.85em] text-gray-800">Kalan Kullanım</p>
                  <p className={`font-bold ${isExhausted ? 'text-gray-400' : 'text-gray-800'}`}>{usesRemaining} Adet</p>
                </div>
                <div>
                  <p className="text-[0.85em] text-gray-800">Geçerlilik Tarihi</p>
                  <p className={`font-bold ${isExpired ? 'text-gray-400' : 'text-gray-800'}`}>
                    {formatCouponDate(coupon.validUntil)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start justify-between w-[180px] sm:w-2/3 pl-6 sm:pl-12">
                <p className="text-gray-800 font-medium leading-snug">{coupon.title}</p>
              </div>
            </div>

            <span
              className="hidden sm:block absolute inset-y-0 left-1/3 -translate-x-1/2 w-[6px]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to bottom, #F2F2F2 0px, #F2F2F2 10px, transparent 10px, transparent 20px)',
              }}
            />
          </div>

          <span className="hidden sm:block absolute left-1/3 -translate-x-1/2 -top-[6px] w-11 h-[33px] rounded-b-full bg-[#E91D34]" />
          <span className="hidden sm:block absolute left-1/3 -translate-x-1/2 -bottom-[6px] w-11 h-[33px] rounded-t-full bg-[#E91D34]" />
        </div>

        <div className="flex flex-col gap-6">
          <span
            className={`self-start text-white text-[10px] font-bold rounded-full px-3 py-1 ${
              isExpired ? 'bg-gray-400' : 'bg-[#E91D34]'
            }`}
          >
            {coupon.restaurantTitle}
          </span>

          <div className="flex flex-col gap-3 text-base">
            <span className={isExpired ? 'text-gray-400' : 'text-gray-600'}>Kupon Geçerlilik Tarihi</span>
            <span className={isExpired ? 'text-gray-400' : 'text-gray-600'}>
              {isExhausted
                ? 'Bu kuponun kullanım hakkı doldu'
                : isDateExpired
                  ? 'Bu kuponun süresi doldu'
                  : formatCouponDate(coupon.validUntil)}
            </span>
          </div>

          {ctaHref && !isExpired && (
            <Link
              to={ctaHref}
              className="self-end bg-[#E91D34] text-white text-sm rounded-full px-5 py-2.5 hover:bg-[#CA192D] transition-colors"
            >
              Kuponu Uygula
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponDetailPage;
