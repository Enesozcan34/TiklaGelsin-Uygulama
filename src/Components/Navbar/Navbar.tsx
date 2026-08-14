import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBagShopping, FaBell, FaCreditCard, FaRegCircleUser } from 'react-icons/fa6';
import useStore from '../../store/useStore';
import logoWhite from '../../assets/tikla-gelsin-logo-white.png';
import logoRed from '../../assets/tikla-gelsin-logo-red.png';
import walletLogo from '../../assets/Wallet2.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userName, addresses, selectedAddressId, selectAddress, searchQuery, setSearchQuery, cartItems } = useStore();
  const [pendingAddressId, setPendingAddressId] = useState(selectedAddressId);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const formattedCartTotal = `${cartTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;
  const isLoginPage = pathname === '/login';
  const isRestaurantsPage = pathname === '/sana-gelsin';
  const isRestaurantDetailPage = pathname.startsWith('/restaurant/');
  const isCartPage = pathname === '/sepetim';
  const isCheckoutPage = pathname === '/odeme';
  const isProfilePage = pathname === '/profilim';
  const isWalletPage = pathname === '/tiklapaycuzdanim';
  const isCampaignsPage = pathname === '/kampanyalar';
  const isCampaignDetailPage = pathname.startsWith('/kampanyalar/');
  const isCouponDetailPage = pathname.startsWith('/kuponlar/');
  const showBackHeader =
    isRestaurantDetailPage ||
    isCartPage ||
    isCheckoutPage ||
    isProfilePage ||
    isCampaignsPage ||
    isCampaignDetailPage ||
    isCouponDetailPage;
  const showCenteredLogo = isCartPage || isCheckoutPage || isCampaignsPage || isCampaignDetailPage || isCouponDetailPage;
  const hideNavActions = isCampaignsPage || isCampaignDetailPage || isCouponDetailPage;
  const showAddressSearchBar = isRestaurantsPage || isRestaurantDetailPage || isProfilePage;
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? addresses[0];

  const toggleAddressDrawer = () => {
    if (!isAddressOpen) {
      setPendingAddressId(selectedAddressId);
    }
    setIsAddressOpen((prev) => !prev);
  };

  const confirmAddress = () => {
    selectAddress(pendingAddressId);
    setIsAddressOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50">
      {/* Kırmızı Üst Şerit */}
      <div
        className={`bg-[#E91D34] text-white flex justify-between items-center w-[90%] max-w-[1200px] mx-auto py-4 px-4 sm:px-6 lg:px-8 relative z-10 ${
          isLoginPage || showBackHeader ? 'rounded-b-[16px]' : ''
        } ${(isLoginPage || showBackHeader) && !isAddressOpen ? 'overflow-hidden' : ''}`}
      >
        {showBackHeader ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-semibold border border-white/60 rounded-full px-4 py-2 hover:bg-white/10 transition-colors shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Geri Dön
          </button>
        ) : isWalletPage ? (
          <Link to="/tiklapaycuzdanim" className="flex items-center gap-2 shrink-0">
            <span className="bg-white rounded-lg w-8 h-8 flex items-center justify-center p-1.5 shrink-0">
              <span
                className="w-full h-full bg-[#E91D34]"
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
            <span className="text-white text-lg whitespace-nowrap">Tıklapay Cüzdanım</span>
          </Link>
        ) : (
          <Link to="/" className="flex items-center">
            <img src={logoWhite} alt="tıkla gelsin" className="h-9 sm:h-10 lg:h-12 w-auto" />
          </Link>
        )}

        {showCenteredLogo && (
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <img src={logoWhite} alt="tıkla gelsin" className="h-9 sm:h-10 lg:h-12 w-auto" />
          </Link>
        )}

        {showAddressSearchBar && (
          <div className="hidden md:flex items-center flex-1 mx-6 max-w-lg h-[3.5rem] rounded-3xl bg-white/25 p-1.75">
          <div className="relative flex flex-1 border-[1px] cursor-pointer border-gray-200 rounded-2xl p-2 items-center justify-between h-full text-xs bg-white text-gray-700">
            <button
              type="button"
              onClick={toggleAddressDrawer}
              className="flex items-center gap-2 pr-3 font-semibold shrink-0 max-w-[220px]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 text-[#E91D34]">
                {selectedAddress.icon === 'home' ? (
                  <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z" />
                ) : (
                  <path d="M4 7V5a2 2 0 012-2h4a2 2 0 012 2v2h4a1 1 0 011 1v11a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1h1zm2 0h4V5H8v2z" />
                )}
              </svg>
              <span className="truncate">
                <span className="text-sm font-bold text-[#E91D34]">{selectedAddress.label}</span>{' '}
                <span className="text-xs font-normal text-gray-500">{selectedAddress.fullAddress}</span>
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 shrink-0 text-gray-400"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {isAddressOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsAddressOpen(false)} />
                <div className="absolute top-full left-0 mt-3 w-96 max-w-[92vw] bg-white rounded-3xl border border-gray-100 z-50 p-5 text-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base">Adres Seç</h3>
                    <button type="button" className="text-[#E91D34] text-sm font-medium hover:underline">
                      Hepsini Gör
                    </button>
                  </div>

                  <div className="flex flex-col gap-2.5 mb-4">
                    {addresses.map((address) => {
                      const isPending = address.id === pendingAddressId;
                      return (
                        <button
                          key={address.id}
                          type="button"
                          onClick={() => setPendingAddressId(address.id)}
                          className={`w-full flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-left transition-colors ${
                            isPending ? 'border-[#E91D34] bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className={`w-4 h-4 shrink-0 ${isPending ? 'text-[#E91D34]' : 'text-gray-400'}`}
                          >
                            {address.icon === 'home' ? (
                              <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z" />
                            ) : (
                              <path d="M4 7V5a2 2 0 012-2h4a2 2 0 012 2v2h4a1 1 0 011 1v11a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1h1zm2 0h4V5H8v2z" />
                            )}
                          </svg>
                          <span className="flex-1 min-w-0">
                            <span className={`block font-semibold text-sm leading-tight ${isPending ? 'text-[#E91D34]' : 'text-gray-800'}`}>
                              {address.label}
                            </span>
                            <span className="block truncate text-xs font-normal leading-tight text-gray-400">{address.fullAddress}</span>
                          </span>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`w-4 h-4 shrink-0 ${isPending ? 'text-[#E91D34]' : 'text-gray-300'}`}
                          >
                            <path d="M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={confirmAddress}
                    className="w-full bg-[#E91D34] text-white text-sm font-semibold rounded-full py-2.5 mb-2.5 hover:bg-[#CA192D] transition-colors"
                  >
                    Seçili Adresi Onayla
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAddressOpen(false);
                      navigate('/profilim', { state: { tab: 'addresses' } });
                    }}
                    className="w-full border border-[#E91D34] text-[#E91D34] text-sm font-semibold rounded-full py-2.5 hover:bg-red-50 transition-colors"
                  >
                    Yeni Adres Ekle
                  </button>
                </div>
              </>
            )}

            <span className="w-px h-6 bg-gray-200 shrink-0" />

            <div className="flex items-center gap-3 pl-3 flex-1 min-w-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Yemek ya da restoran ara"
                className="flex-1 min-w-0 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 shrink-0 text-gray-700">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
          </div>
          </div>
        )}

        {!isLoginPage && !isCartPage && !isCheckoutPage && !hideNavActions && isAuthenticated && (
          <div className="hidden lg:flex items-center gap-6 text-sm">
            <Link to="/kampanyalar" className="relative flex items-center gap-2 hover:underline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="w-4 h-4">
                <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
              </svg>
              Kampanyalar
            </Link>

            {isWalletPage && (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/profilim', { state: { tab: 'cards' } })}
                  className="flex items-center gap-2 hover:underline"
                >
                  <FaCreditCard className="w-4 h-4" />
                  Kartlarım
                </button>

                <button type="button" className="flex items-center gap-2 hover:underline">
                  <FaBell className="w-4 h-4" />
                  Bildirimler
                  <span className="relative -top-2 -ml-1.5 bg-[#E91D34] text-white text-[10px] w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                    7
                  </span>
                </button>
              </>
            )}

            <div className="flex items-center gap-2 bg-white/15 hover:bg-white/25 pl-2 pr-2 py-2 rounded-full transition-colors">
              <button
                type="button"
                aria-label="Profilim"
                onClick={() => navigate('/profilim')}
                className="flex items-center gap-2 pr-2"
              >
                <span className="bg-white text-[#E91D34] rounded-full p-1.5 flex items-center justify-center">
                  <FaRegCircleUser className="w-4 h-4" />
                </span>
                {userName}
              </button>

              {!isWalletPage && (
                <button
                  type="button"
                  aria-label="Sepetim"
                  onClick={() => navigate('/sepetim')}
                  className={`bg-white text-[#E91D34] rounded-full flex items-center gap-2 ${
                    cartItems.length > 0 ? 'pl-3 pr-4 py-3' : 'p-3 justify-center'
                  }`}
                >
                  <FaBagShopping className="w-4 h-4" />
                  {cartItems.length > 0 && <span className="font-semibold whitespace-nowrap">{formattedCartTotal}</span>}
                </button>
              )}
            </div>
          </div>
        )}

        {!isLoginPage && !isCartPage && !isCheckoutPage && !hideNavActions && !isAuthenticated && (
          <div className="hidden lg:flex items-center gap-6 text-sm">
            <Link to="/kampanyalar" className="flex items-center gap-2 font-semibold hover:underline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="w-4 h-4">
                <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
              </svg>
              Kampanyalar
            </Link>

            <Link
              to="/login"
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 pl-2 pr-6 py-2 rounded-full font-bold transition-colors"
            >
              <span className="bg-white text-[#E91D34] rounded-full p-1.5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.761-3.582-5-8-5z" />
                </svg>
              </span>
              Giriş Yap
            </Link>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden p-2 -mr-2"
          aria-label="Menüyü aç"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-7 h-7">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Beyaz Alt Sekmeler */}
      {isLoginPage || showBackHeader ? (
        <div className="h-8 w-[90%] max-w-[1200px] mx-auto" aria-hidden="true" />
      ) : (
        <div className="flex justify-start gap-8 bg-white w-[90%] max-w-[1200px] mx-auto pt-10 pb-3 px-4 sm:px-8 rounded-b-[15px] relative z-0 -translate-y-6 border-b border-l border-r border-[#E91D34]">
          <Link
            to="/sana-gelsin"
            className={`text-[14px] sm:text-[15px] lg:text-[17px] hover:underline whitespace-nowrap ${
              pathname === '/sana-gelsin' ? 'text-[#E91D34]' : 'text-gray-500'
            }`}
          >
            Sana Gelsin
          </Link>
          <Link
            to="/gel-al"
            className={`text-[14px] sm:text-[15px] lg:text-[17px] hover:underline whitespace-nowrap ${
              pathname === '/gel-al' ? 'text-[#E91D34]' : 'text-gray-500'
            }`}
          >
            Gel Al
          </Link>
          <Link
            to="/tiklapaycuzdanim"
            className={`text-[14px] sm:text-[15px] lg:text-[17px] hover:underline whitespace-nowrap ${
              isWalletPage ? 'text-[#E91D34]' : 'text-gray-500'
            }`}
          >
            Tıklapay Cüzdanım
          </Link>
        </div>
      )}

      {/* Arka Plan + Sağdan Kayan Panel */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setIsMenuOpen(false)} />

        <div
          className={`absolute top-0 right-0 h-full w-[80%] max-w-xs bg-white flex flex-col p-6 transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center">
            <img src={logoRed} alt="tıkla gelsin" className="h-8 w-auto" />
            <button type="button" onClick={() => setIsMenuOpen(false)} aria-label="Menüyü kapat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-6 h-6 text-gray-700">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>

          <Link
            to="/kampanyalar"
            onClick={() => setIsMenuOpen(false)}
            className="relative mt-8 flex items-center justify-center gap-2 border border-[#E91D34] text-[#E91D34] font-semibold rounded-full py-3"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="w-4 h-4">
              <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
            </svg>
            Kampanyalar
            <span className="absolute -top-2 -right-2 bg-[#E91D34] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              0
            </span>
          </Link>

          <div className="flex-grow" />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Profilim"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/profilim');
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#E91D34] text-white font-bold rounded-full py-3"
              >
                <span className="bg-white text-[#E91D34] rounded-full p-1.5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.761-3.582-5-8-5z" />
                  </svg>
                </span>
                {userName}
              </button>
              <button
                type="button"
                aria-label="Sepetim"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/sepetim');
                }}
                className={`bg-[#E91D34] text-white rounded-full flex items-center gap-2 ${
                  cartItems.length > 0 ? 'pl-3.5 pr-4 py-3.5' : 'p-3.5 justify-center'
                }`}
              >
                <FaBagShopping className="w-4 h-4" />
                {cartItems.length > 0 && <span className="font-bold whitespace-nowrap">{formattedCartTotal}</span>}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#E91D34] text-white font-bold rounded-full py-3 w-full"
            >
              <span className="bg-white text-[#E91D34] rounded-full p-1.5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.761-3.582-5-8-5z" />
                </svg>
              </span>
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
