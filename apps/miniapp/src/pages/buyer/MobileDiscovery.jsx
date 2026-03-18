import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Layout, X } from 'lucide-react';
import MobileAssetCard from '../../components/MobileAssetCard';

const MobileDiscovery = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shortlistedIds, setShortlistedIds] = useState(new Set());
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchAssets();
    fetchShortlist();
  }, [query, page]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const q = query ? `&query=${encodeURIComponent(query)}` : '';
      const res = await fetch(`${API_BASE}/discovery/assets?page=${page}${q}`);
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
      const res = await fetch(`${API_BASE}/shortlist/`);
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ media_asset_id: assetId })
        });
        setShortlistedIds(prev => new Set([...prev, assetId]));
      } else {
        await fetch(`${API_BASE}/shortlist/${assetId}`, { method: 'DELETE' });
        const next = new Set(shortlistedIds);
        next.delete(assetId);
        setShortlistedIds(next);
      }
    } catch (e) {
      alert('Login required');
    }
  };

  return (
    <div className="p-4 pb-32">
      <div className="mb-6 sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md py-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search channels, bots, groups..."
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold shadow-sm focus:ring-2 focus:ring-accent outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Marketplace</h2>
        <button className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-600">
          <SlidersHorizontal className="w-5 h-5" />
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
          <h3 className="text-lg font-black text-gray-900">No results</h3>
          <p className="text-xs text-gray-400">Try common keywords like 'Business'</p>
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
