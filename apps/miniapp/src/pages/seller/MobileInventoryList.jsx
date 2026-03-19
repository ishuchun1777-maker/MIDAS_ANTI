import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryApi } from '../../api.js';

export default function MobileInventoryList({ sellerId }) {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const data = await inventoryApi.getMyAssets();
      setAssets(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const typeLabel = {
    instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube',
    telegram_channel: 'Telegram', billboard: 'Billboard', led_monitor: 'LED',
    website: 'Website', other: 'Boshqa',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => navigate('/')} className="text-gray-400 text-sm mb-1">← Orqaga</button>
          <h1 className="text-xl font-black">Mening assetlarim</h1>
        </div>
        <button
          onClick={() => navigate('/seller/asset/new')}
          className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl text-sm active:scale-95"
        >
          + Yangi
        </button>
      </div>

      {loading && (
        <div className="flex justify-center pt-20">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && <p className="text-red-400 text-center text-sm">{error}</p>}

      {!loading && assets.length === 0 && (
        <div className="text-center pt-20">
          <p className="text-4xl mb-4">📦</p>
          <p className="text-gray-400 text-sm">Hali asset yo'q</p>
          <button
            onClick={() => navigate('/seller/asset/new')}
            className="mt-4 bg-yellow-400 text-black font-bold px-6 py-3 rounded-2xl text-sm"
          >
            Birinchi asset qo'shish
          </button>
        </div>
      )}

      <div className="space-y-3">
        {assets.map((asset) => (
          <div
            key={asset.id}
            onClick={() => navigate(`/seller/asset/${asset.id}/edit`)}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 active:scale-95 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-bold text-sm">{asset.title}</p>
                <p className="text-gray-400 text-xs mt-1">{typeLabel[asset.media_type] || asset.media_type}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-lg font-bold ${
                asset.status === 'published'
                  ? 'bg-green-400/20 text-green-400'
                  : 'bg-yellow-400/20 text-yellow-400'
              }`}>
                {asset.status === 'published' ? 'Aktiv' : 'Draft'}
              </span>
            </div>
            {asset.social_link && (
              <p className="text-gray-500 text-xs mt-2 truncate">{asset.social_link}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
