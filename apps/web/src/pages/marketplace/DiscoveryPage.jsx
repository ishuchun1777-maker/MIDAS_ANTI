import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  SlidersHorizontal, 
  X,
  Instagram,
  Youtube,
  Music,
  Send,
  Layout,
  Monitor,
  Globe,
  Smartphone,
  Bus,
  Calendar,
  Users
} from 'lucide-react';
import AssetCard from '../../components/AssetCard';

const MEDIA_TYPES = [
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'tiktok', label: 'TikTok', icon: Music },
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'telegram_channel', label: 'Telegram', icon: Send },
  { id: 'billboard', label: 'Billboard', icon: Layout },
  { id: 'led_monitor', label: 'LED Monitor', icon: Monitor },
  { id: 'website', label: 'Website', icon: Globe },
  { id: 'bus_transit', label: 'Bus Advertising', icon: Bus },
];

const DiscoveryPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shortlistedIds, setShortlistedIds] = useState(new Set());
  const [filters, setFilters] = useState({
    query: '',
    media_type: '',
    city: '',
    price_min: '',
    price_max: '',
    page: 1
  });
  const [totalCount, setTotalCount] = useState(0);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchAssets();
    fetchShortlist();
  }, [filters]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.query) params.append('query', filters.query);
      if (filters.media_type) params.append('media_type', filters.media_type);
      if (filters.city) params.append('city', filters.city);
      if (filters.price_min) params.append('price_min', filters.price_min);
      if (filters.price_max) params.append('price_max', filters.price_max);
      params.append('page', filters.page);

      const res = await fetch(`${API_BASE}/discovery/assets?${params.toString()}`);
      const data = await res.json();
      setAssets(data.results || []);
      setTotalCount(data.total_count || 0);
    } catch (error) {
      console.error('Fetch error:', error);
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
      alert('Action failed. Login required?');
    }
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-100 pt-10 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-black text-gray-900 mb-8 tracking-tight">Marketplace</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search assets, sellers, categories..."
                className="w-full h-16 bg-gray-50 border-none rounded-2xl pl-14 pr-6 text-lg font-medium focus:ring-2 focus:ring-accent outline-none shadow-sm transition-all"
                value={filters.query}
                onChange={(e) => setFilters({...filters, query: e.target.value, page: 1})}
              />
            </div>
            <button className="h-16 px-8 bg-gray-900 text-white rounded-2xl font-black flex items-center justify-center hover:bg-accent transition-all active:scale-95 shadow-lg shadow-gray-200">
              <Filter className="w-5 h-5 mr-2" /> Show All
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full lg:w-72 space-y-8 shrink-0">
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Filters</h3>
              {(filters.media_type || filters.city || filters.price_min) && (
                <button 
                  onClick={() => setFilters({query: '', media_type: '', city: '', price_min: '', price_max: '', page: 1})}
                  className="text-accent text-[10px] font-black uppercase hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Media Types */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Platform</label>
                <div className="space-y-1">
                  {MEDIA_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setFilters({...filters, media_type: filters.media_type === type.id ? '' : type.id, page: 1})}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-bold text-sm ${
                        filters.media_type === type.id 
                        ? 'bg-accent text-white shadow-md shadow-accent/20' 
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <type.icon className="w-4 h-4 mr-3" />
                        {type.label}
                      </div>
                      {filters.media_type === type.id && <X className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Price Range ($)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Min"
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold outline-none focus:ring-1 focus:ring-accent"
                    value={filters.price_min}
                    onChange={(e) => setFilters({...filters, price_min: e.target.value, page: 1})}
                  />
                  <span className="text-gray-300">-</span>
                  <input 
                    type="number" 
                    placeholder="Max"
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold outline-none focus:ring-1 focus:ring-accent"
                    value={filters.price_max}
                    onChange={(e) => setFilters({...filters, price_max: e.target.value, page: 1})}
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Location</label>
                <select 
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold outline-none focus:ring-1 focus:ring-accent appearance-none"
                  value={filters.city}
                  onChange={(e) => setFilters({...filters, city: e.target.value, page: 1})}
                >
                  <option value="">Barcha Viloyatlar</option>
                  <option value="Toshkent">Toshkent (Shahar/Viloyat)</option>
                  <option value="Andijon">Andijon</option>
                  <option value="Buxoro">Buxoro</option>
                  <option value="Farg'ona">Farg'ona</option>
                  <option value="Jizzax">Jizzax</option>
                  <option value="Xorazm">Xorazm</option>
                  <option value="Namangan">Namangan</option>
                  <option value="Navoiy">Navoiy</option>
                  <option value="Qashqadaryo">Qashqadaryo</option>
                  <option value="Samarqand">Samarqand</option>
                  <option value="Sirdaryo">Sirdaryo</option>
                  <option value="Surxondaryo">Surxondaryo</option>
                  <option value="Qoraqalpog'iston Respublikasi">Qoraqalpog'iston Resp.</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recommended Placeholder */}
          <div className="bg-accent-bg p-6 rounded-[32px] border border-accent/10">
            <h4 className="text-accent font-black text-xs uppercase tracking-widest mb-2 text-center">Recommended For You</h4>
            <p className="text-[10px] text-accent/60 font-medium text-center italic">Personalized AI matches coming in Sprint 9.</p>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900">
              {loading ? 'Searching...' : `${totalCount} Projects found`}
            </h2>
            <div className="flex items-center text-xs font-bold text-gray-500">
              Sort by: <span className="ml-1 text-gray-900 flex items-center cursor-pointer">Relevance <ChevronDown className="w-3 h-3 ml-1" /></span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="aspect-[4/5] bg-white rounded-[32px] border border-gray-100 animate-pulse"></div>
              ))}
            </div>
          ) : assets.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[32px] border border-gray-100">
              <Layout className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-900 mb-2">No assets found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {assets.map(asset => (
                  <AssetCard 
                    key={asset.id} 
                    asset={asset} 
                    isShortlisted={shortlistedIds.has(asset.id)}
                    onShortlist={handleShortlist}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalCount > filters.page_size && (
                <div className="mt-12 flex justify-center space-x-2">
                  {/* Simplistic pagination for now */}
                  <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center font-bold text-sm text-gray-900 shadow-sm active:scale-90 transition-all">1</button>
                  <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-sm text-gray-400">2</button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default DiscoveryPage;
