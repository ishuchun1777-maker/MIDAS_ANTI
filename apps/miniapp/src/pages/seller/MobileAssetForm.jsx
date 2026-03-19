import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { inventoryApi } from '../../api.js';

const MEDIA_TYPES = [
  { id: 'telegram_channel', label: 'Telegram Kanal', icon: '✈️' },
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'billboard', label: 'Billboard', icon: '🪧' },
  { id: 'led_monitor', label: 'LED Ekran', icon: '📺' },
  { id: 'website', label: 'Website', icon: '🌐' },
  { id: 'other', label: 'Boshqa', icon: '📱' },
];

const CATEGORIES = [
  'Biznes', 'Ta\'lim', 'Texnologiya', 'Sport', 'Moda',
  'Oziq-ovqat', 'Sog\'liq', 'Ko\'ngilochar', 'Yangiliklar', 'Boshqa',
];

export default function MobileAssetForm({ sellerId }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    media_type: '',
    title: '',
    description: '',
    category: '',
    social_link: '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const canNext = () => {
    if (step === 1) return !!form.media_type;
    if (step === 2) return form.title.length >= 3;
    if (step === 3) return !!form.category;
    return true;
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        seller_profile_id: sellerId,
        status: 'draft',
        visibility: 'public',
      };
      if (isEdit) {
        await inventoryApi.updateAsset(id, payload);
      } else {
        await inventoryApi.createAsset(payload);
      }
      navigate('/seller/inventory');
    } catch (e) {
      setError(e.message || 'Xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-white/10">
        <button onClick={() => step > 1 ? setStep(s => s-1) : navigate('/seller/inventory')}
          className="text-gray-400 text-sm mb-2">← Orqaga</button>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-black">{isEdit ? 'Tahrirlash' : 'Yangi asset'}</h1>
          <span className="text-gray-500 text-sm">{step}/4</span>
        </div>
        {/* Progress */}
        <div className="flex gap-1 mt-3">
          {[1,2,3,4].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-yellow-400' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto pb-32">

        {/* Step 1: Media type */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-black mb-1">Tur tanlang</h2>
            <p className="text-gray-400 text-sm mb-5">Reklama joying qaysi platformada?</p>
            <div className="grid grid-cols-2 gap-3">
              {MEDIA_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => set('media_type', t.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-95 ${
                    form.media_type === t.id
                      ? 'border-yellow-400 bg-yellow-400/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <p className="text-sm font-bold mt-2">{t.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Basic info */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black mb-1">Asosiy ma'lumot</h2>
              <p className="text-gray-400 text-sm mb-5">Asset haqida qisqacha</p>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nomi *</label>
              <input
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Masalan: Biznes Telegram Kanal"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Tavsif</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Asset haqida batafsil..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 resize-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Link / Username</label>
              <input
                value={form.social_link}
                onChange={e => set('social_link', e.target.value)}
                placeholder="https://t.me/username yoki @username"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400"
              />
            </div>
          </div>
        )}

        {/* Step 3: Category */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-black mb-1">Kategoriya</h2>
            <p className="text-gray-400 text-sm mb-5">Qaysi sohaga tegishli?</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => set('category', c)}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all active:scale-95 ${
                    form.category === c
                      ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                      : 'border-white/10 bg-white/5 text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-black mb-1">Tekshiring</h2>
            <p className="text-gray-400 text-sm mb-5">Ma'lumotlarni tasdiqlang</p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tur</span>
                <span className="font-bold">{MEDIA_TYPES.find(t => t.id === form.media_type)?.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Nomi</span>
                <span className="font-bold">{form.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Kategoriya</span>
                <span className="font-bold">{form.category}</span>
              </div>
              {form.social_link && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Link</span>
                  <span className="font-bold truncate max-w-[180px]">{form.social_link}</span>
                </div>
              )}
            </div>
            {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0a] border-t border-white/10">
        {step < 4 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
            className="w-full py-4 bg-yellow-400 text-black font-black rounded-2xl text-base disabled:opacity-30 active:scale-95 transition-all"
          >
            Davom etish
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-4 bg-yellow-400 text-black font-black rounded-2xl text-base disabled:opacity-50 active:scale-95 transition-all"
          >
            {loading ? 'Saqlanmoqda...' : isEdit ? 'Saqlash' : 'Yaratish'}
          </button>
        )}
      </div>
    </div>
  );
}
