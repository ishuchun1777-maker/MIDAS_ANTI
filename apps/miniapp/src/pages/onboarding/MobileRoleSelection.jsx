import { useState } from 'react';
import { profileApi } from '../../api.js';

const roles = [
  {
    id: 'seller',
    title: 'Seller',
    desc: 'Reklama joylari, kanallar yoki auditoriyangizni taklif qiling',
    icon: '📢',
  },
  {
    id: 'buyer',
    title: 'Buyer',
    desc: 'Biznesingiz uchun eng mos reklama kanalini toping',
    icon: '🎯',
  },
];

export default function MobileRoleSelection({ onComplete }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      if (selected === 'seller') await profileApi.createSeller();
      if (selected === 'buyer') await profileApi.createBuyer();
      onComplete();
    } catch (e) {
      setError(e.message || 'Xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">MIDAS</h1>
        <p className="text-gray-400 mt-2 text-sm">Rolingizni tanlang</p>
      </div>

      <div className="space-y-3 flex-1">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelected(role.id)}
            className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
              selected === role.id
                ? 'border-yellow-400 bg-yellow-400/10'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="text-2xl mb-2">{role.icon}</div>
            <div className="font-bold text-lg">{role.title}</div>
            <div className="text-gray-400 text-sm mt-1">{role.desc}</div>
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}

      <button
        onClick={handleContinue}
        disabled={!selected || loading}
        className="mt-6 w-full py-4 bg-yellow-400 text-black font-black rounded-2xl text-base disabled:opacity-40 transition-all active:scale-95"
      >
        {loading ? 'Yuklanmoqda...' : 'Davom etish'}
      </button>
    </div>
  );
}
