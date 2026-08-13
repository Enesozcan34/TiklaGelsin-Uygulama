import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import CampaignsPanel from '../Components/Campaigns/CampaignsPanel';
import CouponsPanel from '../Components/Campaigns/CouponsPanel';

type CampaignsTab = 'kampanyalar' | 'kuponlar';

const TABS: { id: CampaignsTab; label: string }[] = [
  { id: 'kampanyalar', label: 'Kampanyalar' },
  { id: 'kuponlar', label: 'Kuponlar' },
];

const CampaignsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();
  const [activeTab, setActiveTab] = useState<CampaignsTab>('kampanyalar');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setSearchQuery('');
  }, [activeTab]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-white rounded-3xl p-6 flex flex-col gap-5">
        <div className="flex items-center gap-3 border border-gray-200 rounded-[12px] px-5 py-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'kampanyalar' ? 'Kampanya Ara' : 'Kupon Ara'}
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

        <div className="relative flex items-center justify-around border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-semibold transition-colors ${
                activeTab === tab.id ? 'text-[#E30A17]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <span
            className={`absolute -bottom-px h-0.5 w-1/2 bg-[#E30A17] transition-all duration-300 ${
              activeTab === 'kampanyalar' ? 'left-0' : 'left-1/2'
            }`}
          />
        </div>

        {activeTab === 'kampanyalar' ? (
          <CampaignsPanel bare showSearch={false} searchQuery={searchQuery} />
        ) : (
          <CouponsPanel bare showSearch={false} searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;
