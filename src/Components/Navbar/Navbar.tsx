import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 flex flex-col items-center w-full pt-4 pb-2">
      {/* Kırmızı Üst Şerit */}
      <div className="bg-[#E30A17] text-white flex justify-between items-center w-[95%] mx-auto py-6 px-4 sm:px-6 lg:px-8 rounded-3xl relative z-10 shadow-lg">
        <Link to="/" className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
          tıkla gelsin
        </Link>

        {!isLoginPage && (
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/kampanyalar" className="flex items-center gap-2 font-semibold hover:underline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="w-4 h-4">
                <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
              </svg>
              Kampanyalar
            </Link>

            <Link
              to="/login"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 pl-2 pr-6 py-2 rounded-full font-bold transition-colors"
            >
              <span className="bg-white text-[#E30A17] rounded-full p-1.5 flex items-center justify-center">
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
      {!isLoginPage && (
        <div className="bg-white flex justify-center gap-4 sm:gap-8 lg:gap-12 w-[95%] mx-auto pt-12 pb-4 px-4 sm:px-8 rounded-b-[15px] relative z-0 -translate-y-8 shadow-md border-b-2 border-l-2 border-r-2 border-[#E91D34]">
          <Link to="/sana-gelsin" className="text-[#E30A17] font-bold text-[13px] sm:text-[15px] lg:text-[17px] hover:underline whitespace-nowrap">
            Sana Gelsin
          </Link>
          <Link to="/gel-al" className="text-gray-700 font-bold text-[13px] sm:text-[15px] lg:text-[17px] hover:underline whitespace-nowrap">
            Gel Al
          </Link>
          <Link to="/tiklapaycuzdanim" className="text-gray-500 font-bold text-[13px] sm:text-[15px] lg:text-[17px] hover:underline whitespace-nowrap">
            TıklaPay Cüzdanım
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
          className={`absolute top-0 right-0 h-full w-[80%] max-w-xs bg-white flex flex-col p-6 shadow-2xl transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-2xl font-extrabold text-[#E30A17] tracking-tight">tıkla gelsin</span>
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
            className="relative mt-8 flex items-center justify-center gap-2 border border-[#E30A17] text-[#E30A17] font-semibold rounded-full py-3"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="w-4 h-4">
              <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
            </svg>
            Kampanyalar
            <span className="absolute -top-2 -right-2 bg-[#E30A17] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              0
            </span>
          </Link>

          <div className="flex-grow" />

          <Link 
            to="/login"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center gap-2 bg-[#E30A17] text-white font-bold rounded-full py-3 w-full"
          >
            <span className="bg-white text-[#E30A17] rounded-full p-1.5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.761-3.582-5-8-5z" />
              </svg>
            </span>
            Giriş Yap
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
