import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import MainPage from './pages/MainPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import TiklapayWalletPage from './pages/TiklapayWalletPage';
import CampaignsPage from './pages/CampaignsPage';

const App = () => {
  return (
    <Router>
      <Routes>

        <Route element={<Layout />}>

          <Route path="/" element={<MainPage />} />
          <Route path="/sana-gelsin" element={<RestaurantsPage />} />
          <Route path="/gel-al" element={<RestaurantsPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="/sepetim" element={<CartPage />} />
          <Route path="/odeme" element={<CheckoutPage />} />
          <Route path="/profilim" element={<ProfilePage />} />
          <Route path="/tiklapaycuzdanim" element={<TiklapayWalletPage />} />
          <Route path="/kampanyalar" element={<CampaignsPage />} />
          <Route path="/tiklagelsin-web" element={<MainPage />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;