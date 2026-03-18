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

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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
      
      <div className="mb-4 sticky top-0 z-10 bg-gray-50/90 backdrop-blur-md py-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search channels, bots, groups..."
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold shadow-sm focus:ring-2 focus:ring-accent outline-none"
            value={filters.query}
            onChange={(e) => {
              setFilters({...filters, query: e.target.value});
              setPage(1);
            }}
          />
          {filters.query && (
            <button onClick={() => { setFilters({...filters, query: ''}); setPage(1); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1 bg-gray-100 rounded-full">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 mt-2">
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Marketplace</h2>
        <button 
          onClick={() => setIsFilterModalOpen(true)}
          className="relative p-2.5 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-600 active:scale-95 transition-transform"
        >
          <SlidersHorizontal className="w-5 h-5" />
          {getActiveFiltersCount() > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-sm border-2 border-white">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-64 bg-white rounded-3xl border border-gray-100 animate-pulse"></div>
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <Layout className="w-8 h-8 text-gray-200" />
          </div>
          <h3 className="text-lg font-black text-gray-900">No results found</h3>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
          {getActiveFiltersCount() > 0 && (
            <button 
              onClick={() => {
                setFilters({ query: filters.query, city: '', media_type: '', price_min: '', price_max: '' });
                setPage(1);
                setTimeout(() => fetchAssets(), 100);
              }}
              className="mt-4 text-xs font-bold text-accent py-2 px-4 bg-accent/10 rounded-xl"
            >
              Clear filters
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
