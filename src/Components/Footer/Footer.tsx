import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white w-full py-12 border-t border-gray-200 mt-auto">
      <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-gray-600">

        <div className="flex flex-col gap-4">
          <div className="text-3xl font-extrabold text-[#E30A17]">tıkla gelsin</div>
          <p className="text-sm mt-2">
            Sevdiğin markalar burada! Markanı seç, siparişini ver.
          </p>
          <div className="flex gap-4 mt-4">
            <button className="bg-black text-white px-4 py-2 rounded-md font-bold text-xs flex items-center gap-2">
              Google Play
            </button>
            <button className="bg-black text-white px-4 py-2 rounded-md font-bold text-xs flex items-center gap-2">
              App Store
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Site Haritası</h3>
          <Link to="/" className="text-sm hover:underline hover:text-[#E30A17]">Anasayfa</Link>
          <Link to="/kampanyalar" className="text-sm hover:underline hover:text-[#E30A17]">Kampanyalar ve Duyurular</Link>
          <Link to="/blog" className="text-sm hover:underline hover:text-[#E30A17]">Blog</Link>
          <Link to="/markalar" className="text-sm hover:underline hover:text-[#E30A17]">Markalar</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Bilgilendirme</h3>
          <Link to="/islem-rehberi" className="text-sm hover:underline hover:text-[#E30A17]">İşlem Rehberi</Link>
          <Link to="/kurumsal" className="text-sm hover:underline hover:text-[#E30A17]">Restoran Kurumsal Başvuru</Link>
          <Link to="/aydinlatma" className="text-sm hover:underline hover:text-[#E30A17]">KVKK Aydınlatma Metni</Link>
          <Link to="/iletisim" className="text-sm hover:underline hover:text-[#E30A17]">İletişim</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Sertifikalar</h3>
          <p className="text-xs text-gray-500 mb-4">
            Et ürünlerimiz yerli üreticilerde helal sertifikalı etlerden üretilmektedir.
          </p>
          <div className="flex gap-4 items-center">

            <div className="w-8 h-8 rounded-full bg-[#E30A17] flex justify-center items-center text-white font-bold cursor-pointer hover:scale-110 transition-transform">In</div>
            <div className="w-8 h-8 rounded-full bg-[#E30A17] flex justify-center items-center text-white font-bold cursor-pointer hover:scale-110 transition-transform">Tw</div>
            <div className="w-8 h-8 rounded-full bg-[#E30A17] flex justify-center items-center text-white font-bold cursor-pointer hover:scale-110 transition-transform">Fb</div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;