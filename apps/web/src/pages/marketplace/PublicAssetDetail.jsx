import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Users, 
  BarChart3, 
  Calendar, 
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';

const PublicAssetDetail = () => {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchAsset();
  }, [id]);

  const fetchAsset = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/inventory/assets/${id}`);
      if (!res.ok) throw new Error('Asset not found');
      const data = await res.json();
      setAsset(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-2xl animate-pulse text-gray-200">LOADING ASSET...</div>;
  if (error || !asset) return <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
    <h2 className="text-3xl font-black mb-4">Oops! Asset not found</h2>
    <Link to="/discovery" className="text-accent underline font-bold">Back to Discovery</Link>
  </div>;

  const basePrice = asset.pricing?.[0]?.base_price || '---';
  const reach = asset.audience?.total_reach?.toLocaleString() || 'N/A';
  const engagement = asset.audience?.avg_engagement_rate ? `${asset.audience.avg_engagement_rate}%` : 'N/A';

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-20">
      {/* Navigation */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/discovery" className="flex items-center text-gray-900 hover:text-accent font-black transition-colors uppercase text-sm tracking-widest">
            <ChevronLeft className="w-5 h-5 mr-2" /> Marketplace
          </Link>
          <div className="flex items-center space-x-4">
            <button className="px-6 py-3 text-sm font-black text-gray-900 hover:bg-gray-50 rounded-2xl transition-all border border-gray-100">Share</button>
            <button className="px-8 py-3 text-sm font-black bg-accent text-white rounded-2xl hover:bg-accent/90 shadow-lg shadow-accent/20 active:scale-95 transition-all">Book Now</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Hero Section */}
          <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-4 py-1.5 bg-accent-bg text-accent text-[10px] font-black rounded-full border border-accent/10 uppercase tracking-widest">
                {asset.media_type.replace('_', ' ')}
              </span>
              <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black rounded-full border border-green-100 flex items-center uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Verified Asset
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-8 tracking-tight">
              {asset.title}
            </h1>

            <p className="text-xl text-gray-500 font-medium leading-relaxed mb-10 max-w-3xl">
              {asset.description}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Reach', value: reach, icon: Users },
                { label: 'Engagement', value: engagement, icon: BarChart3 },
                { label: 'Location', value: asset.regions?.[0]?.city || 'National', icon: MapPin },
                { label: 'Category', value: asset.category || 'General', icon: Info },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100/50">
                  <stat.icon className="w-5 h-5 text-accent mb-3" />
                  <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Formats */}
          <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Available Formats</h2>
            <div className="space-y-4">
              {asset.formats?.length > 0 ? asset.formats.map((format, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-[28px] hover:bg-gray-50/50 transition-all border border-gray-50 group">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-accent-bg rounded-2xl flex items-center justify-center text-accent mr-5 group-hover:scale-110 transition-transform">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block font-black text-gray-900 text-lg uppercase tracking-tight">{format.format_name}</span>
                      <span className="text-xs text-gray-400 font-bold">{format.description || 'Standard placement'}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <span className="block text-2xl font-black text-gray-900">${format.price || basePrice}</span>
                    </div>
                    <button className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all active:scale-90 shadow-sm">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 font-medium italic">No specific formats defined. Contact seller for details.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 sticky top-28">
            <div className="mb-8">
              <span className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Starting from</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-6xl font-black text-gray-900 tracking-tighter">${basePrice}</span>
                <span className="text-gray-400 font-black uppercase text-xs tracking-widest">USD</span>
              </div>
            </div>

            <div className="space-y-5 mb-10">
              {[
                { label: 'Instant Inquiry', icon: MessageCircle },
                { label: 'Secure Transaction', icon: ShieldCheck },
                { label: 'Verified Listing', icon: ShieldCheck },
              ].map((item, i) => (
                <div key={i} className="flex items-center text-gray-600 font-bold text-sm">
                  <item.icon className="w-5 h-5 mr-3 text-accent/40" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-5 bg-accent text-white rounded-[24px] font-black text-lg hover:bg-accent/90 shadow-xl shadow-accent/20 active:scale-[0.98] transition-all mb-4">
              Send Inquiry
            </button>
            <p className="text-center text-[10px] text-gray-400 font-black uppercase tracking-widest">Response time: ~2 hours</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PublicAssetDetail;
