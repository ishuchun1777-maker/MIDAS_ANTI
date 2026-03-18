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

function Messages() { return <div className="p-6 pb-24"><h1 className="text-2xl font-bold mb-4">Messages</h1><div className="bg-white p-4 rounded-xl shadow-sm">Barcha yozishmalar tez orada... (Mening kelishuvlarimdan chatni oching)</div></div>; }

// Cleaned up orphaned code

function Profile() { 
  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-24">
      <div className="bg-white p-6 border-b border-gray-100 flex items-center mb-6">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent font-black text-2xl mr-4">M</div>
        <div>
          <h1 className="text-xl font-black text-gray-900 leading-tight">MIDAS User</h1>
          <p className="text-sm text-gray-500 font-medium">Ro'yxatdan o'ting yoki sozlang</p>
        </div>
      </div>
      
      <div className="px-4 space-y-4">
        <Link to="/shortlist" className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50 hover:border-accent/20 transition-all active:scale-95">
          <div className="flex items-center text-gray-700 font-bold"><Heart className="w-5 h-5 mr-3 text-red-500/80" /> Savat (Saqlanganlar)</div>
          <ChevronRight className="w-5 h-5 text-gray-300"/>
        </Link>
        <Link to="/messages" className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50 hover:border-accent/20 transition-all active:scale-95">
          <div className="flex items-center text-gray-700 font-bold"><MessageSquare className="w-5 h-5 mr-3 text-blue-500/80" /> Xabarlar (Chats)</div>
          <ChevronRight className="w-5 h-5 text-gray-300"/>
        </Link>
        <Link to="/deals" className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50 hover:border-accent/20 transition-all active:scale-95">
          <div className="flex items-center text-gray-700 font-bold"><Briefcase className="w-5 h-5 mr-3 text-green-500/80" /> Mening Kelishuvlarim</div>
          <ChevronRight className="w-5 h-5 text-gray-300"/>
        </Link>
        <Link to="/seller/inventory" className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50 hover:border-accent/20 transition-all active:scale-95">
          <div className="flex items-center text-gray-700 font-bold"><Package className="w-5 h-5 mr-3 text-amber-500/80" /> E'lonlarim (Assets)</div>
          <ChevronRight className="w-5 h-5 text-gray-300"/>
        </Link>
      </div>
    </div>
  ); 
}

function BottomNavigation() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around p-2 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.02)] z-50">
      <Link to="/" className={`flex flex-1 flex-col items-center py-2 transition-colors ${isActive('/') ? 'text-accent' : 'text-gray-400 hover:text-gray-600'}`}>
        <Home className={`w-6 h-6 mb-1 ${isActive('/') ? 'fill-accent/20 stroke-2' : 'stroke-[1.5]'}`} />
        <span className="text-[10px] font-bold">Asosiy</span>
      </Link>

      <Link to="/discovery" className={`flex flex-1 flex-col items-center py-2 transition-colors ${isActive('/discovery') ? 'text-accent' : 'text-gray-400 hover:text-gray-600'}`}>
        <Search className={`w-6 h-6 mb-1 ${isActive('/discovery') ? 'fill-accent/20 stroke-2' : 'stroke-[1.5]'}`} />
        <span className="text-[10px] font-bold">Qidiruv</span>
      </Link>
      
      <Link to="/seller/inventory/create" className="flex flex-col items-center justify-center -mt-6">
        <div className="w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/30 border-4 border-gray-50 active:scale-90 transition-transform">
          <Plus className="w-6 h-6 stroke-[3]" />
        </div>
      </Link>

      <Link to="/profile" className={`flex flex-1 flex-col items-center py-2 transition-colors ${isActive('/profile') ? 'text-accent' : 'text-gray-400 hover:text-gray-600'}`}>
        <User className={`w-6 h-6 mb-1 ${isActive('/profile') ? 'fill-accent/20 stroke-2' : 'stroke-[1.5]'}`} />
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
      className="w-full h-full min-h-screen bg-[#fcfcfd]"
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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans overflow-x-hidden relative">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedPage><MobileDashboard /></AnimatedPage>} />
          <Route path="/discovery" element={<AnimatedPage><MobileDiscovery /></AnimatedPage>} />
          <Route path="/shortlist" element={<AnimatedPage><MobileShortlist /></AnimatedPage>} />
          <Route path="/deals" element={<AnimatedPage><MobileDeals /></AnimatedPage>} />
          <Route path="/messages" element={<AnimatedPage><Messages /></AnimatedPage>} />
          <Route path="/messages/:id" element={<AnimatedPage><MobileChat /></AnimatedPage>} />
          <Route path="/seller/inventory" element={<AnimatedPage><MobileInventoryList /></AnimatedPage>} />
          <Route path="/seller/inventory/create" element={<AnimatedPage><MobileAssetForm /></AnimatedPage>} />
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
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
        
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
      <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="font-bold text-gray-500 text-sm">Tizimga kirilmoqda...</span>
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
