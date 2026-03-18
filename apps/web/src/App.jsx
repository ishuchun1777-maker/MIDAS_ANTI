import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Search, Briefcase, MessageSquare, User, Package } from 'lucide-react';
import InventoryList from './pages/seller/InventoryList';
import AssetForm from './pages/seller/AssetForm';
import PublicAssetDetail from './pages/marketplace/PublicAssetDetail';
import DiscoveryPage from './pages/marketplace/DiscoveryPage';
import ShortlistPage from './pages/buyer/ShortlistPage';
import { Heart } from 'lucide-react';

function Dashboard() { return <div className="p-8"><h1 className="text-3xl font-bold">Dashboard</h1><p>Welcome to your workspace</p></div>; }
function Discovery() { return <div className="p-8"><h1 className="text-3xl font-bold">Discovery</h1><p>Find the best media assets</p></div>; }
function Deals() { return <div className="p-8"><h1 className="text-3xl font-bold">Deals</h1><p>Active and pending deals</p></div>; }
function Messages() { return <div className="p-8"><h1 className="text-3xl font-bold">Messages</h1><p>Your conversations</p></div>; }
function Profile() { return <div className="p-8"><h1 className="text-3xl font-bold">Profile</h1><p>Manage your account</p></div>; }

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-accent">MIDAS</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-accent-bg hover:text-accent transition-colors">
            <Home className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link to="/discovery" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-accent-bg hover:text-accent transition-colors font-medium">
            <Search className="w-5 h-5 mr-3" /> Discovery
          </Link>
          <Link to="/shortlist" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-accent-bg hover:text-accent transition-colors font-medium">
            <Heart className="w-5 h-5 mr-3" /> Shortlist
          </Link>
          <Link to="/deals" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-accent-bg hover:text-accent transition-colors font-medium">
            <Briefcase className="w-5 h-5 mr-3" /> Deals
          </Link>
          <Link to="/messages" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-accent-bg hover:text-accent transition-colors">
            <MessageSquare className="w-5 h-5 mr-3" /> Messages
          </Link>
          <Link to="/seller/inventory" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-accent-bg hover:text-accent transition-colors">
            <Package className="w-5 h-5 mr-3" /> Inventory
          </Link>
          <Link to="/profile" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-accent-bg hover:text-accent transition-colors">
            <User className="w-5 h-5 mr-3" /> Profile
          </Link>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/discovery" element={<DiscoveryPage />} />
          <Route path="/shortlist" element={<ShortlistPage />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/seller/inventory" element={<InventoryList />} />
          <Route path="/seller/inventory/create" element={<AssetForm />} />
          <Route path="/discovery/:id" element={<PublicAssetDetail />} />
          <Route path="/marketplace/:slug" element={<PublicAssetDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
