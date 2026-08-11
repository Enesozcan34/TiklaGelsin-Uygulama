import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCircleQuestion, FaClock, FaRegHeart } from 'react-icons/fa6';
import Cuisines from '../Components/Cuisines/Cuisines';
import useStore from '../store/useStore';
import {
  filterRestaurantsByQuery,
  getMatchingProducts,
  getRestaurantsByAddress,
  getRestaurantsByCategory,
  type Restaurant,
} from '../data/restaurants';

const restaurantVisuals: Record<string, { initial: string; gradient: string }> = {
  BurgerKing: { initial: 'BK', gradient: 'from-orange-400 to-red-600' },
  Popeyes: { initial: 'PO', gradient: 'from-amber-500 to-orange-700' },
  AmasyaEtUrunleri: { initial: 'AE', gradient: 'from-red-700 to-red-950' },
};

const RESTAURANTS_WITH_DETAIL_PAGE = new Set(['BurgerKing', 'Popeyes', 'DonerciUsta', 'SutKahvaltiEvi', 'Sbarro', 'AmasyaEtUrunleri', 'KokorecciAli', 'Arbys', 'Subway', 'UstaPideci']);

const formatPrice = (price: number): string => `${price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;

const formatOrderDate = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
    <svg
      viewBox="0 0 64 64"
      className="w-24 h-24 text-gray-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="24" y1="18" x2="30" y2="6" />
      <path d="M16 18h20l-2.5 34a2 2 0 01-2 2H20.5a2 2 0 01-2-2L16 18z" />
      <line x1="14" y1="18" x2="38" y2="18" />
      <path d="M28 35a12 12 0 0124 0" />
      <line x1="26" y1="39" x2="54" y2="39" />
      <path d="M26 39c0 3 2.2 5 5 5h18c2.8 0 5-2 5-5" />
      <line x1="26" y1="47" x2="54" y2="47" />
      <path d="M26 47h28v3a3 3 0 01-3 3H29a3 3 0 01-3-3v-3z" />
    </svg>
    <h3 className="text-lg text-gray-600">Uygun Restoran Bulunamadı!</h3>
    <p className="text-sm text-gray-500 max-w-xs">Filtreni sıfırlayıp tekrar arama yapabilirsin.</p>
    <button
      type="button"
      onClick={onReset}
      className="bg-[#E30A17] text-white text-sm rounded-full px-6 py-3 hover:bg-[#c80914] transition-colors"
    >
      Filtreyi Sıfırla
    </button>
  </div>
);

const RestaurantCard = ({
  restaurant,
  searchQuery,
  selectedCategory,
}: {
  restaurant: Restaurant;
  searchQuery: string;
  selectedCategory: string | null;
}) => {
  const navigate = useNavigate();
  const visual = restaurantVisuals[restaurant.id] ?? { initial: restaurant.title.slice(0, 2).toUpperCase(), gradient: 'from-gray-400 to-gray-600' };
  const trimmedQuery = searchQuery.trim();
  const matchingProducts = trimmedQuery ? getMatchingProducts(restaurant, trimmedQuery) : [];
  const hasDetailPage = RESTAURANTS_WITH_DETAIL_PAGE.has(restaurant.id);
  const detailParams = new URLSearchParams();
  if (trimmedQuery) detailParams.set('q', trimmedQuery);
  if (selectedCategory) detailParams.set('category', selectedCategory);
  const detailPath = detailParams.toString()
    ? `/restaurant/${restaurant.id}?${detailParams.toString()}`
    : `/restaurant/${restaurant.id}`;
  return (
    <div
      role={hasDetailPage ? 'button' : undefined}
      tabIndex={hasDetailPage ? 0 : undefined}
      onClick={hasDetailPage ? () => navigate(detailPath) : undefined}
      onKeyDown={
        hasDetailPage
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate(detailPath);
            }
          : undefined
      }
      className={`flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm ${hasDetailPage ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div className={`relative h-32 sm:h-36 bg-gradient-to-br ${visual.gradient} flex items-center justify-center overflow-hidden`}>
        {restaurant.image ? (
          <img src={restaurant.image} alt={restaurant.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white/90 text-3xl">{visual.initial}</span>
        )}
        <button
          type="button"
          aria-label="Favorilere ekle"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-500 hover:text-[#E30A17] rounded-full p-2 transition-colors"
        >
          <FaRegHeart className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex flex-col gap-1 px-4 py-3">
        <span className="text-gray-800 text-sm truncate">
          {restaurant.title} ({restaurant.description})
        </span>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>Min {restaurant.minimumOrderAmount} ₺</span>
          <span className="flex items-center gap-1">
            <FaClock className="w-3 h-3" />
            {restaurant.deliveryTime}
          </span>
        </div>
        {matchingProducts.length > 0 && (
          <p className="text-xs text-[#E30A17] truncate">
            Eşleşen ürünler: {matchingProducts.map((product) => product.name).join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};

const RestaurantsPage = () => {
  const selectedAddressId = useStore((state) => state.selectedAddressId);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const userName = useStore((state) => state.userName);
  const ordersByUser = useStore((state) => state.ordersByUser);
  const myOrders = userName ? ordersByUser[userName] ?? [] : [];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [onlyFreeDelivery, setOnlyFreeDelivery] = useState(false);

  const categoryRestaurants = selectedCategory
    ? getRestaurantsByCategory(selectedAddressId, selectedCategory)
    : getRestaurantsByAddress(selectedAddressId);
  const allRestaurants = filterRestaurantsByQuery(categoryRestaurants, searchQuery);
  const visibleRestaurants = onlyFreeDelivery
    ? allRestaurants.filter((restaurant) => restaurant.freeDelivery)
    : allRestaurants;

  const toggleCategory = (categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setOnlyFreeDelivery(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <Cuisines activeCategory={selectedCategory} onSelect={toggleCategory} />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex flex-col gap-6 w-full lg:w-[320px] lg:shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800">Son Siparişlerim</h3>
            </div>
            <div className="flex flex-col gap-4">
              {myOrders.length === 0 ? (
                <p className="text-xs text-gray-400">Henüz siparişin yok.</p>
              ) : (
                myOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-800 truncate">{order.restaurantTitle}</p>
                      <p className="text-xs text-gray-400">
                        {formatOrderDate(order.createdAt)} • {order.items.length} ürün
                      </p>
                    </div>
                    <span className="text-sm text-[#E30A17] shrink-0">{formatPrice(order.totalAmount)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-800">Biliyor muydun?</h3>
              <FaCircleQuestion className="w-4 h-4 text-gray-300" />
            </div>
            <div />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800">Filtreler</h3>
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Ücretsiz Teslimat</span>
                <span className="relative inline-flex items-center shrink-0">
                  <input
                    type="checkbox"
                    checked={onlyFreeDelivery}
                    onChange={(e) => setOnlyFreeDelivery(e.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-[#E30A17] transition-colors" />
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {visibleRestaurants.length > 0 ? (
              <>
                <h3 className="text-gray-800 mb-4">Bütün Restoranlar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {visibleRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      searchQuery={searchQuery}
                      selectedCategory={selectedCategory}
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState onReset={resetFilters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsPage;
