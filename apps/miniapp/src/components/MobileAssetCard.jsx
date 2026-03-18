import React, { useState } from 'react';
import { ShieldCheck, MapPin, Users, Heart, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileSendOfferModal from './MobileSendOfferModal';

const MobileAssetCard = ({ asset, onShortlist, isShortlisted }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-brand-card rounded-3xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-brand-border flex flex-col transition-all hover:border-brand-primary/50">
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-brand-bg border border-brand-border">
          <div className="w-full h-full flex items-center justify-center text-brand-muted">
            <span className="text-2xl font-black opacity-20 uppercase tracking-widest">{asset.media_type.split('_')[0]}</span>
          </div>
          
          <div className="absolute top-2 left-2 flex gap-1">
            <span className="px-2 py-0.5 bg-brand-card/90 backdrop-blur-md text-[8px] font-black text-brand-primary border border-brand-primary/20 rounded-full uppercase">
              {asset.media_type.replace('_', ' ')}
            </span>
          </div>

          <button 
            onClick={(e) => {
              e.preventDefault();
              onShortlist(asset.id);
            }}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              isShortlisted 
              ? 'bg-red-500/20 border-red-500 text-red-500 shadow-lg shadow-red-500/20' 
              : 'bg-brand-bg/80 border-brand-border text-brand-muted hover:text-red-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] font-bold text-brand-muted uppercase tracking-widest">{asset.category || 'General'}</span>
            <div className="flex items-center text-brand-muted text-[10px] font-bold">
              <MapPin className="w-3 h-3 mr-1 text-brand-primary/50" /> {asset.city || 'National'}
            </div>
          </div>
          
          <h3 className="text-lg font-black text-brand-text leading-tight mb-2 line-clamp-2">
            {asset.title}
          </h3>
          
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-brand-border">
            <div>
              <span className="block text-[8px] text-brand-muted font-bold uppercase">Boshlang'ich</span>
              <span className="text-lg font-black text-brand-text">${asset.base_price || '---'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-[10px] font-bold text-brand-text bg-brand-bg border border-brand-border px-3 py-1.5 rounded-full">
                <Users className="w-3 h-3 mr-1.5 text-brand-accent" />
                {asset.audience_reach?.toLocaleString() || 'N/A'}
              </div>
              <button 
                onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}
                className="bg-brand-primary text-black w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-brand-primary/20"
              >
                <Send className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <MobileSendOfferModal 
        asset={asset} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default MobileAssetCard;
