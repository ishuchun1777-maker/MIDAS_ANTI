import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ShoppingBag, PenTool, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileRoleSelection = ({ onRoleSelected }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  const ROLES = [
    {
      id: 'buyer',
      title: 'Reklama Beruvchi (Buyer)',
      description: 'Men loyiham, kanalim yoki biznesim uchun reklama sotib olmoqchiman',
      icon: ShoppingBag,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      id: 'seller',
      title: 'Aktiv Egasi (Seller)',
      description: 'Menda o\'z auditoriyam bor va reklamalarni joylab daromad qilmoqchiman',
      icon: Briefcase,
      color: 'text-brand-primary',
      bg: 'bg-brand-primary/10',
      border: 'border-brand-primary/20'
    },
    {
      id: 'specialist',
      title: 'Mutaxassis/Dizayner',
      description: 'Men media va reklama yo\'nalishida mutaxassisman (Kopirayter, Dizayner, v.h.k)',
      icon: PenTool,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      id: 'agency',
      title: 'Agentlik (Agency)',
      description: 'Men bir nechta savdo nuqtalarini (Led, Billboard, avtobus) boshqaraman va sotaman',
      icon: Briefcase,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    }
  ];

  const handleRoleSelection = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Request to backend /profiles/{role}
      const response = await fetch(`${API_BASE_URL}/profiles/${selectedRole}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Rolni tanlashda xato yuz berdi');
      }

      const data = await response.json();
      
      // Save profile ID to local storage implicitly based on role
      if (selectedRole === 'seller') {
        localStorage.setItem('seller_profile_id', data.seller_profile_id);
      } else if (selectedRole === 'buyer') {
        localStorage.setItem('buyer_profile_id', data.buyer_profile_id);
      } else if (selectedRole === 'specialist') {
        localStorage.setItem('specialist_profile_id', data.specialist_profile_id);
      } else if (selectedRole === 'agency') {
        localStorage.setItem('agency_profile_id', data.agency_profile_id);
      }

      // Trigger standard navigation or callback
      if (onRoleSelected) {
        onRoleSelected(selectedRole);
      } else {
        // Find default route based on role
        if (selectedRole === 'seller' || selectedRole === 'agency') navigate('/seller/inventory/create', { replace: true });
        else if (selectedRole === 'buyer') navigate('/discovery', { replace: true });
        else navigate('/', { replace: true });
      }

    } catch (error) {
      console.error(error);
      alert('Tizimga ulanishda xato. Qayta urinib ko\'ring.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen pb-24 px-5 pt-12 flex flex-col justify-center text-brand-text">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-brand-primary/10 rounded-3xl mx-auto flex items-center justify-center mb-4 border border-brand-primary/20">
          <CheckCircle2 className="w-8 h-8 text-brand-primary" />
        </div>
        <h1 className="text-2xl font-black text-brand-text leading-tight mb-2">Qanday maqsadda foydalanasiz?</h1>
        <p className="text-brand-muted text-sm px-4">Davom etishdan oldin profilingiz uchun tegishli rolni tanlang.</p>
      </motion.div>

      <div className="space-y-4 flex-1">
        {ROLES.map((role, idx) => {
          const isSelected = selectedRole === role.id;
          return (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full text-left p-5 rounded-3xl border transition-all block ${isSelected ? 'border-brand-primary bg-brand-card ring-2 ring-brand-primary/20' : 'border-brand-border bg-brand-card hover:border-brand-muted/30 shadow-[0_4px_20px_rgba(0,0,0,0.1)]'}`}
            >
              <div className="flex items-center">
                <div className={`p-4 rounded-2xl ${isSelected ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/20' : role.bg + ' ' + role.color} transition-colors border border-white/5`}>
                  <role.icon className="w-6 h-6" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className={`font-black text-lg ${isSelected ? 'text-brand-primary' : 'text-brand-text'}`}>{role.title}</h3>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">{role.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-brand-primary bg-brand-primary' : 'border-brand-border'}`}>
                  {isSelected && <div className="w-2.5 h-2.5 bg-black rounded-full"></div>}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-8">
        <button
          onClick={handleRoleSelection}
          disabled={!selectedRole || isLoading}
          className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center transition-all ${!selectedRole ? 'bg-brand-border text-brand-muted opacity-50' : 'bg-brand-primary text-black shadow-xl shadow-brand-primary/20 active:scale-95'}`}
        >
          {isLoading ? 'Iltimos, kuting...' : 'Davom etish'} <ChevronRight className="w-5 h-5 ml-2 text-black/50" />
        </button>
      </div>
    </div>
  );
};

export default MobileRoleSelection;
