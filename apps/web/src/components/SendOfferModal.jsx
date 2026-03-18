import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const SendOfferModal = ({ asset, isOpen, onClose }) => {
  const [price, setPrice] = useState(asset?.pricing?.[0]?.base_price || '');
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
      // NOTE: Normally we pass auth token here. Assuming dummy auth or localStorage token.
      const token = localStorage.getItem('token'); 
      const res = await fetch(`${API_BASE}/offers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          media_asset_id: asset.id,
          price: parseFloat(price) || 0,
          currency: 'USD',
          message: message,
          timeline_summary: timeline,
          receiver_user_id: asset.seller_profile?.user_id // Will be managed backend side if missing
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Send Advertising Offer</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {success ? (
          <div className="p-12 text-center text-green-600">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black mb-2">Offer Sent Successfully!</h3>
            <p className="text-gray-500 font-medium">The seller will review your proposal shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm border border-red-100">{error}</div>}
            
            <div>
              <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Offer Price (USD)</label>
              <input 
                type="number" 
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all outline-none text-xl"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Campaign Timeline</label>
              <input 
                type="text" 
                value={timeline}
                onChange={e => setTimeline(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all outline-none"
                placeholder="e.g. Next 2 weeks, ASAP..."
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Message & Deliverables</label>
              <textarea 
                required
                rows="4"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all outline-none resize-none"
                placeholder="Describe your ad material, goals, and any specific requirements..."
              />
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full py-5 bg-accent text-white rounded-[24px] font-black text-lg hover:bg-accent/90 shadow-xl shadow-accent/20 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Submit Final Offer'}
              {!loading && <Send className="w-5 h-5 ml-3" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SendOfferModal;
