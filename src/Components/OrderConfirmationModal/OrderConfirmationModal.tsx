import { useEffect, useRef, useState } from 'react';
import { FaBurger, FaCircleCheck, FaLocationDot } from 'react-icons/fa6';
import type { Address, CartItem } from '../../store/useStore';
import type { Restaurant } from '../../data/restaurants';

const COUNTDOWN_SECONDS = 15;

const formatPrice = (price: number): string => `${price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;

interface OrderConfirmationModalProps {
  address: Address;
  restaurant: Restaurant;
  branchName?: string;
  cartItems: CartItem[];
  totalAmount: number;
  onComplete: () => void;
  onEdit: () => void;
}

const OrderConfirmationModal = ({
  address,
  restaurant,
  branchName,
  cartItems,
  totalAmount,
  onComplete,
  onEdit,
}: OrderConfirmationModalProps) => {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const settledRef = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (!settledRef.current) {
        settledRef.current = true;
        onComplete();
      }
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, onComplete]);

  const handleComplete = () => {
    if (settledRef.current) return;
    settledRef.current = true;
    onComplete();
  };

  const handleEdit = () => {
    settledRef.current = true;
    onEdit();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-2xl w-full max-w-sm flex flex-col overflow-hidden shadow-xl">
        <div className="px-5 pt-5 pb-1 shrink-0">
          <h2 className="text-gray-800 text-lg">Sipariş Onayı</h2>
        </div>

        <div className="styled-scrollbar overflow-y-auto px-5 pt-3 pb-5 flex flex-col gap-4 max-h-[85vh]">
          <div className="flex flex-col gap-2">
            <h3 className="text-gray-800 text-sm">Teslimat Bilgileri</h3>
            <div className="border border-gray-100 rounded-2xl px-4 py-3.5 flex items-start gap-3">
              <FaLocationDot className="w-4 h-4 text-gray-700 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-gray-800 text-sm">Adresim</p>
                <p className="text-xs text-gray-400 mt-0.5">{address.fullAddress}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-gray-800 text-sm">Sipariş Özeti</h3>
            <div className="border border-gray-100 rounded-2xl p-3 flex flex-col gap-3">
              <div className="flex items-center gap-3 border border-gray-100 rounded-xl px-3 py-2.5">
                <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-50 shrink-0 flex items-center justify-center">
                  {restaurant.image ? (
                    <img src={restaurant.image} alt={restaurant.title} className="w-full h-full object-cover" />
                  ) : (
                    <FaBurger className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                <p className="text-gray-800 text-sm truncate">
                  {restaurant.title}
                  {branchName ? ` (${branchName})` : ''}
                </p>
              </div>

              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 ${index > 0 ? 'border-t border-gray-100 pt-3' : ''}`}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <FaBurger className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-800 text-sm">
                      {item.productName}
                      {item.quantity > 1 ? ` x${item.quantity}` : ''}
                    </p>
                    {item.options.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.options.flatMap((group) => group.choices).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-800 text-sm">Toplam Tutar</span>
            <span className="text-[#E91D34] text-lg">{formatPrice(totalAmount)}</span>
          </div>

          <div className="flex items-center justify-between gap-3 bg-green-100 rounded-full pl-4 pr-1.5 py-1.5">
            <span className="flex items-center gap-2 text-green-700 text-sm">
              <FaCircleCheck className="w-4 h-4 text-green-600 shrink-0" />
              Siparişin oluşturuluyor...
            </span>
            <span className="bg-white border border-green-300 text-green-700 text-xs font-semibold rounded-full px-3 py-1.5 shrink-0">
              {secondsLeft} sn
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleComplete}
              className="bg-[#E91D34] text-white text-sm font-semibold rounded-full py-3.5 hover:bg-[#CA192D] transition-colors"
            >
              Siparişi Tamamla
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="border border-[#E91D34] text-[#E91D34] text-sm font-semibold rounded-full py-3.5 hover:bg-red-50 transition-colors"
            >
              Düzenle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
