import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileAssetCard from '../../components/MobileAssetCard';

const MobileShortlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const rawUrl = import.meta.env.VITE_API_URL || 'https://api-production-35ba.up.railway.app';
  const = = rawUrl.endsWith('/api/v1') ? rawUrl : `${rawUrl}/api/v1`;

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
    <div className="p-4 pb-32 bg-brand-bg min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-brand-text uppercase tracking-tight">Saqlanganlar</h1>
        <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest mt-1">Keyinroq ko'rish uchun</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2].map(i => (
            <div key={i} className="h-64 bg-brand-card opacity-50 rounded-3xl border border-brand-border animate-pulse"></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center bg-brand-card rounded-3xl border border-brand-border shadow-[0_4px_20px_rgba(0,0,0,0.2)] px-6">
          <Heart className="w-12 h-12 text-brand-muted opacity-20 mx-auto mb-4" />
          <h3 className="text-lg font-black text-brand-text">Ro'yxat bo'sh</h3>
          <p className="text-xs text-brand-muted mb-6">Bozorni ko'zdan kechiring va yoqqan aktivlarni saqlang.</p>
          <Link 
            to="/discovery" 
            className="inline-flex items-center px-6 py-3 bg-brand-primary text-black text-sm font-black rounded-2xl shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
          >
            Bozorga o'tish <ArrowRight className="w-4 h-4 ml-2" />
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
