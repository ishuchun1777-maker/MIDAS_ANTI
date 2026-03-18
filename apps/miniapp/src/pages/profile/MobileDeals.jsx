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
      case 'IN_PROGRESS': return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'COMPLETED': return 'text-green-500 bg-green-50 border-green-200';
      case 'CANCELLED': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
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
    <div className="bg-[#fcfcfd] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md p-4 sticky top-0 z-30 border-b border-gray-100 flex items-center shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-900 active:scale-90 transition-transform bg-gray-50 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-black text-gray-900 ml-4 tracking-tight flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-accent" />
          Mening Kelishuvlarim
        </h1>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-400">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-sm">Kelishuvlar yuklanmoqda...</p>
          </div>
        ) : deals.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm mt-8">
            <Briefcase className="w-16 h-16 mx-auto text-gray-200 mb-4" />
            <h3 className="text-lg font-black text-gray-900 mb-2">Kelishuvlar yo'q</h3>
            <p className="text-gray-500 text-sm font-medium">Sizda hozircha hech qanday faol kelishuv yoki tranzaksiya mavjud emas.</p>
          </div>
        ) : (
          deals.map(deal => (
            <div key={deal.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1.5 rounded-xl font-bold text-[10px] flex items-center uppercase tracking-wider border ${getStatusColor(deal.status)}`}>
                  {getStatusIcon(deal.status)}
                  {getStatusText(deal.status)}
                </div>
                <button className="text-gray-400 p-1 bg-gray-50 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <h3 className="font-black text-lg text-gray-900 truncate pr-4">{deal.media_asset?.title || 'Unknown'}</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Platforma: <span className="text-accent">{deal.media_asset?.media_type || 'Platform'}</span></p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4 flex justify-between items-center border border-gray-100">
                <div className="text-xs text-gray-500 font-medium">Kelishilgan narx:</div>
                <div className="text-xl font-black text-gray-900">${deal.price.toLocaleString()}</div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-accent-hover text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                    {deal.buyer?.full_name?.[0] || 'B'}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-xs -ml-2 ring-2 ring-white shadow-sm">
                    {deal.seller?.full_name?.[0] || 'S'}
                  </div>
                </div>
                {deal.status === 'IN_PROGRESS' && (
                  <button onClick={() => navigate(`/messages/${deal.id}`)} className="text-xs font-bold bg-accent text-white px-4 py-2 rounded-[12px] shadow-sm shadow-accent/20 active:scale-95 transition-all">
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
