import React, { useState, useEffect } from 'react';
import { Plus, Package, ExternalLink, Edit3, Trash2, ShieldCheck, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const InventoryList = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for initial render until API integration is tested
  useEffect(() => {
    const fetchAssets = async () => {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/inventory/assets/mine');
      // const data = await response.json();
      
      const mockData = [
        {
          id: '1',
          title: 'Biznes Auditoriya Telegram Kanal',
          media_type: 'telegram_channel',
          category: 'business',
          status: 'verified',
          visibility: 'public',
          public_slug: 'biznes-kanal',
          created_at: '2024-03-14T10:00:00Z'
        },
        {
          id: '2',
          title: 'Instagram Lifestyle Creator',
          media_type: 'instagram',
          category: 'lifestyle',
          status: 'draft',
          visibility: 'private',
          public_slug: 'lifestyle-insta',
          created_at: '2024-03-13T15:30:00Z'
        }
      ];
      
      setAssets(mockData);
      setLoading(false);
    };

    fetchAssets();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><ShieldCheck className="w-3 h-3 mr-1" /> Verified</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending Review</span>;
      case 'draft':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Draft</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{status}</span>;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="mt-2 text-gray-600">Manage your media assets and advertisement slots.</p>
        </div>
        <Link 
          to="/seller/inventory/create"
          className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all font-medium shadow-sm active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" /> Add New Asset
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      ) : assets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No assets yet</h3>
          <p className="mt-1 text-gray-500">Get started by creating your first media asset listing.</p>
          <div className="mt-6">
            <Link 
              to="/seller/inventory/create"
              className="text-accent hover:underline font-medium"
            >
              Start creation wizard →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div key={asset.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow transition-transform overflow-hidden group">
              <div className="h-2 bg-accent/10 group-hover:bg-accent transition-colors"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-accent-bg p-2 rounded-lg">
                    <Package className="w-5 h-5 text-accent" />
                  </div>
                  {getStatusBadge(asset.status)}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{asset.title}</h3>
                <div className="flex items-center text-sm text-gray-500 space-x-2 mb-4">
                  <span className="capitalize">{asset.media_type.replace('_', ' ')}</span>
                  <span>•</span>
                  <span className="capitalize">{asset.category}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex space-x-3">
                    <button className="p-2 text-gray-400 hover:text-accent transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {asset.visibility === 'public' && (
                    <Link 
                      to={`/marketplace/${asset.public_slug}`}
                      className="inline-flex items-center text-xs font-medium text-accent hover:underline"
                    >
                      <Globe className="w-3 h-3 mr-1" /> View Public
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryList;
