import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authApi, profileApi, setToken, getToken } from './api.js';

// Pages
import MobileRoleSelection from './pages/onboarding/MobileRoleSelection.jsx';
import MobileDashboard from './pages/dashboard/MobileDashboard.jsx';
import MobileInventoryList from './pages/seller/MobileInventoryList.jsx';
import MobileAssetForm from './pages/seller/MobileAssetForm.jsx';
import MobileDiscovery from './pages/buyer/MobileDiscovery.jsx';
import MobileShortlist from './pages/buyer/MobileShortlist.jsx';
import MobileChat from './pages/buyer/MobileChat.jsx';
import MobileDeals from './pages/profile/MobileDeals.jsx';

function App() {
  const [status, setStatus] = useState('loading'); // loading | onboarding | ready
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      // Telegram auth
      if (window.Telegram?.WebApp?.initData) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        const res = await authApi.telegramLogin(window.Telegram.WebApp.initData);
        if (res.access_token) setToken(res.access_token);
      }

      if (!getToken()) {
        setStatus('onboarding');
        return;
      }

      // Load profile
      const p = await profileApi.getMe();
      setProfile(p);

      const hasRole = p.buyer_profile_id || p.seller_profile_id;
      setStatus(hasRole ? 'ready' : 'onboarding');
    } catch (e) {
      console.error('Init error:', e);
      setStatus('onboarding');
    }
  };

  const onRoleSelected = async () => {
    try {
      const p = await profileApi.getMe();
      setProfile(p);
      setStatus('ready');
    } catch (e) {
      console.error(e);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'onboarding') {
    return <MobileRoleSelection onComplete={onRoleSelected} />;
  }

  const isSeller = !!profile?.seller_profile_id;
  const isBuyer = !!profile?.buyer_profile_id;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MobileDashboard profile={profile} />} />
        {isSeller && (
          <>
            <Route path="/seller/inventory" element={<MobileInventoryList sellerId={profile.seller_profile_id} />} />
            <Route path="/seller/asset/new" element={<MobileAssetForm sellerId={profile.seller_profile_id} />} />
            <Route path="/seller/asset/:id/edit" element={<MobileAssetForm sellerId={profile.seller_profile_id} />} />
          </>
        )}
        {isBuyer && (
          <>
            <Route path="/buyer/discovery" element={<MobileDiscovery buyerId={profile.buyer_profile_id} />} />
            <Route path="/buyer/shortlist" element={<MobileShortlist buyerId={profile.buyer_profile_id} />} />
          </>
        )}
        <Route path="/deals" element={<MobileDeals profile={profile} />} />
        <Route path="/chat/:roomId" element={<MobileChat />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
