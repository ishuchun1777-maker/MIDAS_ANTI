import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, TrendingUp, Zap } from 'lucide-react';

const MobileDashboard = () => {
  return (
    <div className="bg-brand-bg min-h-screen pb-24 text-brand-text">
      {/* Header Area */}
      <div className="px-6 pt-12 pb-6 bg-brand-card border-b border-brand-border rounded-b-3xl shadow-sm mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
        <div className="relative z-10 flex justify-between items-end">
          <div>
            <p className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-1">MIDAS Platform</p>
            <h1 className="text-3xl font-black text-brand-text tracking-tight leading-none">Bozorni<br/>Kashf eting</h1>
          </div>
          <div className="w-12 h-12 bg-brand-bg rounded-2xl flex items-center justify-center border border-brand-border shadow-inner">
            <TrendingUp className="w-6 h-6 text-brand-accent" />
          </div>
        </div>
      </div>

      <div className="px-5 space-y-6">
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/discovery" className="bg-brand-card p-5 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.2)] border border-brand-border flex flex-col items-center justify-center active:scale-95 transition-all group hover:border-brand-primary/50">
            <div className="w-12 h-12 bg-brand-bg rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner border border-brand-border">
              <Search className="w-6 h-6 text-brand-primary" />
            </div>
            <span className="font-bold text-brand-text text-sm mb-1">Izlash</span>
            <span className="text-[10px] text-brand-muted">Aktivlar & Kanallar</span>
          </Link>

          <Link to="/seller/inventory/create" className="bg-brand-primary p-5 rounded-3xl shadow-lg shadow-brand-primary/20 flex flex-col items-center justify-center active:scale-95 transition-all group">
            <div className="w-12 h-12 bg-black/20 text-white rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 stroke-[3]" />
            </div>
            <span className="font-bold text-black text-sm mb-1">Sotish</span>
            <span className="text-[10px] text-black/70">E'lon joylash</span>
          </Link>
        </div>

        {/* Highlights Banner */}
        <div className="bg-gradient-to-br from-brand-card to-brand-bg rounded-3xl p-6 relative overflow-hidden border border-brand-border shadow-xl">
          <div className="absolute right-0 top-0 w-40 h-40 bg-brand-accent/10 rounded-full blur-3xl translate-x-10 -translate-y-10"></div>
          <Zap className="w-8 h-8 text-brand-accent mb-3 relative z-10" />
          <h3 className="text-brand-text font-black text-xl mb-1 relative z-10">Tezkor Kelishuvlar</h3>
          <p className="text-brand-muted text-sm relative z-10 leading-relaxed pr-8">Kanal, bot yoki akkauntingizni platforma orqali ishonchli soting. Barchasi xavfsiz.</p>
        </div>

      </div>
    </div>
  );
};

export default MobileDashboard;
