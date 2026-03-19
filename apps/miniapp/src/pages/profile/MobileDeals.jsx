import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dealApi, offerApi } from '../../api.js';

export default function MobileDeals({ profile }) {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('offers');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [d, o] = await Promise.all([
        dealApi.getAll().catch(() => []),
        offerApi.getAll().catch(() => []),
      ]);
      setDeals(Array.isArray(d) ? d : []);
      setOffers(Array.isArray(o) ? o : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOffer = async (id, action) => {
    try {
      if (action === 'accept') await offerApi.accept(id);
      if (action === 'reject') await offerApi.reject(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const statusColor = {
    pending: 'text-yellow-400',
    accepted: 'text-green-400',
    rejected: 'text-red-400',
    IN_PROGRESS: 'text-blue-400',
    COMPLETED: 'text-green-400',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-6">
      <button onClick={() => navigate('/')} className="text-gray-400 text-sm mb-4">← Orqaga</button>
      <h1 className="text-xl font-black mb-4">Offerlar & Deallar</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {['offers', 'deals'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === t ? 'bg-yellow-400 text-black' : 'bg-white/10 text-gray-400'
            }`}
          >
            {t === 'offers' ? `Offerlar (${offers.length})` : `Deallar (${deals.length})`}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center pt-10">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Offers */}
      {!loading && tab === 'offers' && (
        <div className="space-y-3">
          {offers.length === 0 && (
            <p className="text-gray-400 text-center text-sm pt-10">Offer yo'q</p>
          )}
          {offers.map(offer => (
            <div key={offer.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-sm">${offer.price}</p>
                  <p className="text-gray-400 text-xs mt-1">{offer.deliverables_summary || '—'}</p>
                </div>
                <span className={`text-xs font-bold ${statusColor[offer.status] || 'text-gray-400'}`}>
                  {offer.status}
                </span>
              </div>
              {offer.status === 'pending' && offer.receiver_user_id === profile?.user_id && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOffer(offer.id, 'accept')}
                    className="flex-1 py-2 bg-green-500/20 text-green-400 font-bold rounded-xl text-sm active:scale-95"
                  >
                    Qabul
                  </button>
                  <button
                    onClick={() => handleOffer(offer.id, 'reject')}
                    className="flex-1 py-2 bg-red-500/20 text-red-400 font-bold rounded-xl text-sm active:scale-95"
                  >
                    Rad
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Deals */}
      {!loading && tab === 'deals' && (
        <div className="space-y-3">
          {deals.length === 0 && (
            <p className="text-gray-400 text-center text-sm pt-10">Deal yo'q</p>
          )}
          {deals.map(deal => (
            <div key={deal.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">${deal.price}</p>
                  <p className="text-gray-400 text-xs mt-1">Deal #{deal.id?.slice(0,8)}</p>
                </div>
                <span className={`text-xs font-bold ${statusColor[deal.status] || 'text-gray-400'}`}>
                  {deal.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
