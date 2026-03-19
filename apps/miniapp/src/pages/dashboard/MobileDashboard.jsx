import { useNavigate } from 'react-router-dom';

export default function MobileDashboard({ profile }) {
  const navigate = useNavigate();
  const isSeller = !!profile?.seller_profile_id;
  const isBuyer = !!profile?.buyer_profile_id;

  const sellerActions = [
    { label: 'Inventar', icon: '📦', path: '/seller/inventory' },
    { label: 'Offerlar', icon: '📨', path: '/deals' },
  ];

  const buyerActions = [
    { label: 'Discovery', icon: '🔍', path: '/buyer/discovery' },
    { label: 'Shortlist', icon: '❤️', path: '/buyer/shortlist' },
    { label: 'Deallar', icon: '🤝', path: '/deals' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black">MIDAS</h1>
        <p className="text-gray-400 text-sm mt-1">
          {isSeller && isBuyer ? 'Seller & Buyer' : isSeller ? 'Seller' : 'Buyer'}
        </p>
      </div>

      {isSeller && (
        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Seller</p>
          <div className="grid grid-cols-2 gap-3">
            {sellerActions.map((a) => (
              <button
                key={a.path}
                onClick={() => navigate(a.path)}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left active:scale-95 transition-all"
              >
                <div className="text-2xl mb-2">{a.icon}</div>
                <div className="font-bold text-sm">{a.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isBuyer && (
        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Buyer</p>
          <div className="grid grid-cols-2 gap-3">
            {buyerActions.map((a) => (
              <button
                key={a.path}
                onClick={() => navigate(a.path)}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left active:scale-95 transition-all"
              >
                <div className="text-2xl mb-2">{a.icon}</div>
                <div className="font-bold text-sm">{a.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
