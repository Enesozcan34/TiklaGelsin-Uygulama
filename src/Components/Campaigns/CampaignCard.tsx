import { FaArrowRight } from 'react-icons/fa6';
import type { CampaignItem } from './campaignsData';

interface CampaignCardProps {
  campaign: CampaignItem;
}

const CampaignCard = ({ campaign }: CampaignCardProps) => (
  <div className="flex flex-col border-2 border-gray-200 rounded-3xl p-3 gap-3">
    <div className="flex items-start justify-between gap-2 px-1">
      <h3 className="text-sm font-semibold text-gray-800 leading-snug">{campaign.title}</h3>
      <span className="shrink-0 flex items-center gap-1 text-sm font-semibold text-[#E30A17]">
        Detay <FaArrowRight className="w-3 h-3" />
      </span>
    </div>

    <div
      className={`relative overflow-hidden rounded-2xl h-40 flex items-center justify-between px-5 bg-gradient-to-br ${campaign.gradient}`}
    >
      <div className="text-white max-w-[65%]">
        <p className="text-xl font-extrabold leading-tight">{campaign.headline}</p>
        {campaign.subheadline && <p className="text-sm font-medium opacity-90 mt-1">{campaign.subheadline}</p>}
      </div>
      {campaign.logo && (
        <img
          src={campaign.logo}
          alt={campaign.restaurantTitle}
          className="w-16 h-16 object-contain bg-white rounded-2xl p-2 shrink-0"
        />
      )}
    </div>

    <div className="flex flex-wrap gap-2 px-1">
      {campaign.tags.map((tag) => (
        <span key={tag} className="bg-[#E30A17] text-white text-xs font-semibold rounded-full px-4 py-1.5">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default CampaignCard;
