import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shortlistApi } from '../../api.js';

export default function MobileShortlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const data = await shortlistApi.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      await shortlistApi.removeItem(id);
      setItems(items.filter(i => i.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-6">
      <button onClick={() => navigate('/')} className="text-gray-400 text-sm mb-4">← Orqaga</button>
      <h1 className="text-xl font-black mb-5">Shortlist</h1>

      {loading && (
        <div className="flex justify-center pt-16">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center pt-16">
          <p className="text-4xl mb-3">❤️</p>
          <p className="text-gray-400 text-sm">Shortlist bo'sh</p>
          <button
            onClick={() => navigate('/buyer/discovery')}
            className="mt-4 bg-yellow-400 text-black font-bold px-6 py-3 rounded-2xl text-sm"
          >
            Discoveryga o'tish
          </button>
        </div>
      )}

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <p className="font-bold text-sm">{item.media_asset?.title || 'Asset'}</p>
              <p className="text-gray-400 text-xs mt-1">{item.media_asset?.media_type}</p>
            </div>
            <button
              onClick={() => remove(item.id)}
              className="text-red-400 text-lg active:scale-90 transition-all"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
