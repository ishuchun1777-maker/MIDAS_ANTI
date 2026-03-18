import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ArrowRight, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import AssetCard from '../../components/AssetCard';

const ShortlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchShortlist();
  }, []);

  const fetchShortlist = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/shortlist/`);
      const data = await res.json();
      setItems(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (assetId) => {
    try {
      await fetch(`${API_BASE}/shortlist/${assetId}`, { method: 'DELETE' });
      setItems(prev => prev.filter(item => item.media_asset_id !== assetId));
    } catch (e) {
      alert('Delete failed');
    }
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2">My Shortlist</h1>
          <p className="text-gray-500 font-medium">Safe and manage the assets you're interested in.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="h-96 bg-white rounded-[32px] animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[32px] border border-gray-100 shadow-sm">
            <Heart className="w-16 h-16 text-gray-100 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-gray-900 mb-4">Your list is empty</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Start browsing the marketplace and save assets that catch your eye.</p>
            <Link 
              to="/discovery" 
              className="inline-flex items-center px-8 py-4 bg-accent text-white font-black rounded-2xl hover:bg-accent/90 transition-all active:scale-95 shadow-lg shadow-accent/20"
            >
              Browse Marketplace <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map(item => (
              <div key={item.id} className="relative">
                <AssetCard 
                  asset={{
                    ...item.asset,
                    // Map backend response fields to what AssetCard expects if needed
                    seller_name: item.asset?.seller_profile?.display_name || "Seller",
                    base_price: item.asset?.pricing?.[0]?.base_price
                  }}
                  isShortlisted={true}
                  onShortlist={() => removeItem(item.media_asset_id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortlistPage;
