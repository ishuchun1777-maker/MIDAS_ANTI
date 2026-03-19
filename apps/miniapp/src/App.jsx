import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { Search, Briefcase, MessageSquare, User, Package, ChevronRight, Plus, Heart, Home, Zap, Star, PlusSquare, User as UserIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import MobileInventoryList from './pages/seller/MobileInventoryList';
import MobileAssetForm from './pages/seller/MobileAssetForm';
import MobileDiscovery from './pages/buyer/MobileDiscovery';
import MobileShortlist from './pages/buyer/MobileShortlist';
import MobileDeals from './pages/profile/MobileDeals';
import MobileChat from './pages/buyer/MobileChat';
import MobileDashboard from './pages/dashboard/MobileDashboard';
import MobileRoleSelection from './pages/onboarding/MobileRoleSelection';

function Messages() { return <div className="p-6 pb-24 bg-brand-bg min-h-screen"><h1 className="text-2xl font-bold mb-4 text-brand-text">Messages</h1><div className="bg-brand-card border border-brand-border text-brand-muted p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)]">Barcha yozishmalar tez orada... (Mening kelishuvlarimdan chatni oching)</div></div>; }

const RoleGate = ({ children, requiredRole }) => {
  const profileIdKey = requiredRole + '_profile_id';
  const profileId = localStorage.getItem(profileIdKey);
  if (!profileId || profileId === "undefined" || profileId === "null") {
    // Redirect logic
    return (
      <div className="bg-brand-bg min-h-screen pb-24 flex items-center justify-center p-6 text-center">
        <div>
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
             <Briefcase className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-brand-text">Ruxsat etilmagan</h2>
          <p className="text-brand-muted mb-6 font-medium text-sm">Siz ushbu bo'limga kirish uchun kerakli roldan ro'yxatdan o'tishingiz kerak.</p>
          <Link to="/role-selection" className="bg-brand-primary text-black px-6 py-3 rounded-2xl font-bold shadow-lg shadow-brand-primary/20 active:scale-95 transition-all">
            Ro'yxatdan o'tish
          </Link>
        </div>
      </div>
    );
  }
  return children;
};


// Cleaned up orphaned code

function Profile() { 
  return (
    <div className="bg-brand-bg min-h-screen pb-24">
      <div className="bg-brand-card/90 backdrop-blur-md p-6 border-b border-brand-border flex items-center mb-6 shadow-lg">
        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-black text-2xl mr-4 border border-brand-primary/20 shadow-lg shadow-brand-primary/10">M</div>
        <div>
          <h1 className="text-xl font-black text-brand-text leading-tight">MIDAS User</h1>
          <p className="text-sm text-brand-muted font-medium">Ro'yxatdan o'ting yoki sozlang</p>
        </div>
      </div>
      
      <div className="px-4 space-y-4">
        <Link to="/shortlist" className="bg-brand-card p-4 rounded-2xl flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-brand-border hover:border-brand-primary/50 transition-all active:scale-[0.98] group">
          <div className="flex items-center text-brand-text font-bold"><Heart className="w-5 h-5 mr-3 text-red-500/80" /> Savat (Saqlanganlar)</div>
          <ChevronRight className="w-5 h-5 text-brand-muted/50 group-hover:text-brand-primary transition-colors"/>
        </Link>
        <Link to="/messages" className="bg-brand-card p-4 rounded-2xl flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-brand-border hover:border-brand-primary/50 transition-all active:scale-[0.98] group">
          <div className="flex items-center text-brand-text font-bold"><MessageSquare className="w-5 h-5 mr-3 text-blue-500/80" /> Xabarlar (Chats)</div>
          <ChevronRight className="w-5 h-5 text-brand-muted/50 group-hover:text-brand-primary transition-colors"/>
        </Link>
        <Link to="/deals" className="bg-brand-card p-4 rounded-2xl flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-brand-border hover:border-brand-primary/50 transition-all active:scale-[0.98] group">
          <div className="flex items-center text-brand-text font-bold"><Briefcase className="w-5 h-5 mr-3 text-green-500/80" /> Mening Kelishuvlarim</div>
          <ChevronRight className="w-5 h-5 text-brand-muted/50 group-hover:text-brand-primary transition-colors"/>
        </Link>
        <Link to="/seller/inventory" className="bg-brand-card p-4 rounded-2xl flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-brand-border hover:border-brand-primary/50 transition-all active:scale-[0.98] group">
          <div className="flex items-center text-brand-text font-bold"><Package className="w-5 h-5 mr-3 text-amber-500/80" /> E'lonlarim (Assets)</div>
          <ChevronRight className="w-5 h-5 text-brand-muted/50 group-hover:text-brand-primary transition-colors"/>
        </Link>
      </div>
    </div>
  ); 
}

function BottomNavigation() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-brand-card/95 backdrop-blur-md border-t border-brand-border flex justify-around p-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50">
      <Link to="/" className={`flex flex-1 flex-col items-center py-2 transition-colors ${isActive('/') ? 'text-brand-primary' : 'text-brand-muted hover:text-brand-text'}`}>
        <Home className={`w-6 h-6 mb-1 ${isActive('/') ? 'fill-brand-primary/20 stroke-2' : 'stroke-[1.5]'}`} />
        <span className="text-[10px] font-bold">Asosiy</span>
      </Link>

      <Link to="/discovery" className={`flex flex-1 flex-col items-center py-2 transition-colors ${isActive('/discovery') ? 'text-brand-primary' : 'text-brand-muted hover:text-brand-text'}`}>
        <Search className={`w-6 h-6 mb-1 ${isActive('/discovery') ? 'fill-brand-primary/20 stroke-2' : 'stroke-[1.5]'}`} />
        <span className="text-[10px] font-bold">Qidiruv</span>
      </Link>
      
      <Link to="/seller/inventory/create" className="flex flex-col items-center justify-center -mt-6">
        <div className="w-14 h-14 bg-brand-primary text-black rounded-full flex items-center justify-center shadow-lg shadow-brand-primary/30 border-4 border-brand-bg active:scale-90 transition-transform hover:bg-brand-primary/90">
          <Plus className="w-6 h-6 stroke-[3]" />
        </div>
      </Link>

      <Link to="/profile" className={`flex flex-1 flex-col items-center py-2 transition-colors ${isActive('/profile') ? 'text-brand-primary' : 'text-brand-muted hover:text-brand-text'}`}>
        <User className={`w-6 h-6 mb-1 ${isActive('/profile') ? 'fill-brand-primary/20 stroke-2' : 'stroke-[1.5]'}`} />
        <span className="text-[10px] font-bold">Profil</span>
      </Link>
    </div>
  );
}

// Utility wrapper for Page Animation
const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full h-full min-h-screen bg-brand-bg"
    >
      {children}
    </motion.div>
  );
};

function AppContent({ startParam }) {
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessedLink = useRef(false);

  useEffect(() => {
    // Process deep linking exactly once on mount
    if (startParam && !hasProcessedLink.current) {
      hasProcessedLink.current = true;
      if (startParam.startsWith('asset_')) {
        const id = startParam.split('_')[1];
        navigate(`/discovery`); 
      } else if (startParam.startsWith('deal_')) {
        const id = startParam.split('_')[1];
        navigate(`/messages/${id}`);
      } else if (startParam === 'inventory') {
        navigate(`/seller/inventory`);
      }
    }
  }, [startParam, navigate]);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans overflow-x-hidden relative selection:bg-brand-primary/30 selection:text-brand-primary">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedPage><MobileDashboard /></AnimatedPage>} />
          <Route path="/role-selection" element={<AnimatedPage><MobileRoleSelection /></AnimatedPage>} />
          <Route path="/discovery" element={<AnimatedPage><MobileDiscovery /></AnimatedPage>} />
          <Route path="/shortlist" element={<AnimatedPage><MobileShortlist /></AnimatedPage>} />
          <Route path="/deals" element={<AnimatedPage><MobileDeals /></AnimatedPage>} />
          <Route path="/messages" element={<AnimatedPage><Messages /></AnimatedPage>} />
          <Route path="/messages/:id" element={<AnimatedPage><MobileChat /></AnimatedPage>} />
          <Route path="/seller/inventory" element={<RoleGate requiredRole="seller"><AnimatedPage><MobileInventoryList /></AnimatedPage></RoleGate>} />
          <Route path="/seller/inventory/create" element={<RoleGate requiredRole="seller"><AnimatedPage><MobileAssetForm /></AnimatedPage></RoleGate>} />
          <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
      <BottomNavigation />
    </div>
  );
}

function App() {
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      let initData = "";
      let isTelegramEnvironment = false;

      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        initData = window.Telegram.WebApp.initData;
        isTelegramEnvironment = true;
      }
      
      try {
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const API_BASE = rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl}/api/v1`;
        
        let reqBody;
        if (isTelegramEnvironment) {
          // Send to telegram endpoint (requires hash verification on backend)
          // Wait, the backend /auth/telegram expects a JSON payload matching TelegramLoginData
          // But actually initData is a query string block, so parsing it is needed if backend expects JSON.
          // Since our backend expects: { id, first_name, last_name, username, photo_url, auth_date, hash }
          // Let's parse initData:
          const urlParams = new URLSearchParams(initData);
          const userStr = urlParams.get('user');
          if (userStr) {
            const userObj = JSON.parse(decodeURIComponent(userStr));
            reqBody = {
              id: userObj.id,
              first_name: userObj.first_name,
              last_name: userObj.last_name || "",
              username: userObj.username || "",
              photo_url: userObj.photo_url || "",
              auth_date: parseInt(urlParams.get('auth_date') || "0"),
              hash: urlParams.get('hash') || ""
            };
          }
        } 
        
        if (reqBody && reqBody.hash) {
          const res = await fetch(`${API_BASE}/auth/telegram`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody)
          });
          if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.access_token);
          }
        } else if (!isTelegramEnvironment && import.meta.env.DEV) {
          // Fallback for Local Browser Testing
          const res = await fetch(`${API_BASE}/auth/dev-login`, {
            method: 'POST'
          });
          if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.access_token);
            console.log("Dev Login Success!");
          }
        }

        // Always check profile status if token exists
        if (localStorage.getItem('token')) {
          try {
            const profileRes = await fetch(`${API_BASE}/profiles/me`, {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (profileRes.ok) {
              const pData = await profileRes.json();
              if (pData.buyer_profile_id) localStorage.setItem('buyer_profile_id', pData.buyer_profile_id);
              if (pData.seller_profile_id) localStorage.setItem('seller_profile_id', pData.seller_profile_id);
              if (pData.specialist_profile_id) localStorage.setItem('specialist_profile_id', pData.specialist_profile_id);
            }
          } catch (e) {
            console.error("Profile check error:", e);
          }
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setIsAuthReady(true);
      }
    };
    
    initAuth();
  }, []);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="font-bold text-brand-muted text-sm tracking-wide">Tizimga kirilmoqda...</span>
        </div>
      </div>
    );
  }

  // Get deep link if present
  const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param || null;

  return (
    <Router>
      <AppContent startParam={startParam} />
    </Router>
  );
}

export default App;
