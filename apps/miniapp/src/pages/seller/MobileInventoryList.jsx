import React, { useState, useEffect } from 'react';
import { Package, Plus, ChevronRight, Search as SearchIcon, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileInventoryList = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
        const res = await fetch(`${API_BASE_URL}/inventory/assets/mine`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          // Map to match UI expected fields if necessary, or pass raw
          setAssets(data);
        } else {
          console.error("Failed to fetch assets");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  return (
    <div className="pb-20 bg-brand-bg min-h-screen">
      {/* Header */}
      <div className="p-4 flex justify-between items-center sticky top-0 bg-brand-bg/90 backdrop-blur-md z-10 border-b border-brand-border">
        <h1 className="text-xl font-extrabold text-brand-text tracking-tight">Mening Assetlarim</h1>
        <button 
          onClick={() => navigate('/seller/inventory/create')}
          className="w-10 h-10 bg-brand-primary text-black rounded-full flex items-center justify-center shadow-lg shadow-brand-primary/20 active:scale-90 transition-transform hover:bg-brand-primary/90"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-4 mt-2">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input 
            type="text" 
            placeholder="Qidirish..." 
            className="w-full bg-brand-card text-brand-text border border-brand-border rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-brand-primary outline-none focus:border-transparent transition-all placeholder-brand-muted/50 shadow-inner"
          />
        </div>
      </div>

      {/* List */}
      <div className="px-4 space-y-3">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-brand-card border border-brand-border opacity-50 animate-pulse rounded-2xl"></div>
          ))
        ) : assets.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="w-12 h-12 text-brand-muted opacity-50 mx-auto mb-3" />
            <p className="text-brand-muted font-bold">Hali assetlar yo'q</p>
          </div>
        ) : (
          assets.map((asset) => (
            <div 
              key={asset.id} 
              className="bg-brand-card p-4 rounded-2xl border border-brand-border flex items-center justify-between active:scale-[0.98] active:bg-brand-bg transition-all hover:border-brand-primary/50 shadow-[0_4px_20px_rgba(0,0,0,0.1)] group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary border border-brand-primary/20">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text line-clamp-1">{asset.title}</h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">{asset.media_type.replace('_', ' ')}</span>
                    <span className="text-xs text-brand-border">•</span>
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">{asset.reach} reach</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {asset.status === 'verified' && <ShieldCheck className="w-4 h-4 text-green-500" />}
                <ChevronRight className="w-5 h-5 text-brand-muted/50 group-hover:text-brand-primary transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MobileInventoryList;
