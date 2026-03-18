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
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      id: 'seller',
      title: 'Aktiv Egasi (Seller)',
      description: 'Menda o\'z auditoriyam bor va reklamalarni joylab daromad qilmoqchiman',
      icon: Briefcase,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      id: 'specialist',
      title: 'Mutaxassis/Dizayner',
      description: 'Men media va reklama yo\'nalishida mutaxassisman (Kopirayter, Dizayner, v.h.k)',
      icon: PenTool,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100'
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
      }

      // Trigger standard navigation or callback
      if (onRoleSelected) {
        onRoleSelected(selectedRole);
      } else {
        // Find default route based on role
        if (selectedRole === 'seller') navigate('/seller/inventory/create', { replace: true });
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
    <div className="bg-[#fcfcfd] min-h-screen pb-24 px-5 pt-12 flex flex-col justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-accent/10 rounded-3xl mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">Qanday maqsadda foydalanasiz?</h1>
        <p className="text-gray-500 text-sm">Davom etishdan oldin profilingiz uchun tegishli rolni tanlang.</p>
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
              className={`w-full text-left p-5 rounded-3xl border-2 transition-all block ${isSelected ? 'border-accent bg-accent/5 ring-4 ring-accent/10' : 'border-gray-100 bg-white hover:border-gray-200'}`}
            >
              <div className="flex items-center">
                <div className={`p-4 rounded-2xl ${isSelected ? 'bg-accent text-white shadow-lg shadow-accent/20' : role.bg + ' ' + role.color} transition-colors`}>
                  <role.icon className="w-6 h-6" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className={`font-black text-lg ${isSelected ? 'text-accent' : 'text-gray-900'}`}>{role.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{role.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-accent bg-accent' : 'border-gray-200'}`}>
                  {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
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
          className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center transition-all ${!selectedRole ? 'bg-gray-100 text-gray-400' : 'bg-accent text-white shadow-xl shadow-accent/20 active:scale-95'}`}
        >
          {isLoading ? 'Iltimos, kuting...' : 'Davom etish'} <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default MobileRoleSelection;
