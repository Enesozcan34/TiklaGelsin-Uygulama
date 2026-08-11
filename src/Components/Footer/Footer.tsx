import { Link } from 'react-router-dom';
import logoRed from '../../assets/tikla-gelsin-logo-red.png';
import playStoreBadge from '../../assets/play-store-tr.png';
import appStoreBadge from '../../assets/app-store-tr.png';
import qrIcon from '../../assets/qr-icon.png';
import guvenDamgasi from '../../assets/guven-damgasi.png';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaXTwitter, FaTiktok } from 'react-icons/fa6';

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-white w-[90%] max-w-[1200px] mx-auto pt-12 pb-6 rounded-t-[16px] shadow-md mt-auto">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between gap-y-8">
          <div className="flex flex-wrap gap-x-12 gap-y-8">
            <div className="flex flex-col">
              <img src={logoRed} alt="tıkla gelsin" className="h-12 w-auto self-start" />
            </div>

            <div className="flex flex-col gap-3 min-w-[150px]">
              <h3 className=" text-gray-900 text-lg mb-1">Site Haritası</h3>
              <Link to="/" className="text-sm text-gray-600 hover:underline hover:text-[#E30A17]">Anasayfa</Link>
              <Link to="/kampanyalar" className="text-sm text-gray-600 hover:underline hover:text-[#E30A17]">Kampanyalar ve Duyurular</Link>
              <Link to="/profilim" className="text-sm text-gray-600 hover:underline hover:text-[#E30A17]">Profilim</Link>
              <Link to="/blog" className="text-sm text-gray-600 hover:underline hover:text-[#E30A17]">Blog</Link>
              <button type="button" className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#E30A17] text-left">
                Markalar
                <ChevronDown />
              </button>
            </div>

            <div className="flex flex-col gap-3 min-w-[230px]">
              <h3 className=" text-gray-900 text-lg mb-1">Bilgilendirme</h3>
              <Link to="/islem-rehberi" className="text-sm text-gray-600 hover:underline hover:text-[#E30A17]">İşlem Rehberi</Link>
              <button type="button" className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#E30A17] text-left">
                Restoran Kurumsal Sayfalar
                <ChevronDown />
              </button>
              <Link to="/ticari-elektronik-ileti" className="text-sm text-gray-600 hover:underline hover:text-[#E30A17]">Ticari Elektronik İleti Aydınlatma Metni</Link>
              <Link to="/aydinlatma" className="text-sm text-gray-600 hover:underline hover:text-[#E30A17]">KVKK Aydınlatma Metni</Link>
              <Link to="/uyelik-aydinlatma" className="text-sm text-gray-600 hover:underline hover:text-[#E30A17]">Tıkla Gelsin Üyelik Aydınlatma Metni</Link>
              <Link to="/cerez-aydinlatma" className="text-sm text-gray-600 hover:underline hover:text-[#E30A17]">Çerez Aydınlatma Metni</Link>
              <Link to="/bilgi-toplumu-hizmetleri" className="text-sm text-gray-600 hover:underline hover:text-[#E30A17]">Bilgi Toplumu Hizmetleri</Link>
              <Link to="/iletisim" className="text-sm text-gray-600 hover:underline hover:text-[#E30A17]">İletişim</Link>
            </div>

            <div className="flex flex-col gap-3 min-w-[180px]">
              <button type="button" className="flex items-center gap-1 text-gray-900 text-lg mb-1 text-left">
                Sertifikalar
                <ChevronDown />
              </button>
              <p className="text-xs text-gray-500 max-w-[220px]">
                Et ürünlerimiz yerli üreticilerde helal sertifikalı etlerden üretilmektedir.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
  <div aria-label="WhatsApp" className="w-9 h-9 rounded-full bg-[#E30A17] flex justify-center items-center text-white text-sm">
    <FaWhatsapp size={18} />
  </div>
  <div aria-label="Instagram" className="w-9 h-9 rounded-full bg-[#E30A17] flex justify-center items-center text-white text-sm">
    <FaInstagram size={18} />
  </div>
  <div aria-label="Facebook" className="w-9 h-9 rounded-full bg-[#E30A17] flex justify-center items-center text-white text-sm">
    <FaFacebookF size={18} />
  </div>
  <div aria-label="X" className="w-9 h-9 rounded-full bg-[#E30A17] flex justify-center items-center text-white text-sm">
    <FaXTwitter size={18} />
  </div>
  <div aria-label="TikTok" className="w-9 h-9 rounded-full bg-[#E30A17] flex justify-center items-center text-white text-sm">
    <FaTiktok size={18} />
  </div>
</div>
        </div>

        <hr className="border-gray-200 my-8" />

        <div className="flex flex-wrap justify-between items-center gap-6">
          <div className="flex gap-3">
            <img src={playStoreBadge} alt="Google Play'den Alın" className="h-10 w-auto" />
            <img src={appStoreBadge} alt="App Store'dan İndirin" className="h-10 w-auto" />
          </div>

          <div className="flex items-center gap-4">
            <img src={qrIcon} alt="ETBİS'e Kayıtlıdır" className="h-14 w-auto" />
            <img src={guvenDamgasi} alt="TR GO Güven Damgası" className="h-14 w-auto" />
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6">Ata Express 2026. Tüm Hakları Saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;
