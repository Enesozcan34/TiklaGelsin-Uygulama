import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBasketShopping, FaBurger, FaChevronDown, FaMinus, FaPlus } from 'react-icons/fa6';
import useStore from '../store/useStore';
import { getRestaurantById } from '../data/restaurants';

const formatPrice = (price: number): string => `${price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateCartQuantity, clearCart, selectedAddressId } = useStore();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const cartTotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const toggleExpanded = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const restaurant = cartItems.length > 0 ? getRestaurantById(cartItems[0].restaurantId) : undefined;
  const branchName = restaurant?.locations.find((location) => location.addressId === selectedAddressId)?.branchName;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
        <div className="bg-white rounded-2xl flex flex-col items-center justify-center text-center gap-4 py-20 px-6 w-full lg:flex-1">
          <FaBasketShopping className="w-16 h-16 text-gray-200" />
          <h2 className="text-gray-800 text-lg">Sepetin Boş.</h2>
          <p className="text-sm text-gray-500">
            Sipariş ver, istediğin yere
            <br />
            getirelim.
          </p>
          <Link
            to="/sana-gelsin"
            className="bg-[#E91D34] text-white text-sm rounded-full px-6 py-3 hover:bg-[#CA192D] transition-colors"
          >
            Ürün Ekle
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between gap-4 w-full lg:w-[320px] lg:shrink-0">
          <div>
            <p className="text-xs text-gray-400">Sepet Tutarı</p>
            <p className="text-gray-800 text-lg">{formatPrice(0)}</p>
          </div>
          <button
            type="button"
            disabled
            className="bg-gray-200 text-gray-400 text-sm rounded-full px-6 py-3 disabled:cursor-not-allowed"
          >
            Devam Et
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-5 w-full lg:flex-1">
        <div className="flex items-center justify-between">
          <h1 className="text-gray-800 text-lg">Sepet Detayı</h1>
          <button
            type="button"
            onClick={() => clearCart()}
            className="text-[#E91D34] text-sm hover:underline"
          >
            Sepeti Boşalt
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {cartItems.map((item) => {
            const isExpanded = expandedIds.has(item.id);
            return (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                  ) : (
                    <FaBurger className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm">{item.productName}</p>
                  {item.options.length > 0 && (
                    <div className="mt-1 flex flex-col gap-0.5">
                      {item.options.map((group) => (
                        <p
                          key={group.groupName}
                          className={`text-xs text-gray-500 ${isExpanded ? '' : 'truncate'}`}
                        >
                          <span className="text-gray-700">{group.groupName}:</span> {group.choices.join(', ')}
                        </p>
                      ))}
                      <button
                        type="button"
                        onClick={() => toggleExpanded(item.id)}
                        className="flex items-center gap-1 text-[#E91D34] text-xs mt-0.5 self-start"
                      >
                        Tümünü Gör
                        <FaChevronDown className={`w-2.5 h-2.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  )}
                  <p className="text-[#E91D34] text-sm mt-1">{formatPrice(item.unitPrice * item.quantity)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    aria-label="Azalt"
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-[#E91D34] text-[#E91D34] hover:bg-red-50 transition-colors"
                  >
                    <FaMinus className="w-2.5 h-2.5" />
                  </button>
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#E91D34] text-white text-sm">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Artır"
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-[#E91D34] text-[#E91D34] hover:bg-red-50 transition-colors"
                  >
                    <FaPlus className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {restaurant && (
          <Link
            to={`/restaurant/${restaurant.id}`}
            className="border border-[#E91D34] text-[#E91D34] text-sm rounded-full py-3 text-center hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <FaPlus className="w-3 h-3" />
            Yeni Ürün Ekle
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-4 w-full lg:w-[320px] lg:shrink-0">
        {restaurant && (
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 bg-white">
              <img src={restaurant.image} alt={restaurant.title} className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-800 text-sm">
              {restaurant.title}
              {branchName ? ` (${branchName})` : ''}
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400">Sepet Tutarı</p>
            <p className="text-gray-800 text-lg">{formatPrice(cartTotal)}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/odeme')}
            className="bg-[#E91D34] text-white text-sm rounded-full px-6 py-3 hover:bg-[#CA192D] transition-colors"
          >
            Devam Et
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
