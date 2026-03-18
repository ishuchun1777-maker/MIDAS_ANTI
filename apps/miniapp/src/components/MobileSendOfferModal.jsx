import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const MobileSendOfferModal = ({ asset, isOpen, onClose }) => {
  const [price, setPrice] = useState(asset?.base_price || '');
  const [message, setMessage] = useState('');
  const [timeline, setTimeline] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[32px] w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl">
        <div className="p-5 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md rounded-t-[32px] z-10 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Send Offer</h2>
          <button onClick={onClose} className="p-2 text-gray-400 bg-gray-50 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {success ? (
          <div className="p-8 pb-12 text-center text-green-600">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black mb-2 tracking-tight">Offer Sent!</h3>
            <p className="text-sm font-medium text-gray-500">The seller will review it soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 pb-8 space-y-5">
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-2xl font-bold text-xs border border-red-100">{error}</div>}
            
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Offer Price (USD)</label>
              <input 
                type="number" 
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-accent/20 focus:border-accent text-lg outline-none transition-all"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Campaign Timeline</label>
              <input 
                type="text" 
                value={timeline}
                onChange={e => setTimeline(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-medium focus:ring-2 focus:ring-accent/20 focus:border-accent text-sm outline-none transition-all"
                placeholder="e.g. Next 2 weeks..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Message / Details</label>
              <textarea 
                required
                rows="4"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-medium focus:ring-2 focus:ring-accent/20 focus:border-accent text-sm outline-none transition-all resize-none"
                placeholder="Describe your goals..."
              />
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full py-4 mt-2 bg-accent text-white rounded-[20px] font-black hover:bg-accent/90 focus:bg-accent/90 active:scale-[0.98] transition-all flex items-center justify-center shadow-xl shadow-accent/20 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Submit Offer'}
              {!loading && <Send className="w-4 h-4 ml-2" />}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default MobileSendOfferModal;
