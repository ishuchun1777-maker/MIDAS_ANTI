import React from 'react';
import { X } from 'lucide-react';

const REGIONS = [
  { id: '', label: 'Barchasi' },
  { id: 'Toshkent', label: 'Toshkent' },
  { id: 'Andijon', label: 'Andijon' },
  { id: 'Buxoro', label: 'Buxoro' },
  { id: "Farg'ona", label: "Farg'ona" },
  { id: 'Jizzax', label: 'Jizzax' },
  { id: 'Xorazm', label: 'Xorazm' },
  { id: 'Namangan', label: 'Namangan' },
  { id: 'Navoiy', label: 'Navoiy' },
  { id: 'Qashqadaryo', label: 'Qashqadaryo' },
  { id: 'Samarqand', label: 'Samarqand' },
  { id: 'Sirdaryo', label: 'Sirdaryo' },
  { id: 'Surxondaryo', label: 'Surxondaryo' },
  { id: "Qoraqalpog'iston Respublikasi", label: 'Qoraqalpog\'iston' }
];

const MEDIA_TYPES = [
  { id: '', label: 'Barchasi' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'telegram_channel', label: 'Telegram' },
  { id: 'billboard', label: 'Billboard' },
  { id: 'led_monitor', label: 'LED Monitor' },
  { id: 'website', label: 'Website' },
  { id: 'bus_transit', label: 'Avtobus reklamasi' },
];

const MobileFilterModal = ({ isOpen, onClose, filters, setFilters, onApply }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-in fade-in" 
        onClick={onClose} 
      />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-brand-card border-t border-brand-border rounded-t-[32px] w-full max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="p-4 flex items-center justify-between sticky top-0 bg-brand-card/95 backdrop-blur-md rounded-t-[32px] z-10 border-b border-brand-border flex-shrink-0">
          <h2 className="text-lg font-black text-brand-text tracking-tight ml-2">Filtrlash</h2>
          <div className="flex items-center space-x-2">
             <button 
                onClick={() => setFilters({ ...filters, city: '', media_type: '', price_min: '', price_max: '' })}
                className="text-[11px] font-bold text-brand-text px-3 py-2 bg-brand-bg border border-brand-border rounded-xl active:scale-95 transition-all"
             >
                Tozalash
             </button>
             <button 
                onClick={() => { onApply(); onClose(); }}
                className="text-[11px] font-black text-black px-3 py-2 bg-brand-primary shadow-lg shadow-brand-primary/20 rounded-xl active:scale-95 transition-all"
             >
                Saqlash
             </button>
             <button onClick={onClose} className="p-1.5 text-brand-muted bg-brand-bg border border-brand-border rounded-full hover:bg-brand-border transition-colors ml-1">
               <X className="w-5 h-5" />
             </button>
          </div>
        </div>
        
        <div className="p-5 pb-20 overflow-y-auto flex-1 space-y-6">
          {/* Viloyat */}
          <div>
            <label className="block text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2.5">Viloyat (Hudud)</label>
            <select 
              value={filters.city} 
              onChange={(e) => setFilters({...filters, city: e.target.value})}
              className="w-full px-4 py-3.5 border border-brand-border bg-brand-bg rounded-2xl font-bold text-sm text-brand-text outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all focus:bg-brand-card"
            >
              {REGIONS.map(r => <option key={r.id} value={r.id} className="bg-brand-card text-brand-text">{r.label}</option>)}
            </select>
          </div>

          {/* Platforma */}
          <div>
            <label className="block text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2.5">Platforma</label>
            <div className="flex flex-wrap gap-2">
              {MEDIA_TYPES.map(t => (
                <button 
                  key={t.id}
                  onClick={() => setFilters({...filters, media_type: t.id})}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                    filters.media_type === t.id 
                    ? 'bg-brand-primary border-brand-primary text-black shadow-lg shadow-brand-primary/20' 
                    : 'bg-brand-card border-brand-border text-brand-text hover:bg-brand-bg hover:border-brand-muted/40'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Narx */}
          <div>
            <label className="block text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2.5">Narx oralig'i (USD)</label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                placeholder="Min"
                value={filters.price_min}
                onChange={(e) => setFilters({...filters, price_min: e.target.value})}
                className="w-full px-4 py-3.5 bg-brand-bg border border-brand-border rounded-2xl font-bold text-brand-text focus:bg-brand-card focus:ring-2 focus:ring-brand-primary/50 text-sm outline-none transition-all"
              />
              <span className="text-brand-muted font-bold">-</span>
              <input 
                type="number" 
                placeholder="Max"
                value={filters.price_max}
                onChange={(e) => setFilters({...filters, price_max: e.target.value})}
                className="w-full px-4 py-3.5 bg-brand-bg border border-brand-border rounded-2xl font-bold text-brand-text focus:bg-brand-card focus:ring-2 focus:ring-brand-primary/50 text-sm outline-none transition-all"
              />
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default MobileFilterModal;
