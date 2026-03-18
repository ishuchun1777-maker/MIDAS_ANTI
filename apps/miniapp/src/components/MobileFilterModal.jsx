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
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[32px] w-full max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl">
        <div className="p-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md rounded-t-[32px] z-10 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-black text-gray-900 tracking-tight ml-2">Filtrlash</h2>
          <div className="flex items-center space-x-2">
             <button 
                onClick={() => setFilters({ ...filters, city: '', media_type: '', price_min: '', price_max: '' })}
                className="text-[11px] font-bold text-gray-500 px-3 py-2 bg-gray-100 rounded-xl active:scale-95 transition-all"
             >
                Tozalash
             </button>
             <button 
                onClick={() => { onApply(); onClose(); }}
                className="text-[11px] font-black text-white px-3 py-2 bg-accent shadow-md shadow-accent/20 rounded-xl active:scale-95 transition-all"
             >
                Saqlash
             </button>
             <button onClick={onClose} className="p-1.5 text-gray-400 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors ml-1">
               <X className="w-5 h-5" />
             </button>
          </div>
        </div>
        
        <div className="p-5 pb-20 overflow-y-auto flex-1 space-y-6">
          {/* Viloyat */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Viloyat (Hudud)</label>
            <select 
              value={filters.city} 
              onChange={(e) => setFilters({...filters, city: e.target.value})}
              className="w-full px-4 py-3.5 border border-gray-200 bg-gray-50 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-accent/20 transition-all focus:bg-white"
            >
              {REGIONS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </div>

          {/* Platforma */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Platforma</label>
            <div className="flex flex-wrap gap-2">
              {MEDIA_TYPES.map(t => (
                <button 
                  key={t.id}
                  onClick={() => setFilters({...filters, media_type: t.id})}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                    filters.media_type === t.id 
                    ? 'bg-accent border-accent text-white shadow-md shadow-accent/20' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Narx */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Narx oralig'i (USD)</label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                placeholder="Min"
                value={filters.price_min}
                onChange={(e) => setFilters({...filters, price_min: e.target.value})}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-accent/20 text-sm outline-none transition-all"
              />
              <span className="text-gray-300 font-bold">-</span>
              <input 
                type="number" 
                placeholder="Max"
                value={filters.price_max}
                onChange={(e) => setFilters({...filters, price_max: e.target.value})}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-accent/20 text-sm outline-none transition-all"
              />
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default MobileFilterModal;
