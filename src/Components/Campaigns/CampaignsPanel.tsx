import { useState } from 'react';
import { FaTicket } from 'react-icons/fa6';
import { CAMPAIGNS } from './campaignsData';
import CampaignCard from './CampaignCard';

interface CampaignsPanelProps {
  showSearch?: boolean;
  searchQuery?: string;
  bare?: boolean;
}

const CampaignsPanel = ({ showSearch = true, searchQuery: externalQuery, bare = false }: CampaignsPanelProps) => {
  const [internalQuery, setInternalQuery] = useState('');
  const searchQuery = externalQuery ?? internalQuery;

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('tr-TR');
  const filteredCampaigns = normalizedQuery
    ? CAMPAIGNS.filter(
        (campaign) =>
          campaign.title.toLocaleLowerCase('tr-TR').includes(normalizedQuery) ||
          campaign.restaurantTitle.toLocaleLowerCase('tr-TR').includes(normalizedQuery),
      )
    : CAMPAIGNS;

  return (
    <div className={bare ? 'flex flex-col gap-5' : 'bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-5'}>
      {showSearch && (
        <div className="flex items-center gap-3 border border-gray-200 rounded-full px-5 py-3">
          <input
            type="text"
            value={internalQuery}
            onChange={(e) => setInternalQuery(e.target.value)}
            placeholder="Kampanya Ara"
            className="flex-1 min-w-0 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-gray-400 shrink-0"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      )}

      {filteredCampaigns.length === 0 ? (
        <div className="flex flex-col items-center gap-3 text-center py-16">
          <FaTicket className="w-12 h-12 text-gray-200" />
          <h3 className="text-gray-700 font-semibold">Üzgünüz 😔</h3>
          <p className="text-sm text-gray-400">Aramanızla eşleşen kampanya bulunmamaktadır</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignsPanel;
