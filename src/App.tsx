import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import RestaurantsPage from './pages/RestaurantsPage';
import GelAlPage from './pages/GelAlPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import MainPage from './pages/MainPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import TiklapayWalletPage from './pages/TiklapayWalletPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import CouponDetailPage from './pages/CouponDetailPage';

const App = () => {
  return (
    <Router>
      <Routes>

        <Route element={<Layout />}>

          <Route path="/" element={<MainPage />} />
          <Route path="/sana-gelsin" element={<RestaurantsPage />} />
          <Route path="/gel-al" element={<GelAlPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="/sepetim" element={<CartPage />} />
          <Route path="/odeme" element={<CheckoutPage />} />
          <Route path="/profilim" element={<ProfilePage />} />
          <Route path="/tiklapaycuzdanim" element={<TiklapayWalletPage />} />
          <Route path="/kampanyalar" element={<CampaignsPage />} />
          <Route path="/kampanyalar/:id" element={<CampaignDetailPage />} />
          <Route path="/kuponlar/:code" element={<CouponDetailPage />} />
          <Route path="/tiklagelsin-web" element={<MainPage />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;