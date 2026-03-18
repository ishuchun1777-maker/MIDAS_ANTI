import React, { useState, useEffect } from 'react';
import { Package, Plus, ChevronRight, Search as SearchIcon, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileInventoryList = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for Mini App
    const fetchAssets = async () => {
      const mockData = [
        {
          id: '1',
          title: 'Biznes Auditoriya Telegram',
          media_type: 'telegram_channel',
          status: 'verified',
          reach: '45k'
        },
        {
          id: '2',
          title: 'Lifestyle Instagram',
          media_type: 'instagram',
          status: 'draft',
          reach: '12k'
        }
      ];
      setAssets(mockData);
      setLoading(false);
    };
    fetchAssets();
  }, []);

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="p-4 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <h1 className="text-xl font-extrabold text-gray-900">Mening Assetlarim</h1>
        <button 
          onClick={() => navigate('/seller/inventory/create')}
          className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/20 active:scale-90 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Qidirish..." 
            className="w-full bg-gray-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-accent outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="px-4 space-y-3">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-2xl"></div>
          ))
        ) : assets.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Hali assetlar yo'q</p>
          </div>
        ) : (
          assets.map((asset) => (
            <div 
              key={asset.id} 
              className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent-bg rounded-xl flex items-center justify-center text-accent">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1">{asset.title}</h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-xs text-gray-500 capitalize">{asset.media_type.replace('_', ' ')}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 capitalize">{asset.reach} reach</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {asset.status === 'verified' && <ShieldCheck className="w-4 h-4 text-green-500" />}
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MobileInventoryList;
