import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, MapPin, TrendingUp, Zap } from 'lucide-react';

const MobileDashboard = () => {
  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-24">
      {/* Header Area */}
      <div className="px-6 pt-12 pb-6 bg-white border-b border-gray-100 rounded-b-3xl shadow-sm mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
        <div className="relative z-10 flex justify-between items-end">
          <div>
            <p className="text-sm font-bold text-accent uppercase tracking-wider mb-1">MIDAS Platform</p>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Bozorni<br/>Kashf eting</h1>
          </div>
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shadow-inner border border-gray-100">
            <TrendingUp className="w-6 h-6 text-gray-700" />
          </div>
        </div>
      </div>

      <div className="px-5 space-y-6">
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/discovery" className="bg-white p-5 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center active:scale-95 transition-all group hover:border-accent/20">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <span className="font-bold text-gray-800 text-sm">Izlash</span>
            <span className="text-[10px] text-gray-400 mt-0.5">Aktivlar & Kanallar</span>
          </Link>

          <Link to="/seller/inventory/create" className="bg-accent p-5 rounded-3xl shadow-lg shadow-accent/20 flex flex-col items-center justify-center active:scale-95 transition-all group">
            <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 stroke-[3]" />
            </div>
            <span className="font-bold text-white text-sm">Sotish</span>
            <span className="text-[10px] text-white/70 mt-0.5">E'lon joylash</span>
          </Link>
        </div>

        {/* Highlights Banner */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full blur-3xl translate-x-10 -translate-y-10"></div>
          <Zap className="w-8 h-8 text-yellow-400 mb-3 relative z-10" />
          <h3 className="text-white font-black text-xl mb-1 relative z-10">Tezkor Kelishuvlar</h3>
          <p className="text-gray-400 text-sm relative z-10 leading-relaxed pr-8">Kanal, bot yoki akkauntingizni platforma orqali ishonchli soting. Barchasi xavfsiz.</p>
        </div>

      </div>
    </div>
  );
};

export default MobileDashboard;
