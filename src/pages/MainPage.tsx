import { Link } from 'react-router-dom';
import { FaLocationDot } from 'react-icons/fa6';
import Cuisines from '../Components/Cuisines/Cuisines';
import playStoreBadge from '../assets/play-store-tr.png';
import appStoreBadge from '../assets/app-store-tr.png';
import campaignBanner from '../assets/landing-pickup-marketing-temp.png';
import appPhones from '../assets/landing-iphones.png';
import qrCode from '../assets/My_PDF.png';
import shopsImg from '../assets/shops.png';
import featureMarkalar from '../assets/landing-card-1.png';
import featureKazan from '../assets/landing-card-2.png';
import featureTakip from '../assets/landing-card-3.png';

interface Feature {
  id: string;
  image: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    id: 'markalar',
    image: featureMarkalar,
    title: 'Sevdiğin markalar burada! Markanı Seç, Siparişini Ver',
    description: "Sevdiğin zincir restoranlar Tıkla Gelsin'de. Hemen siparişini ver, dakikalar içinde sana gelsin!",
  },
  {
    id: 'kazan',
    image: featureKazan,
    title: 'Yedikçe Kazan, Kazandıkça Harca',
    description: 'Yedikçe indirim kazan, kazandıkça dilediğin gibi harca!',
  },
  {
    id: 'takip',
    image: featureTakip,
    title: 'Siparişini Canlı Takip Et, Hızlı Destek Al',
    description:
      'Siparişin yola çıktıktan sonra nerede olduğunu anlık olarak takip et. Siparişinle ilgili bir problem yaşarsan Hızlı Destek yanında!',
  },
];

const MainPage = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Hero */}
      <section className="flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden">
        <div className="flex flex-1 flex-col justify-center gap-6 p-6 sm:p-10 lg:p-14">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl text-gray-600 leading-snug">
              En İyi Lezzetler Burada!
              <br />
              Markanı Seç, Siparişini Ver
            </h1>
            <p className="text-gray-500 text-base sm:text-lg max-w-md">
              Lezzetleri keşfetmeye hazır mısın? Hemen sipariş ver kampanya ve birçok fırsatları yakala!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
            <div className="flex flex-1 items-center gap-2 border border-gray-200 rounded-full px-5 py-3.5">
              <FaLocationDot className="w-4 h-4 text-[#E91D34] shrink-0" />
              <input
                type="text"
                placeholder="Adresini Gir"
                className="flex-1 min-w-0 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
              />
            </div>
            <button
              type="button"
              className="bg-[#E91D34] text-white font-semibold rounded-full px-8 py-3.5 whitespace-nowrap hover:bg-[#CA192D] transition-colors"
            >
              Restoranları Göster!
            </button>
          </div>
        </div>

        {/* Kampanya paneli */}
        <div className="relative flex-1 aspect-[625/440] bg-[#E91D34] overflow-hidden rounded-b-3xl lg:rounded-b-none lg:rounded-r-3xl">
          <img
            src={campaignBanner}
            alt="İlk Gel Al siparişinde ₺100 indirim"
            className="absolute inset-0 w-full h-full object-cover rounded-b-3xl lg:rounded-b-none lg:rounded-r-3xl"
          />
        </div>
      </section>

      {/* Mutfaklar */}
      <Cuisines />

      {/* Özellikler */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {features.map((feature) => (
          <div key={feature.id} className="flex flex-col items-center gap-4 bg-white rounded-3xl p-8 text-center">
            <img src={feature.image} alt={feature.title} className="w-40 h-40 object-contain" />
            <h3 className="text-lg font-semibold text-gray-600">{feature.title}</h3>
            <p className="text-base text-gray-400">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Uygulamayı İndir */}
      <section className="bg-[#E91D34] rounded-3xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8 px-6 sm:px-10 pt-0 pb-0">
          <div className="flex flex-col gap-4 flex-1 text-center md:text-left items-center md:items-start">
            <h2 className="text-3xl sm:text-4xl text-white -mt-2 text-center">Tıkla Gelsin'i İndir!</h2>
            <p className="text-white/80 text-base sm:text-lg">Hemen Tıkla Gelsin'i indir, fırsatları kaçırma!</p>
            <div className="flex gap-3">
              <img src={playStoreBadge} alt="Google Play'den Alın" className="h-11 w-auto" />
              <img src={appStoreBadge} alt="App Store'dan İndirin" className="h-11 w-auto" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center gap-3 w-full">
            <span className="text-white text-base sm:text-lg font-semibold text-center">QR kodu okut, uygulamayı indir</span>
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-xl bg-white p-1.5 flex items-center justify-center">
              <img src={qrCode} alt="QR Kod" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="flex-1 flex justify-center md:self-end">
            <img src={appPhones} alt="Tıkla Gelsin uygulama ekranları" className="max-h-[300px] w-auto object-contain" />
          </div>
        </div>
      </section>

      {/* Restoran Kaydı */}
      <section className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-3xl p-8 sm:p-10">
        <div className="flex flex-col gap-4 flex-1">
          <h2 className="text-2xl sm:text-3xl text-gray-600">
            Restoranını Tıkla Gelsin'e kaydet, ayrıcalıklı ol!
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-md">
            Restoranını Tıkla Gelsin'e kaydederek daha geniş bir kitleye hitap edebilir ve çeşitli avantajlardan
            faydalanabilirsin.
          </p>
          <Link
            to="/basvuru-formu"
            className="self-start bg-[#E91D34] text-white font-semibold rounded-full px-8 py-3.5 hover:bg-[#CA192D] transition-colors"
          >
            Başvuru Formu
          </Link>
        </div>

        <div className="flex-1 flex justify-center">
          <img src={shopsImg} alt="Restoranını Tıkla Gelsin'e kaydet" className="w-auto h-[300px] max-w-full object-contain" />
        </div>
      </section>
    </div>
  );
};

export default MainPage;
