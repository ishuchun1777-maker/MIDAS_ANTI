import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Check, 
  Instagram, 
  Youtube, 
  MessageSquare, 
  Layout, 
  Monitor, 
  Globe, 
  Smartphone,
  Music,
  Bus,
  Calendar,
  Users,
  DollarSign,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MEDIA_TYPES = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { id: 'tiktok', label: 'TikTok', icon: Music, color: 'text-white', bg: 'bg-white/10' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-400', bg: 'bg-red-500/10' },
  { id: 'telegram_channel', label: 'Telegram Channel', icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'telegram_bot', label: 'Telegram Bot', icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { id: 'billboard', label: 'Billboard', icon: Layout, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'led_monitor', label: 'LED Monitor', icon: Monitor, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { id: 'website', label: 'Website', icon: Globe, color: 'text-green-400', bg: 'bg-green-500/10' },
  { id: 'mobile_app', label: 'Mobile App', icon: Smartphone, color: 'text-gray-300', bg: 'bg-gray-500/10' },
  { id: 'bus_transit', label: 'Avtobus (Avto)', icon: Bus, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { id: 'events', label: 'Tadbirlarda', icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'consultation', label: 'Maslahatlarda', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
];

const LANGUAGES = {
  UZ: {
    title: 'Yangi Asset',
    type: 'Media Turini Tanlang',
    basic: 'Asosiy ma\'lumotlar',
    assetTitle: 'Sarlavha',
    category: 'Tanlang',
    socialLink: 'Link / Username',
    description: 'Tavsif',
    stats: 'Statistika',
    followers: 'Obunachilar',
    reach: 'O\'rtacha Reach',
    pricing: 'Narxlash',
    priceLabel: 'Narxi (USD)',
    negotiable: 'Kelishiladi',
    portfolio: 'Portfolio',
    upload: 'Rasm yuklash',
    previous: 'Orqaga',
    next: 'Davom etish',
    finish: 'Saqlash',
    requiredError: 'Maydon to\'ldirilmadi!',
    linkError: 'Noto\'g\'ri link!',
  },
  RU: {
    title: 'Новый актив',
    type: 'Выберите тип',
    basic: 'Основная информация',
    assetTitle: 'Название',
    category: 'Выберите',
    socialLink: 'Ссылка / Username',
    description: 'Описание',
    stats: 'Статистика',
    followers: 'Подписчики',
    reach: 'Средний охват',
    pricing: 'Цена',
    priceLabel: 'Цена (USD)',
    negotiable: 'Договорная',
    portfolio: 'Портфолио',
    upload: 'Загрузить фото',
    previous: 'Назад',
    next: 'Продолжить',
    finish: 'Сохранить',
    requiredError: 'Обязательное поле!',
    linkError: 'Неверная ссылка!',
  },
  ENG: {
    title: 'New Asset',
    type: 'Choose Media Type',
    basic: 'Basic Info',
    assetTitle: 'Asset Title',
    category: 'Select',
    socialLink: 'Link / Username',
    description: 'Description',
    stats: 'Stats',
    followers: 'Followers',
    reach: 'Avg. Reach',
    pricing: 'Pricing',
    priceLabel: 'Price (USD)',
    negotiable: 'Negotiable',
    portfolio: 'Portfolio',
    upload: 'Upload photo',
    previous: 'Previous',
    next: 'Continue',
    finish: 'Save',
    requiredError: 'Required!',
    linkError: 'Invalid link!',
  }
};

const CATEGORIES_BY_LANG = {
  UZ: {
    instagram: ['Lifestyle', 'Moda', 'Go\'zallik', 'Sayohat', 'Texnologiya', 'Oziq-ovqat', 'Kulgu (Comedy)', 'Motivatsiya', 'Biznes', 'Sport', 'Avto', 'Oila va Farzandlar', 'San\'at va Dizayn', 'Musiqa', 'O\'yinlar (Gaming)'],
    tiktok: ['Kulgu', 'Raqs', 'Lifestyle', 'Moda', 'Ta\'lim', 'Sayohat', 'Texnologiya', 'Oshpazlik', 'Musiqa', 'Sport'],
    youtube: ['Ta\'lim', 'Texno-sharhlar', 'Gaming', 'Vlogging', 'O\'yin-kulgi', 'Shou', 'Avto', 'Oshpazlik'],
    telegram_channel: ['Yangiliklar', 'Kripto', 'Biznes', 'Ta\'lim', 'Aksiya va Chegirmalar', 'IT/Dasturlash', 'Psixologiya', 'Sog\'liqni saqlash'],
    telegram_bot: ['Kommunal', 'Gaming', 'Kripto', 'Moliya', 'AI Toollar', 'Ta\'lim'],
    billboard: ['Statik', 'Raqamli', 'Tri-vision'],
    led_monitor: ['Ichki', 'Tashqi', 'Maxsus Tadbir'],
    website: ['Blog', 'Elektron tijorat', 'Yangiliklar portali', 'Forumlar'],
    mobile_app: ['Gaming', 'Asboblar', 'Ijtimoiy', 'Moliya'],
    bus_transit: ['Avtobus', 'Taxi', 'Shaxsiy Avtomobil', 'Yuk mashinasi'],
    events: ['Konferensiya', 'Konsert', 'Festival', 'Ko\'rgazma', 'Maxsus tadbir'],
    consultation: ['Ekspert maslahati', 'Yo\'llanma', 'Tavsiya', 'Og\'izdan og\'izga']
  },
  RU: {
    instagram: ['Лайфстайл', 'Мода', 'Красота', 'Путешествия', 'Технологии', 'Еда', 'Юмор (Комедия)', 'Мотивация', 'Бизнес', 'Спорт', 'Авто', 'Семья и дети', 'Искусство и дизайн', 'Музыка', 'Игры (Гейминг)'],
    tiktok: ['Юмор', 'Танцы', 'Лайфстайл', 'Мода', 'Образование', 'Путешествия', 'Технологии', 'Кулинария', 'Музыка', 'Спорт'],
    youtube: ['Образование', 'Техно-обзоры', 'Гейминг', 'Влогинг', 'Развлечение', 'Шоу', 'Авто', 'Кулинария'],
    telegram_channel: ['Новости', 'Крипто', 'Бизнес', 'Образование', 'Акции и Скидки', 'IT/Программирование', 'Психология', 'Здоровье'],
    telegram_bot: ['Утилиты', 'Гейминг', 'Крипто', 'Финансы', 'AI Инструменты', 'Образование'],
    billboard: ['Статический', 'Цифровой', 'Три-вижн'],
    led_monitor: ['Внутренний', 'Наружный', 'Спец. мероприятия'],
    website: ['Блог', 'E-commerce', 'Новостной портал', 'Форумы'],
    mobile_app: ['Игры', 'Утилиты', 'Социальные сети', 'Финансы']
  },
  ENG: {
    instagram: ['Lifestyle', 'Fashion', 'Beauty', 'Travel', 'Tech', 'Food', 'Comedy', 'Motivation', 'Business', 'Sport', 'Auto', 'Family & Kids', 'Art & Design', 'Music', 'Gaming'],
    tiktok: ['Comedy', 'Dance', 'Lifestyle', 'Fashion', 'Education', 'Travel', 'Tech', 'Cooking', 'Music', 'Sport'],
    youtube: ['Education', 'Tech Reviews', 'Gaming', 'Vlogging', 'Entertainment', 'Show', 'Auto', 'Cooking'],
    telegram_channel: ['News', 'Crypto', 'Business', 'Education', 'Deals', 'IT/Programming', 'Psychology', 'Health'],
    telegram_bot: ['Utilities', 'Gaming', 'Crypto', 'Finance', 'AI Tools', 'Education'],
    billboard: ['Static', 'Digital', 'Tri-vision'],
    led_monitor: ['Indoor', 'Outdoor', 'Special Event'],
    website: ['Blog', 'E-commerce', 'News Portal', 'Forums'],
    mobile_app: ['Gaming', 'Utilities', 'Social', 'Finance']
  }
};

const MobileAssetForm = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState('UZ');
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const t = LANGUAGES[lang];

  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  const [formData, setFormData] = useState({
    media_type: '',
    title: '',
    description: '',
    category: '',
    social_link: '',
    pricing: { base_price: '', negotiable: false },
    details: { followers: '', avg_reach: '' }
  });

  const sanitizeInput = (text) => text.replace(/[<>]/g, '');

  const validateLink = (link) => {
    if (!link) return true;
    const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$|^@[\w]+$/;
    return regex.test(link);
  };

  const validateStep = (s) => {
    const newErrors = {};
    if (s === 1 && !formData.media_type) newErrors.media_type = t.requiredError;
    if (s === 2) {
      if (!formData.title) newErrors.title = t.requiredError;
      if (!formData.category) newErrors.category = t.requiredError;
      if (['instagram', 'youtube', 'tiktok', 'telegram_channel'].includes(formData.media_type)) {
        if (!formData.social_link) newErrors.social_link = t.requiredError;
        else if (!validateLink(formData.social_link)) newErrors.social_link = t.linkError;
      }
      if (!formData.description) newErrors.description = t.requiredError;
    }
    if (s === 3) {
      if (!formData.details.followers) newErrors.followers = t.requiredError;
      if (!formData.details.avg_reach) newErrors.avg_reach = t.requiredError;
    }
    if (s === 4) {
      if (!formData.pricing.base_price) newErrors.base_price = t.requiredError;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleMediaTypeSelect = (id) => {
    setFormData({ ...formData, media_type: id });
    setErrors({});
    setTimeout(() => {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    }, 300);
  };

  const handleCreate = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsLoading(true);
    try {
      // Data transformation based on backend MediaAssetCreate schema
      const payload = {
        media_type: formData.media_type,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        social_link: formData.social_link,
        seller_profile_id: localStorage.getItem('seller_profile_id'),
        // Relationships are usually handled separately or via nested create if supported
        status: "draft",
        visibility: "public"
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/inventory/assets`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to create asset');

      const data = await response.json();
      alert(t.finish + ': ' + data.title);
      navigate('/seller/inventory');
    } catch (error) {
      console.error('Create error:', error);
      alert('Error: ' + error.message + ' (Localhost rejimida bo’lishi mumkin)');
      // For development/demo, allow proceeding even if API fails
      if (import.meta.env.DEV) navigate('/seller/inventory');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen pb-24 text-brand-text">
      {/* Mobile Top Bar */}
      <div className="p-4 flex items-center justify-between border-b border-brand-border bg-brand-bg/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="flex items-center">
          <button onClick={() => currentStep === 1 ? navigate(-1) : prevStep()} className="p-1 -ml-1 text-brand-text">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="ml-2 font-bold text-lg text-brand-text">{t.title}</h1>
        </div>
        <div className="flex space-x-1">
          {['UZ', 'RU', 'ENG'].map(l => (
            <button 
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-1 rounded-md text-[10px] font-black transition-all ${lang === l ? 'bg-brand-primary text-black' : 'bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${currentStep === s ? 'w-8 bg-brand-primary' : 'w-1.5 bg-brand-border'}`}></div>
          ))}
        </div>

        {/* Form Steps */}
        <div className="animate-in slide-in-from-right-4 duration-300">
          
          {/* Step 1: Media Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-brand-text">{t.type}</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 pb-8">
                {MEDIA_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleMediaTypeSelect(type.id)}
                    className={`flex flex-col items-center justify-center p-5 rounded-3xl border transition-all active:scale-95 ${
                      formData.media_type === type.id ? 'border-brand-primary bg-brand-primary/10 ring-2 ring-brand-primary/20' : 'border-brand-border bg-brand-card hover:border-brand-muted/40'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl bg-brand-bg shadow-inner border border-white/5 mb-3 ${type.color}`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold ${formData.media_type === type.id ? 'text-brand-primary' : 'text-brand-text'}`}>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Basic Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black capitalize text-brand-text">{formData.media_type.replace('_', ' ')} - {t.basic}</h2>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-muted uppercase ml-1">{t.assetTitle}</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Lifestyle Blog" 
                    className={`w-full bg-brand-card border border-brand-border rounded-2xl py-4 px-5 text-sm text-brand-text outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${errors.title ? 'ring-2 ring-red-500/50' : ''}`}
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: sanitizeInput(e.target.value)})}
                  />
                  {errors.title && <p className="text-[10px] text-red-500 ml-1">{errors.title}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-muted uppercase ml-1">{t.category}</label>
                  <select 
                    className={`w-full bg-brand-card border border-brand-border rounded-2xl py-4 px-5 text-sm text-brand-text outline-none appearance-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${errors.category ? 'ring-2 ring-red-500/50' : ''}`}
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="" className="text-brand-muted">{t.category}</option>
                    {(CATEGORIES_BY_LANG[lang][formData.media_type] || []).map(cat => (
                      <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                    ))}
                  </select>
                </div>

                {['instagram', 'youtube', 'tiktok', 'telegram_channel'].includes(formData.media_type) && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-muted uppercase ml-1">{t.socialLink}</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                      <input 
                        type="text" 
                        placeholder="@username yoki link" 
                        className={`w-full bg-brand-card border border-brand-border rounded-2xl py-4 pl-12 pr-5 text-sm text-brand-text outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${errors.social_link ? 'ring-2 ring-red-500/50' : ''}`}
                        value={formData.social_link}
                        onChange={(e) => setFormData({...formData, social_link: sanitizeInput(e.target.value)})}
                      />
                    </div>
                    {errors.social_link && <p className="text-[10px] text-red-500 ml-1">{errors.social_link}</p>}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-muted uppercase ml-1">{t.description}</label>
                  <textarea 
                    rows="3"
                    className={`w-full bg-brand-card border border-brand-border rounded-2xl py-4 px-5 text-sm text-brand-text outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${errors.description ? 'ring-2 ring-red-500/50' : ''}`}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: sanitizeInput(e.target.value)})}
                  ></textarea>
                </div>
              </div>

              {/* Explicit Continue button within page for extra clarity */}
              <button 
                onClick={nextStep}
                className="w-full py-4 bg-brand-primary/10 text-brand-primary rounded-2xl font-black text-sm border border-brand-primary/20 transition-all active:scale-95 flex items-center justify-center"
              >
                {t.next} <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}

          {/* Step 3: Stats */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-brand-text">{t.stats}</h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-muted uppercase ml-1">{t.followers}</label>
                  <input 
                    type="number" 
                    placeholder="50000" 
                    className={`w-full bg-brand-card border border-brand-border rounded-2xl py-4 px-5 text-sm text-brand-text outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${errors.followers ? 'ring-2 ring-red-500/50' : ''}`}
                    value={formData.details.followers}
                    onChange={(e) => setFormData({...formData, details: {...formData.details, followers: e.target.value}})}
                  />
                  {errors.followers && <p className="text-[10px] text-red-500 ml-1">{errors.followers}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-muted uppercase ml-1">{t.reach}</label>
                  <input 
                    type="number" 
                    placeholder="12000" 
                    className={`w-full bg-brand-card border border-brand-border rounded-2xl py-4 px-5 text-sm text-brand-text outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${errors.avg_reach ? 'ring-2 ring-red-500/50' : ''}`}
                    value={formData.details.avg_reach}
                    onChange={(e) => setFormData({...formData, details: {...formData.details, avg_reach: e.target.value}})}
                  />
                  {errors.avg_reach && <p className="text-[10px] text-red-500 ml-1">{errors.avg_reach}</p>}
                </div>
              </div>

              <button 
                onClick={nextStep}
                className="w-full py-4 bg-brand-primary/10 text-brand-primary rounded-2xl font-black text-sm border border-brand-primary/20 transition-all active:scale-95 flex items-center justify-center"
              >
                {t.next} <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}

          {/* Step 4: Pricing */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-brand-text">{t.pricing}</h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-muted uppercase ml-1">{t.priceLabel}</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                    <input 
                      type="number" 
                      placeholder="100" 
                      className={`w-full bg-brand-card border border-brand-border rounded-2xl py-4 pl-12 pr-5 text-sm text-brand-text outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${errors.base_price ? 'ring-2 ring-red-500/50' : ''}`}
                      value={formData.pricing.base_price}
                      onChange={(e) => setFormData({...formData, pricing: {...formData.pricing, base_price: e.target.value}})}
                    />
                  </div>
                  {errors.base_price && <p className="text-[10px] text-red-500 ml-1">{errors.base_price}</p>}
                </div>
                <button 
                  onClick={() => setFormData({...formData, pricing: {...formData.pricing, negotiable: !formData.pricing.negotiable}})}
                  className={`flex items-center space-x-3 p-4 w-full rounded-2xl transition-all border ${formData.pricing.negotiable ? 'bg-brand-primary/10 border-brand-primary ring-1 ring-brand-primary/50' : 'bg-brand-card border-brand-border'}`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${formData.pricing.negotiable ? 'bg-brand-primary border-brand-primary' : 'bg-brand-bg border-brand-muted'}`}>
                    {formData.pricing.negotiable && <Check className="w-3.5 h-3.5 text-black" />}
                  </div>
                  <span className={`text-sm font-bold ${formData.pricing.negotiable ? 'text-brand-primary' : 'text-brand-text'}`}>{t.negotiable}</span>
                </button>
              </div>

              <button 
                onClick={nextStep}
                className="w-full py-4 bg-brand-primary/10 text-brand-primary rounded-2xl font-black text-sm border border-brand-primary/20 transition-all active:scale-95 flex items-center justify-center"
              >
                {t.next} <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}

          {/* Step 5: Portfolio */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-brand-text">{t.portfolio}</h2>
              <div className="border-2 border-dashed border-brand-border rounded-3xl p-10 text-center bg-brand-card transition-all hover:border-brand-primary/50">
                <ImageIcon className="w-10 h-10 text-brand-muted mx-auto mb-3" />
                <p className="text-xs font-bold text-brand-muted mb-4">{t.upload}</p>
                <div className="px-6 py-2 bg-brand-bg rounded-xl text-xs font-black text-brand-text border border-brand-border inline-block shadow-inner hover:bg-brand-border transition-colors">
                  {t.upload}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-brand-bg/90 backdrop-blur-lg border-t border-brand-border flex space-x-3">
        {currentStep > 1 && (
          <button 
            onClick={prevStep}
            className="flex-1 py-4 bg-brand-card text-brand-text border border-brand-border rounded-2xl font-black transition-all active:scale-95"
          >
            {t.previous}
          </button>
        )}
        <button 
          onClick={currentStep === 5 ? handleCreate : nextStep}
          disabled={isLoading}
          className={`flex-[2] py-4 bg-brand-primary text-black rounded-2xl font-black shadow-lg shadow-brand-primary/20 transition-all active:scale-95 ${isLoading ? 'opacity-50 grayscale' : ''}`}
        >
          {isLoading ? '...' : (currentStep === 5 ? t.finish : t.next)}
        </button>
      </div>
    </div>
  );
};

export default MobileAssetForm;
