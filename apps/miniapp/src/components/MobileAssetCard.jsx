import React, { useState } from 'react';
import { ShieldCheck, MapPin, Users, Heart, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileSendOfferModal from './MobileSendOfferModal';

const MobileAssetCard = ({ asset, onShortlist, isShortlisted }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col transition-all">
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-gray-50 border border-gray-100">
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <span className="text-2xl font-black opacity-10 uppercase tracking-widest">{asset.media_type.split('_')[0]}</span>
          </div>
          
          <div className="absolute top-2 left-2 flex gap-1">
            <span className="px-2 py-0.5 bg-white/90 backdrop-blur-md text-[8px] font-black text-gray-900 rounded-full uppercase">
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
              ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-200' 
              : 'bg-white/90 border-white/50 text-gray-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{asset.category || 'General'}</span>
            <div className="flex items-center text-gray-500 text-[10px] font-bold">
              <MapPin className="w-3 h-3 mr-1 text-accent/40" /> {asset.city || 'National'}
            </div>
          </div>
          
          <h3 className="text-lg font-black text-gray-900 leading-tight mb-2 line-clamp-2">
            {asset.title}
          </h3>
          
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
            <div>
              <span className="block text-[8px] text-gray-400 font-bold uppercase">From</span>
              <span className="text-lg font-black text-gray-900">${asset.base_price || '---'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-[10px] font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                <Users className="w-3 h-3 mr-1.5 text-accent" />
                {asset.audience_reach?.toLocaleString() || 'N/A'}
              </div>
              <button 
                onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}
                className="bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-md shadow-accent/20"
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
