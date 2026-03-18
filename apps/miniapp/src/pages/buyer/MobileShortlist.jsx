import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileAssetCard from '../../components/MobileAssetCard';

const MobileShortlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchShortlist();
  }, []);

  const fetchShortlist = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/shortlist/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
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
      await fetch(`${API_BASE}/shortlist/${assetId}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setItems(prev => prev.filter(item => item.media_asset_id !== assetId));
    } catch (e) {
      alert('Action failed');
    }
  };

  return (
    <div className="p-4 pb-32">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 uppercase">My Shortlist</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Saved for later</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2].map(i => (
            <div key={i} className="h-64 bg-white rounded-3xl border border-gray-100 animate-pulse"></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm px-6">
          <Heart className="w-12 h-12 text-gray-100 mx-auto mb-4" />
          <h3 className="text-lg font-black text-gray-900">List is empty</h3>
          <p className="text-xs text-gray-400 mb-6">Explore the marketplace and save assets you like.</p>
          <Link 
            to="/discovery" 
            className="inline-flex items-center px-6 py-3 bg-accent text-white text-sm font-black rounded-2xl shadow-lg shadow-accent/20"
          >
            Go to Marketplace <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {items.map(item => (
            <MobileAssetCard 
              key={item.id} 
              asset={{
                ...item.asset,
                seller_name: item.asset?.seller_profile?.display_name || "Seller",
                base_price: item.asset?.pricing?.[0]?.base_price
              }}
              isShortlisted={true}
              onShortlist={() => removeItem(item.media_asset_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileShortlist;
