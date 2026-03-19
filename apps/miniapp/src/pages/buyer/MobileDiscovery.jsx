import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Layout, X } from 'lucide-react';
import MobileAssetCard from '../../components/MobileAssetCard';
import MobileFilterModal from '../../components/MobileFilterModal';

const MobileDiscovery = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shortlistedIds, setShortlistedIds] = useState(new Set());
  
  const [filters, setFilters] = useState(() => {
    const saved = sessionStorage.getItem('discoveryFilters');
    if (saved) return JSON.parse(saved);
    return {
      query: '',
      city: '',
      media_type: '',
      price_min: '',
      price_max: ''
    };
  });
  
  const [page, setPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'https://api-production-35ba.up.railway.app/api/v1';

  useEffect(() => {
    sessionStorage.setItem('discoveryFilters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    fetchAssets();
    fetchShortlist();
  }, [filters.query, page]); 
  // For other filters, fetch on apply

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page });
      if (filters.query) p.append('query', filters.query);
      if (filters.city) p.append('city', filters.city);
      if (filters.media_type) p.append('media_type', filters.media_type);
      if (filters.price_min) p.append('price_min', filters.price_min);
      if (filters.price_max) p.append('price_max', filters.price_max);

      const res = await fetch(`${API_BASE}/discovery/assets?${p.toString()}`);
      const data = await res.json();
      setAssets(data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchShortlist = async () => {
    try {
      const res = await fetch(`${API_BASE}/shortlist/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setShortlistedIds(new Set(data.map(item => item.media_asset_id)));
    } catch (e) {}
  };

  const handleShortlist = async (assetId) => {
    const isAdding = !shortlistedIds.has(assetId);
    try {
      if (isAdding) {
        await fetch(`${API_BASE}/shortlist/`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ media_asset_id: assetId })
        });
        setShortlistedIds(prev => new Set([...prev, assetId]));
      } else {
        await fetch(`${API_BASE}/shortlist/${assetId}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const next = new Set(shortlistedIds);
        next.delete(assetId);
        setShortlistedIds(next);
      }
    } catch (e) {
      alert('Login required');
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.city) count++;
    if (filters.media_type) count++;
    if (filters.price_min || filters.price_max) count++;
    return count;
  };

  return (
    <div className="p-4 pb-32">
      <MobileFilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={() => { setPage(1); fetchAssets(); }}
      />
      
      <div className="mb-4 sticky top-0 z-10 bg-brand-bg/90 backdrop-blur-md py-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input 
            type="text" 
            placeholder="Izlash (kanal, bot, guruh...)"
            className="w-full bg-brand-card text-brand-text border border-brand-border rounded-2xl py-4 pl-12 pr-12 text-sm font-bold shadow-[0_4px_24px_rgba(0,0,0,0.2)] focus:ring-2 focus:ring-brand-primary outline-none focus:border-transparent transition-all"
            value={filters.query}
            onChange={(e) => {
              setFilters({...filters, query: e.target.value});
              setPage(1);
            }}
          />
          {filters.query && (
            <button onClick={() => { setFilters({...filters, query: ''}); setPage(1); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text p-1 bg-brand-border rounded-full hover:bg-brand-muted/30">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 mt-2">
        <h2 className="text-xl font-black text-brand-text uppercase tracking-tight">Marketplace</h2>
        <button 
          onClick={() => setIsFilterModalOpen(true)}
          className="relative p-2.5 bg-brand-card rounded-xl border border-brand-border shadow-[0_4px_20px_rgba(0,0,0,0.2)] text-brand-text hover:border-brand-primary active:scale-95 transition-all group"
        >
          <SlidersHorizontal className="w-5 h-5 group-hover:text-brand-primary transition-colors" />
          {getActiveFiltersCount() > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-primary text-black rounded-full flex items-center justify-center text-[10px] font-black shadow-lg border-2 border-brand-card">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-64 bg-brand-card/50 rounded-3xl border border-brand-border animate-pulse"></div>
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-brand-card rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-border shadow-inner">
            <Layout className="w-8 h-8 text-brand-muted" />
          </div>
          <h3 className="text-lg font-black text-brand-text">Aktivlar topilmadi</h3>
          <p className="text-xs text-brand-muted mt-1">Filterlarni o'zgartirib ko'ring</p>
          {getActiveFiltersCount() > 0 && (
            <button 
              onClick={() => {
                setFilters({ query: filters.query, city: '', media_type: '', price_min: '', price_max: '' });
                setPage(1);
                setTimeout(() => fetchAssets(), 100);
              }}
              className="mt-4 text-xs font-bold text-brand-primary py-2 px-4 bg-brand-primary/10 border border-brand-primary/20 rounded-xl hover:bg-brand-primary/20 transition-all font-bold"
            >
              Filterlarni tozalash
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {assets.map(asset => (
            <MobileAssetCard 
              key={asset.id} 
              asset={asset}
              isShortlisted={shortlistedIds.has(asset.id)}
              onShortlist={handleShortlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileDiscovery;
