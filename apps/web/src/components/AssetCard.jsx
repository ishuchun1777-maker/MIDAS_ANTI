import React from 'react';
import { ShieldCheck, MapPin, Users, BarChart3, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const AssetCard = ({ asset, onShortlist, isShortlisted }) => {
  return (
    <div className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-100 h-full flex flex-col hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group">
      {/* Thumbnail Placeholder */}
      <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden mb-5 bg-gray-50 border border-gray-100">
        {asset.thumbnail_url ? (
          <img src={asset.thumbnail_url} alt={asset.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <span className="text-4xl font-black opacity-10 uppercase tracking-widest">{asset.media_type.split('_')[0]}</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-black text-gray-900 rounded-full uppercase shadow-sm border border-white/50">
            {asset.media_type.replace('_', ' ')}
          </span>
        </div>

        {/* Shortlist Action */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            onShortlist(asset.id);
          }}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
            isShortlisted 
            ? 'bg-red-500 border-red-500 text-white' 
            : 'bg-white/90 border-white/50 text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{asset.category || 'General'}</span>
          {asset.engagement_rate && (
            <div className="flex items-center text-green-600 text-[10px] font-black">
              <BarChart3 className="w-3 h-3 mr-1" /> {asset.engagement_rate}% ER
            </div>
          )}
        </div>
        
        <Link to={`/discovery/${asset.id}`}>
          <h3 className="text-xl font-black text-gray-900 leading-tight mb-2 line-clamp-2 hover:text-accent transition-colors">
            {asset.title}
          </h3>
        </Link>
        
        <div className="flex items-center text-gray-500 text-xs mb-4">
          <span className="font-bold text-gray-700">{asset.seller_name}</span>
          <ShieldCheck className="w-3 h-3 ml-1 text-green-500" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2 text-accent/60" />
            <span className="text-xs font-bold">{asset.audience_reach?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-accent/60" />
            <span className="text-xs font-bold">{asset.city || 'National'}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
          <div>
            <span className="block text-[10px] text-gray-400 font-bold uppercase">Pricing from</span>
            <span className="text-xl font-black text-gray-900">
              ${asset.base_price?.toLocaleString() || '---'}
            </span>
          </div>
          <Link 
            to={`/discovery/${asset.id}`}
            className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-accent transition-all active:scale-95 shadow-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
