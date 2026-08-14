import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaBurger, FaChevronUp, FaCirclePlus } from 'react-icons/fa6';
import { CAMPAIGNS, getCampaignFaq } from '../Components/Campaigns/campaignsData';
import { getRestaurantById } from '../data/restaurants';
import { formatCouponDate } from '../Components/Campaigns/couponUtils';

const formatPrice = (price: number): string => `${price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;

const CampaignDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const campaign = CAMPAIGNS.find((item) => item.id === id);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const faq = campaign ? getCampaignFaq(campaign) : [];

  if (!campaign) {
    return (
      <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-4 text-center">
        <h2 className="text-lg text-gray-700">Kampanya bulunamadı</h2>
        <Link to="/kampanyalar" className="text-[#E91D34] hover:underline">
          Kampanyalara geri dön
        </Link>
      </div>
    );
  }

  const restaurant = campaign.restaurantId ? getRestaurantById(campaign.restaurantId) : undefined;
  const targetProduct =
    campaign.discount?.targetProductName && restaurant
      ? restaurant.products.find((product) => product.name === campaign.discount?.targetProductName)
      : undefined;

  const ctaHref = targetProduct
    ? `/restaurant/${restaurant?.id}?product=${encodeURIComponent(targetProduct.name)}&campaign=${campaign.id}`
    : restaurant
      ? `/restaurant/${restaurant.id}`
      : null;
  const ctaLabel = targetProduct ? 'Ürünü Görüntüle' : 'Restoranları Görüntüle';

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-white rounded-3xl overflow-hidden">
        <div className="p-4">
          {campaign.bannerImage ? (
            <img
              src={campaign.bannerImage}
              alt={campaign.title}
              className="w-full h-auto rounded-2xl object-cover"
            />
          ) : (
            <div
              className={`relative flex items-start justify-between gap-6 px-8 py-10 rounded-2xl bg-gradient-to-br ${campaign.gradient}`}
            >
              <div className="flex flex-col items-start gap-4 max-w-[75%]">
                <p className="text-white text-2xl sm:text-3xl font-extrabold leading-tight">{campaign.title}</p>
                <span className="bg-white text-gray-900 text-xl sm:text-2xl font-black rounded-full px-6 py-2.5 shadow-lg">
                  {campaign.headline}
                  {campaign.subheadline ? ` ${campaign.subheadline}` : ''}
                </span>
              </div>
              {campaign.logo && (
                <img
                  src={campaign.logo}
                  alt={campaign.restaurantTitle}
                  className="w-20 h-20 object-contain bg-white rounded-2xl p-3 shrink-0"
                />
              )}
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {campaign.tags.map((tag) => (
              <span key={tag} className="bg-[#E91D34] text-white text-xs font-semibold rounded-full px-4 py-1.5">
                {tag}
              </span>
            ))}
          </div>

          <div>
            <h1 className="text-gray-800 text-lg font-semibold">Kampanya Detayı</h1>
            <p className="text-sm text-gray-500 mt-1">{campaign.description ?? campaign.title}</p>
          </div>

          {campaign.validUntil && (
            <div className="flex flex-col gap-0.5 text-sm">
              <span className="text-gray-800 font-semibold">Kampanya Geçerlilik Tarihi</span>
              <span className="text-gray-500">
                {campaign.validFrom ? `${formatCouponDate(campaign.validFrom)} - ` : ''}
                {formatCouponDate(campaign.validUntil)}
              </span>
            </div>
          )}

          {ctaHref && (
            <Link
              to={ctaHref}
              className="self-end bg-[#E91D34] text-white text-sm rounded-full px-6 py-3 hover:bg-[#CA192D] transition-colors"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>

      {targetProduct && ctaHref && (
        <div className="bg-white rounded-3xl p-6 flex flex-col gap-4">
          <h2 className="text-gray-800 text-lg font-semibold">Kampanya Kapsamındaki Ürünler</h2>
          <div className="flex items-center gap-4 border border-gray-100 rounded-2xl p-3">
            <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
              {targetProduct.image ? (
                <img src={targetProduct.image} alt={targetProduct.name} className="w-full h-full object-cover" />
              ) : (
                <FaBurger className="w-8 h-8 text-gray-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 text-sm line-clamp-2">{targetProduct.name}</p>
              <p className="text-[#E91D34] text-sm mt-1">{formatPrice(targetProduct.price)}</p>
            </div>
            <Link
              to={ctaHref}
              className="flex items-center gap-1 bg-[#E91D34] text-white text-xs rounded-full px-3 py-2 shrink-0 hover:bg-[#CA192D] transition-colors"
            >
              <FaCirclePlus className="w-3.5 h-3.5" />
              Ekle
            </Link>
          </div>
        </div>
      )}

      {faq.length > 0 && (
        <div className="bg-white rounded-3xl p-6 flex flex-col gap-4">
          <h2 className="text-gray-800 text-lg font-semibold">Sıkça Sorulan Sorular</h2>
          <div className="flex flex-col gap-3">
            {faq.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={item.question} className="border border-gray-100 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 p-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className={`text-gray-800 text-base ${isOpen ? 'font-semibold' : 'font-normal'}`}>
                      {item.question}
                    </span>
                    <FaChevronUp
                      className={`w-3.5 h-3.5 text-[#E91D34] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-0' : 'rotate-180'
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-500 text-xs leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetailPage;
