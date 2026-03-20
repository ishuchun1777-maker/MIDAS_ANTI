import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { discoveryApi, shortlistApi } from '../../api.js';

const TYPES = [
  { id: '', label: 'Barchasi' },
  { id: 'telegram_channel', label: 'Telegram' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'billboard', label: 'Billboard' },
  { id: 'led_monitor', label: 'LED' },
];

export default function MobileDiscovery() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => { load(); }, [mediaType]);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (query) params.query = query;
      if (mediaType) params.media_type = mediaType;
      const data = await discoveryApi.getAssets(params);
      setAssets(data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  const toggleSave = async (assetId) => {
    try {
      if (savedIds.has(assetId)) {
        setSavedIds(s => { const n = new Set(s); n.delete(assetId); return n; });
      } else {
        await shortlistApi.addItem(assetId);
        setSavedIds(s => new Set([...s, assetId]));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-6">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-white/10">
        <button onClick={() => navigate('/')} className="text-gray-400 text-sm mb-2">← Orqaga</button>
        <h1 className="text-xl font-black mb-3">Discovery</h1>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Qidirish..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-yellow-400"
          />
          <button type="submit" className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl text-sm">
            🔍
          </button>
        </form>

        {/* Type filter */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setMediaType(t.id)}
              className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                mediaType === t.id
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white/10 text-gray-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 pt-4 space-y-3">
        {loading && (
          <div className="flex justify-center pt-16">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && assets.length === 0 && (
          <div className="text-center pt-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-400 text-sm">Natija topilmadi</p>
          </div>
        )}

        {assets.map(asset => (
          <div key={asset.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-bold text-sm">{asset.title}</p>
                <p className="text-gray-400 text-xs mt-1">{asset.seller_name} · {asset.city || 'N/A'}</p>
                <div className="flex gap-3 mt-2">
                  {asset.audience_reach && (
                    <span className="text-xs text-gray-500">👥 {asset.audience_reach.toLocaleString()}</span>
                  )}
                  {asset.engagement_rate && (
                    <span className="text-xs text-gray-500">💫 {asset.engagement_rate}%</span>
                  )}
                  {asset.base_price && (
                    <span className="text-xs text-yellow-400 font-bold">${asset.base_price}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => toggleSave(asset.id)}
                className={`ml-3 text-xl transition-all ${savedIds.has(asset.id) ? 'text-yellow-400' : 'text-gray-600'}`}
              >
                {savedIds.has(asset.id) ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
