import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle2, XCircle, MoreVertical, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// API integrated

const MobileDeals = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
        const res = await fetch(`${API_BASE_URL}/deals/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDeals(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'IN_PROGRESS': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'COMPLETED': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'CANCELLED': return 'text-red-500 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'IN_PROGRESS': return <Clock className="w-4 h-4 mr-1.5" />;
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4 mr-1.5" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'IN_PROGRESS': return 'Jarayonda';
      case 'COMPLETED': return 'Yakunlangan';
      case 'CANCELLED': return 'Bekor qilingan';
      default: return status;
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen pb-24">
      {/* Header */}
      <div className="bg-brand-bg/90 backdrop-blur-md p-4 sticky top-0 z-30 border-b border-brand-border flex items-center shadow-lg">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-brand-text active:scale-90 transition-transform hover:bg-brand-card rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-black text-brand-text ml-4 tracking-tight flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-brand-primary" />
          Mening Kelishuvlarim
        </h1>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-brand-muted">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-sm">Kelishuvlar yuklanmoqda...</p>
          </div>
        ) : deals.length === 0 ? (
          <div className="bg-brand-card rounded-3xl p-8 text-center border border-brand-border shadow-[0_4px_20px_rgba(0,0,0,0.2)] mt-8">
            <Briefcase className="w-16 h-16 mx-auto text-brand-muted opacity-20 mb-4" />
            <h3 className="text-lg font-black text-brand-text mb-2">Kelishuvlar yo'q</h3>
            <p className="text-brand-muted text-sm font-medium">Sizda hozircha hech qanday faol kelishuv yoki tranzaksiya mavjud emas.</p>
          </div>
        ) : (
          deals.map(deal => (
            <div key={deal.id} className="bg-brand-card rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-brand-border active:scale-[0.98] transition-all hover:border-brand-primary/50">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1.5 rounded-xl font-bold text-[10px] flex items-center uppercase tracking-wider border ${getStatusColor(deal.status)}`}>
                  {getStatusIcon(deal.status)}
                  {getStatusText(deal.status)}
                </div>
                <button className="text-brand-muted p-1 bg-brand-bg hover:bg-brand-border rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <h3 className="font-black text-lg text-brand-text truncate pr-4">{deal.media_asset?.title || 'Unknown'}</h3>
                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">Platforma: <span className="text-brand-primary">{deal.media_asset?.media_type || 'Platform'}</span></p>
              </div>
              
              <div className="bg-brand-bg rounded-xl p-4 mb-4 flex justify-between items-center border border-brand-border">
                <div className="text-xs text-brand-muted font-black uppercase tracking-wider">Kelishilgan narx:</div>
                <div className="text-xl font-black text-brand-text">${deal.price.toLocaleString()}</div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-brand-border">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-brand-primary text-black flex items-center justify-center font-bold text-xs ring-2 ring-brand-card shadow-lg z-10">
                    {deal.buyer?.full_name?.[0] || 'B'}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-brand-border text-brand-text flex items-center justify-center font-bold text-xs -ml-2 ring-2 ring-brand-card shadow-lg">
                    {deal.seller?.full_name?.[0] || 'S'}
                  </div>
                </div>
                {deal.status === 'IN_PROGRESS' && (
                  <button onClick={() => navigate(`/messages/${deal.id}`)} className="text-xs font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-[12px] shadow-lg active:scale-95 transition-all hover:bg-brand-primary hover:text-black">
                    Chatni ochish
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MobileDeals;
