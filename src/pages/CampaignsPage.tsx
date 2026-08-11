import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import CouponsPanel from '../Components/Campaigns/CouponsPanel';

const CampaignsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return <CouponsPanel />;
};

export default CampaignsPage;
