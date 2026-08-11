import { useState } from 'react';
import { FaTicket } from 'react-icons/fa6';
import useStore, { ALL_COUPONS, type CouponDetail } from '../../store/useStore';
import CouponCard from './CouponCard';
import AddCouponModal from './AddCouponModal';
import CouponDetailModal from './CouponDetailModal';

interface CouponsPanelProps {
  showSearch?: boolean;
}

const CouponsPanel = ({ showSearch = true }: CouponsPanelProps) => {
  const { getUserCoupons } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [detailCode, setDetailCode] = useState<string | null>(null);

  const ownedCoupons: CouponDetail[] = getUserCoupons()
    .map((code) => ALL_COUPONS.find((coupon) => coupon.code === code))
    .filter((coupon): coupon is CouponDetail => Boolean(coupon));

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('tr-TR');
  const filteredCoupons = normalizedQuery
    ? ownedCoupons.filter(
        (coupon) =>
          coupon.title.toLocaleLowerCase('tr-TR').includes(normalizedQuery) ||
          coupon.restaurantTitle.toLocaleLowerCase('tr-TR').includes(normalizedQuery),
      )
    : ownedCoupons;

  const detailCoupon = detailCode ? (ALL_COUPONS.find((coupon) => coupon.code === detailCode) ?? null) : null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-5">
        {showSearch && (
          <div className="flex items-center gap-3 border border-gray-200 rounded-full px-5 py-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kupon Ara"
              className="flex-1 min-w-0 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-gray-400 shrink-0"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        )}

        <h2 className="text-sm font-semibold text-[#E30A17] border-b-2 border-[#E30A17] inline-block pb-2 self-start">
          Kuponlarım
        </h2>

        {filteredCoupons.length === 0 ? (
          <div className="flex flex-col items-center gap-3 text-center py-16">
            <FaTicket className="w-12 h-12 text-gray-200" />
            <h3 className="text-gray-700 font-semibold">Üzgünüz 😔</h3>
            <p className="text-sm text-gray-400">Hesabına tanımlı kupon bulunmamaktadır</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCoupons.map((coupon) => (
              <CouponCard key={coupon.code} coupon={coupon} onDetail={() => setDetailCode(coupon.code)} />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="bg-[#E30A17] text-white text-sm font-semibold rounded-full px-6 py-3 hover:bg-[#c80914] transition-colors"
        >
          Kupon Ekle
        </button>
      </div>

      {isAddOpen && <AddCouponModal onClose={() => setIsAddOpen(false)} onAdded={() => setIsAddOpen(false)} />}
      {detailCoupon && <CouponDetailModal coupon={detailCoupon} onClose={() => setDetailCode(null)} />}
    </div>
  );
};

export default CouponsPanel;
