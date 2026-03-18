import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Search, Briefcase, MessageSquare, User, Package } from 'lucide-react';
import MobileInventoryList from './pages/seller/MobileInventoryList';
import MobileAssetForm from './pages/seller/MobileAssetForm';
import MobileDiscovery from './pages/buyer/MobileDiscovery';
import MobileShortlist from './pages/buyer/MobileShortlist';
import { Heart } from 'lucide-react';

function Dashboard() { return <div className="p-6 pb-24"><h1 className="text-2xl font-bold mb-4">Dashboard</h1><div className="bg-white p-4 rounded-xl shadow-sm">Welcome back!</div></div>; }
function Discovery() { return <div className="p-6 pb-24"><h1 className="text-2xl font-bold mb-4">Discovery</h1><div className="bg-white p-4 rounded-xl shadow-sm">Find media assets</div></div>; }
function Deals() { return <div className="p-6 pb-24"><h1 className="text-2xl font-bold mb-4">Deals</h1><div className="bg-white p-4 rounded-xl shadow-sm">Your active deals</div></div>; }
function Messages() { return <div className="p-6 pb-24"><h1 className="text-2xl font-bold mb-4">Messages</h1><div className="bg-white p-4 rounded-xl shadow-sm">Recent chats</div></div>; }
function Profile() { return <div className="p-6 pb-24"><h1 className="text-2xl font-bold mb-4">Profile</h1><div className="bg-white p-4 rounded-xl shadow-sm">Your account</div></div>; }

function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 pb-safe">
      <Link to="/" className="flex flex-col items-center text-gray-500 hover:text-accent">
        <Home className="w-6 h-6" />
        <span className="text-[10px] mt-1">Home</span>
      </Link>
      <Link to="/discovery" className="flex flex-col items-center text-gray-500 hover:text-accent">
        <Search className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-bold">Search</span>
      </Link>
      <Link to="/shortlist" className="flex flex-col items-center text-gray-500 hover:text-accent">
        <Heart className="w-6 h-6" />
        <span className="text-[10px] mt-1 font-bold">Savat</span>
      </Link>
      <Link to="/deals" className="flex flex-col items-center text-gray-500 hover:text-accent">
        <Briefcase className="w-6 h-6" />
        <span className="text-[10px] mt-1">Deals</span>
      </Link>
      <Link to="/messages" className="flex flex-col items-center text-gray-500 hover:text-accent">
        <MessageSquare className="w-6 h-6" />
        <span className="text-[10px] mt-1">Chat</span>
      </Link>
      <Link to="/seller/inventory" className="flex flex-col items-center text-gray-500 hover:text-accent">
        <Package className="w-6 h-6" />
        <span className="text-[10px] mt-1">Assetlar</span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center text-gray-500 hover:text-accent">
        <User className="w-6 h-6" />
        <span className="text-[10px] mt-1">Profil</span>
      </Link>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Check if running inside Telegram
    if (window.Telegram && window.Telegram.WebApp) {
      const WebApp = window.Telegram.WebApp;
      WebApp.ready();
      WebApp.expand();
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/discovery" element={<MobileDiscovery />} />
          <Route path="/shortlist" element={<MobileShortlist />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/seller/inventory" element={<MobileInventoryList />} />
          <Route path="/seller/inventory/create" element={<MobileAssetForm />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;
