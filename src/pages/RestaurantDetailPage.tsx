import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  FaBasketShopping,
  FaBurger,
  FaCircleInfo,
  FaCirclePlus,
  FaClock,
  FaClockRotateLeft,
  FaLocationArrow,
  FaMagnifyingGlass,
  FaMinus,
  FaPlus,
  FaRegHeart,
} from 'react-icons/fa6';
import { getMatchingProducts, getRestaurantById, type Product } from '../data/restaurants';
import { cuisines } from '../data/cuisines';
import ProductOptionsModal from '../Components/ProductOptionsModal/ProductOptionsModal';
import useStore from '../store/useStore';

const MENU_TABS = ['Popüler Ürünler', 'Tıkla Gelsin Özel Menüler', '1-2 Kişilik Fırsatlar', '3-4 Kişilik Fırsatlar'];

const formatPrice = (price: number): string => `${price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;

const ProductCard = ({ product, onSelect }: { product: Product; onSelect: (product: Product) => void }) => (
  <div className="flex items-center gap-4 border border-gray-100 rounded-2xl p-3">
    <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
      {product.image ? (
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      ) : (
        <FaBurger className="w-8 h-8 text-gray-300" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-gray-800 text-sm">{product.name}</p>
      <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
      <p className="text-[#E30A17] text-sm mt-1">{formatPrice(product.price)}</p>
    </div>
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="flex items-center gap-1 bg-[#E30A17] text-white text-xs rounded-full px-3 py-2 shrink-0 hover:bg-[#c80914] transition-colors"
    >
      <FaCirclePlus className="w-3.5 h-3.5" />
      Ekle
    </button>
  </div>
);

const CartPanel = () => {
  const { cartItems, updateCartQuantity } = useStore();

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center gap-3">
        <FaBasketShopping className="w-16 h-16 text-gray-200" />
        <h3 className="text-gray-800">Sepetin Boş.</h3>
        <p className="text-sm text-gray-500">Sipariş ver, istediğin yere getirelim.</p>
      </div>
    );
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-4">
      <h3 className="text-gray-800">Sepetim</h3>

      <div className="flex flex-col gap-3">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 truncate">{item.productName}</p>
              <p className="text-xs text-gray-400">
                {formatPrice(item.unitPrice)} x {item.quantity}
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 rounded-full px-1.5 py-1 shrink-0">
              <button
                type="button"
                aria-label="Azalt"
                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#E30A17] hover:text-[#E30A17] transition-colors"
              >
                <FaMinus className="w-2.5 h-2.5" />
              </button>
              <span className="text-xs text-gray-700 w-3 text-center">{item.quantity}</span>
              <button
                type="button"
                aria-label="Artır"
                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#E30A17] hover:text-[#E30A17] transition-colors"
              >
                <FaPlus className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-sm text-gray-500">Toplam</span>
        <span className="text-gray-800">{formatPrice(cartTotal)}</span>
      </div>

      <Link
        to="/sepetim"
        className="bg-[#E30A17] text-white text-sm rounded-full py-3 text-center hover:bg-[#c80914] transition-colors"
      >
        Sepete Git
      </Link>
    </div>
  );
};

const RestaurantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const restaurant = id ? getRestaurantById(id) : undefined;
  const [productQuery, setProductQuery] = useState(() => searchParams.get('q') ?? '');
  const [categoryFilter, setCategoryFilter] = useState(() => searchParams.get('category'));
  const [activeTab, setActiveTab] = useState(MENU_TABS[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (!restaurant) {
    return (
      <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-4 text-center">
        <h2 className="text-lg text-gray-700">Restoran bulunamadı</h2>
        <Link to="/sana-gelsin" className="text-[#E30A17] hover:underline">
          Restoranlara geri dön
        </Link>
      </div>
    );
  }

  const hasSearchQuery = productQuery.trim().length > 0;
  const searchFilteredProducts = hasSearchQuery ? getMatchingProducts(restaurant, productQuery) : restaurant.products;
  const categoryFilteredProducts = categoryFilter
    ? searchFilteredProducts.filter((product) => (product.categories ?? []).includes(categoryFilter))
    : searchFilteredProducts;
  const tabProducts = categoryFilteredProducts.filter((product) => (product.sections ?? [MENU_TABS[0]]).includes(activeTab));
  const categoryLabel = categoryFilter ? cuisines.find((cuisine) => cuisine.id === categoryFilter)?.name ?? categoryFilter : null;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        <div className="bg-white rounded-2xl p-4 flex items-start gap-4 w-full">
          <img
            src={restaurant.image}
            alt={restaurant.title}
            className="w-40 h-40 rounded-2xl object-cover bg-gray-50 border border-gray-100 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                {restaurant.title} ({restaurant.description})
              </h1>
              <button
                type="button"
                aria-label="Yol tarifi"
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-colors"
              >
                <FaLocationArrow className="w-3 h-3" />
              </button>
              <button
                type="button"
                aria-label="Favorilere ekle"
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-[#E30A17] rounded-full p-2 transition-colors"
              >
                <FaRegHeart className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                aria-label="Bilgi"
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-colors"
              >
                <FaCircleInfo className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-gray-500 mt-3 font-semibold">
              <span className="flex items-center gap-1">
                <FaClock className="w-4 h-4" />
                {restaurant.deliveryTime}
              </span>
              <span>Min {restaurant.minimumOrderAmount} ₺</span>
              {restaurant.freeDelivery && <span className="text-green-600">Ücretsiz Teslimat</span>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex flex-col w-full lg:w-[320px] lg:shrink-0">
          <h3 className="text-gray-800 mb-4">Son Siparişlerim</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
            <FaClockRotateLeft className="w-10 h-10 text-gray-200" />
            <p className="text-sm text-gray-500">Son siparişiniz bulunmamaktadır.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex flex-col gap-6 w-full">
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-3 px-4 py-3 border border-gray-100 rounded-full mb-4">
              <FaMagnifyingGlass className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                placeholder="Ürün ara"
                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
              />
            </div>

            {categoryLabel && (
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-2 bg-red-50 text-[#E30A17] text-xs rounded-full px-3 py-1.5">
                  {categoryLabel}
                  <button
                    type="button"
                    aria-label="Kategori filtresini kaldır"
                    onClick={() => setCategoryFilter(null)}
                    className="hover:text-[#c80914]"
                  >
                    ✕
                  </button>
                </span>
              </div>
            )}

            <div className="flex items-center gap-6 overflow-x-auto border-b border-gray-100 pb-3 mb-4">
              {MENU_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 pb-1 text-sm border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-[#E30A17] border-[#E30A17]'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {tabProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tabProducts.map((product) => (
                  <ProductCard key={product.name} product={product} onSelect={setSelectedProduct} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-6">
                {hasSearchQuery || categoryFilter
                  ? 'Aramanızla eşleşen ürün bulunamadı.'
                  : 'Bu kategoride henüz ürün bulunmuyor.'}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full lg:w-[320px] lg:shrink-0">
          <CartPanel />
        </div>
      </div>

      {selectedProduct && (
        <ProductOptionsModal
          product={selectedProduct}
          restaurantId={restaurant.id}
          restaurantTitle={restaurant.title}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default RestaurantDetailPage;
