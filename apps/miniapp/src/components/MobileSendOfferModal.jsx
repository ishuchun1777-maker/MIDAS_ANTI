import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const MobileSendOfferModal = ({ asset, isOpen, onClose }) => {
  const [price, setPrice] = useState(asset?.base_price || '');
  const [message, setMessage] = useState('');
  const [timeline, setTimeline] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'https://api-production-35ba.up.railway.app/api/v1';

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token'); 
      const res = await fetch(`${API_BASE}/offers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          media_asset_id: asset.id,
          price: parseFloat(price) || 0,
          currency: 'USD',
          message: message,
          timeline_summary: timeline,
          receiver_user_id: asset.seller_profile?.user_id || asset.seller_id || "00000000-0000-0000-0000-000000000000" // Requires actual logic
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to send offer');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-in fade-in" 
        onClick={onClose} 
      />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-brand-card border-t border-brand-border rounded-t-[32px] w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="p-5 flex items-center justify-between sticky top-0 bg-brand-card/95 backdrop-blur-md rounded-t-[32px] z-10 border-b border-brand-border">
          <h2 className="text-xl font-black text-brand-text tracking-tight">Taklif Yuborish</h2>
          <button onClick={onClose} className="p-2 text-brand-muted bg-brand-bg border border-brand-border rounded-full hover:bg-brand-border hover:text-brand-text transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {success ? (
          <div className="p-8 pb-12 text-center text-brand-primary">
            <div className="w-16 h-16 bg-brand-primary/20 border border-brand-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-xl font-black mb-2 tracking-tight">Taklif Yuborildi!</h3>
            <p className="text-sm font-medium text-brand-muted">Sotuvchi uni tez orada ko'rib chiqadi.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 pb-8 space-y-5">
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-2xl font-bold text-xs border border-red-100">{error}</div>}
            
            <div>
              <label className="block text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1.5">Taklif Narxi (USD)</label>
              <input 
                type="number" 
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full px-4 py-3 bg-brand-bg border border-brand-border text-brand-text rounded-2xl font-bold focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary text-lg outline-none transition-all placeholder-brand-muted/30"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1.5">Muddat (Timeline)</label>
              <input 
                type="text" 
                value={timeline}
                onChange={e => setTimeline(e.target.value)}
                className="w-full px-4 py-3 bg-brand-bg border border-brand-border text-brand-text rounded-2xl font-medium focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary text-sm outline-none transition-all placeholder-brand-muted/30"
                placeholder="Masalan: Keyingi 2 hafta..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1.5">Xabar / Tafsilotlar</label>
              <textarea 
                required
                rows="4"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-brand-bg border border-brand-border text-brand-text rounded-2xl font-medium focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary text-sm outline-none transition-all resize-none placeholder-brand-muted/30"
                placeholder="O'z maqsadingizni yozing..."
              />
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full py-4 mt-2 bg-brand-primary text-black rounded-[20px] font-black hover:bg-brand-primary/90 focus:bg-brand-primary/90 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-brand-primary/20 disabled:opacity-50"
            >
              {loading ? 'Yuborilmoqda...' : 'Taklifni Yuborish'}
              {!loading && <Send className="w-4 h-4 ml-2" />}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default MobileSendOfferModal;
