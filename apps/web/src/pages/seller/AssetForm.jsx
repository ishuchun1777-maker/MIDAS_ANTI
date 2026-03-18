import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Instagram, 
  Youtube, 
  MessageSquare, 
  Layout, 
  Monitor, 
  Globe, 
  Smartphone,
  Bus,
  Calendar,
  Users,
  Music,
  Info,
  DollarSign,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LANGUAGES = {
  UZ: {
    title: 'Yangi Asset Yaratish',
    subtitle: 'Reklama maydoningiz haqidagi barcha ma\'lumotlarni to\'ldiring',
    type: 'Media Turini Tanlang',
    basic: 'Asosiy ma\'lumotlar',
    assetTitle: 'Asset Sarlavhasi',
    category: 'Kategoriya tanlang',
    socialLink: 'Profil Linki / Username',
    description: 'Tavsif',
    descPlaceholder: 'Auditoriyangiz haqida batafsil ma\'lumot bering...',
    stats: 'Statistika va Tafsilotlar',
    followers: 'Obunachilar soni',
    reach: 'O\'rtacha Reach (Qamrov)',
    pricing: 'Narxlash',
    priceLabel: 'Asosiy narx (USD)',
    negotiable: 'Kelishuv asosida (Negotiable)',
    portfolio: 'Portfolio va Skrinshotlar',
    upload: 'Rasm yuklash',
    uploadDesc: 'Auditoriya statistikasi yoki avvalgi ishlaringizdan namunalar.',
    previous: 'Avvalgisi',
    next: 'Davom etish',
    finish: 'Saqlash va Yaratish',
    requiredError: 'Barcha maydonlarni to\'ldirish majburiy!',
    linkError: 'Noto\'g\'ri link kiritildi!',
  },
  RU: {
    title: 'Создание нового актива',
    subtitle: 'Заполните всю информацию о вашей рекламной площадке',
    type: 'Выберите тип медиа',
    basic: 'Основная информация',
    assetTitle: 'Название актива',
    category: 'Выберите категорию',
    socialLink: 'Ссылка на профиль / Username',
    description: 'Описание',
    descPlaceholder: 'Расскажите подробнее о вашей аудитории...',
    stats: 'Статистика и детали',
    followers: 'Количество подписчиков',
    reach: 'Средний охват (Reach)',
    pricing: 'Ценообразование',
    priceLabel: 'Базовая цена (USD)',
    negotiable: 'Договорная цена',
    portfolio: 'Портфолио и скриншоты',
    upload: 'Загрузить фото',
    uploadDesc: 'Статистика аудитории или примеры ваших предыдущих работ.',
    previous: 'Назад',
    next: 'Продолжить',
    finish: 'Сохранить и создать',
    requiredError: 'Все поля обязательны для заполнения!',
    linkError: 'Введена неверная ссылка!',
  },
  ENG: {
    title: 'Create New Asset',
    subtitle: 'Fill in all information about your advertising space',
    type: 'Choose Media Type',
    basic: 'Basic Information',
    assetTitle: 'Asset Title',
    category: 'Select Category',
    socialLink: 'Profile Link / Username',
    description: 'Description',
    descPlaceholder: 'Provide detailed information about your audience...',
    stats: 'Stats & Details',
    followers: 'Followers / Subscribers',
    reach: 'Avg. Reach / Views',
    pricing: 'Pricing',
    priceLabel: 'Base Price (USD)',
    negotiable: 'Negotiable price',
    portfolio: 'Portfolio & Images',
    upload: 'Upload Images',
    uploadDesc: 'Audience statistics or samples of your previous work.',
    previous: 'Previous',
    next: 'Continue',
    finish: 'Finish & Create',
    requiredError: 'All fields are required!',
    linkError: 'Invalid link entered!',
  }
};

const CATEGORIES_BY_LANG = {
  UZ: {
    instagram: ['Lifestyle', 'Moda', 'Go\'zallik', 'Sayohat', 'Texnologiya', 'Oziq-ovqat', 'Kulgu (Comedy)', 'Motivatsiya', 'Biznes', 'Sport', 'Avto', 'Oila va Farzandlar', 'San\'at va Dizayn', 'Musiqa', 'O\'yinlar (Gaming)'],
    youtube: ['Ta\'lim', 'Texno-sharhlar', 'Gaming', 'Vlogging', 'Oyin-kulgi', 'Shou', 'Avto', 'Oshpazlik'],
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
    mobile_app: ['Игры', 'Утилиты', 'Социальные сети', 'Финансы'],
    bus_transit: ['Автобус', 'Такси', 'Личный автомобиль', 'Грузовик'],
    events: ['Конференция', 'Концерт', 'Фестиваль', 'Выставка', 'Спец. мероприятие'],
    consultation: ['Экспертный совет', 'Направление', 'Рекомендация', 'Сарафанное радио']
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

const AssetForm = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState('UZ'); // Should ideally be connected to a global state/context
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const t = LANGUAGES[lang];

  const [formData, setFormData] = useState({
    media_type: '',
    title: '',
    description: '',
    category: '',
    social_link: '',
    pricing: { base_price: '', currency: 'USD', negotiable: false },
    audience: { total_reach: '' },
    details: { followers: '', avg_reach: '' }
  });

  const sanitizeInput = (text) => {
    return text.replace(/[<>]/g, ''); // Simple sanitization to prevent script injection
  };

  const validateLink = (link) => {
    if (!link) return true;
    const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$|^@[\w]+$/;
    return regex.test(link);
  };

  const nextStep = () => {
    const newErrors = {};
    if (currentStep === 1 && !formData.media_type) newErrors.media_type = t.requiredError;
    if (currentStep === 2) {
      if (!formData.title) newErrors.title = t.requiredError;
      if (!formData.category) newErrors.category = t.requiredError;
      if (['instagram', 'youtube', 'telegram_channel'].includes(formData.media_type)) {
        if (!formData.social_link) newErrors.social_link = t.requiredError;
        else if (!validateLink(formData.social_link)) newErrors.social_link = t.linkError;
      }
      if (!formData.description) newErrors.description = t.requiredError;
    }
    if (currentStep === 3) {
      if (!formData.details.followers) newErrors.followers = t.requiredError;
      if (!formData.details.avg_reach) newErrors.avg_reach = t.requiredError;
    }
    if (currentStep === 4) {
      if (!formData.pricing.base_price) newErrors.base_price = t.requiredError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleCreateAsset = async () => {
    nextStep(); // To check final validation if any
    if (Object.keys(errors).length === 0 && formData.title) {
      alert(t.finish + ': ' + formData.title);
      navigate('/seller/inventory');
    }
  };

  const steps = [
    { title: 'Type', icon: Info },
    { title: 'Basic Info', icon: Info },
    { title: 'Details', icon: Layout },
    { title: 'Pricing', icon: DollarSign },
    { title: 'Portfolio', icon: ImageIcon },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Language Selector */}
      <div className="flex justify-end space-x-2 mb-4">
        {['UZ', 'RU', 'ENG'].map(l => (
          <button 
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${lang === l ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        <p className="mt-2 text-gray-500">{t.subtitle}</p>
      </div>

      <div className="flex justify-between items-center mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
        {steps.map((step, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${
              currentStep > index + 1 ? 'bg-accent text-white' : 
              currentStep === index + 1 ? 'bg-accent text-white ring-4 ring-accent-bg' : 'bg-white text-gray-400 border border-gray-200'
            }`}>
              {currentStep > index + 1 ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            <span className={`mt-2 text-xs font-medium ${currentStep === index + 1 ? 'text-accent' : 'text-gray-500'}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        <div className="flex-1 p-8">
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-xl font-bold mb-6">{t.type}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
                  { id: 'tiktok', label: 'TikTok', icon: Music, color: 'text-black', bg: 'bg-gray-100' },
                  { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-50' },
                  { id: 'telegram_channel', label: 'Telegram Channel', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
                  { id: 'telegram_bot', label: 'Telegram Bot', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100' },
                  { id: 'billboard', label: 'Billboard', icon: Layout, color: 'text-purple-600', bg: 'bg-purple-50' },
                  { id: 'led_monitor', label: 'LED Monitor', icon: Monitor, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { id: 'website', label: 'Website', icon: Globe, color: 'text-green-600', bg: 'bg-green-50' },
                  { id: 'mobile_app', label: 'Mobile App', icon: Smartphone, color: 'text-gray-700', bg: 'bg-gray-100' },
                  { id: 'bus_transit', label: 'Avtobus (Avto)', icon: Bus, color: 'text-orange-600', bg: 'bg-orange-50' },
                  { id: 'events', label: 'Tadbirlarda', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { id: 'consultation', label: 'Maslahatlarda', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => { setFormData({ ...formData, media_type: type.id }); setErrors({}); }}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group ${
                      formData.media_type === type.id ? 'border-accent bg-accent-bg shadow-md' : 'border-gray-100 hover:border-accent/40 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`${type.bg} ${type.color} p-4 rounded-xl mb-3 group-hover:scale-110 transition-transform`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{type.label}</span>
                  </button>
                ))}
              </div>
              {errors.media_type && <p className="mt-4 text-xs text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> {errors.media_type}</p>}
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
              <h2 className="text-xl font-bold">{t.basic}</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.assetTitle}</label>
                <input 
                  type="text" 
                  className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-accent outline-none`}
                  placeholder="e.g. Lifestyle Blog - 50k Followers"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: sanitizeInput(e.target.value)})}
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.category}</label>
                <select 
                  className={`w-full px-4 py-3 rounded-xl border ${errors.category ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-accent outline-none`}
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">{t.category}</option>
                  {(CATEGORIES_BY_LANG[lang][formData.media_type] || []).map(cat => (
                    <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
              </div>
              {['instagram', 'youtube', 'telegram_channel', 'telegram_bot'].includes(formData.media_type) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.socialLink}</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.social_link ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-accent outline-none`}
                      placeholder="e.g. instagram.com/username or @username"
                      value={formData.social_link}
                      onChange={(e) => setFormData({...formData, social_link: sanitizeInput(e.target.value)})}
                    />
                  </div>
                  {errors.social_link && <p className="mt-1 text-xs text-red-500">{errors.social_link}</p>}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.description}</label>
                <textarea 
                  rows="4"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-accent outline-none`}
                  placeholder={t.descPlaceholder}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: sanitizeInput(e.target.value)})}
                ></textarea>
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
              <h2 className="text-xl font-bold">{t.stats}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.followers}</label>
                  <input 
                    type="number" 
                    className={`w-full px-4 py-3 rounded-xl border ${errors.followers ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-accent outline-none`}
                    placeholder="50000"
                    value={formData.details.followers}
                    onChange={(e) => setFormData({...formData, details: {...formData.details, followers: e.target.value}})}
                  />
                  {errors.followers && <p className="mt-1 text-xs text-red-500">{errors.followers}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.reach}</label>
                  <input 
                    type="number" 
                    className={`w-full px-4 py-3 rounded-xl border ${errors.avg_reach ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-accent outline-none`}
                    placeholder="12000"
                    value={formData.details.avg_reach}
                    onChange={(e) => setFormData({...formData, details: {...formData.details, avg_reach: e.target.value}})}
                  />
                  {errors.avg_reach && <p className="mt-1 text-xs text-red-500">{errors.avg_reach}</p>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
              <h2 className="text-xl font-bold">{t.pricing}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.priceLabel}</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="number" 
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.base_price ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-accent outline-none`}
                      placeholder="100"
                      value={formData.pricing.base_price}
                      onChange={(e) => setFormData({...formData, pricing: {...formData.pricing, base_price: e.target.value}})}
                    />
                  </div>
                  {errors.base_price && <p className="mt-1 text-xs text-red-500">{errors.base_price}</p>}
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <input 
                    type="checkbox" 
                    id="negotiable"
                    className="w-5 h-5 accent-accent cursor-pointer"
                    checked={formData.pricing.negotiable}
                    onChange={(e) => setFormData({...formData, pricing: {...formData.pricing, negotiable: e.target.checked}})}
                  />
                  <label htmlFor="negotiable" className="text-sm font-medium text-gray-700 cursor-pointer">{t.negotiable}</label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
              <h2 className="text-xl font-bold">{t.portfolio}</h2>
              <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:border-accent/40 hover:bg-gray-50 transition-all cursor-pointer group">
                <div className="bg-accent-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{t.upload}</h3>
                <p className="text-gray-500 text-sm mt-1">{t.uploadDesc}</p>
                <input type="file" className="hidden" multiple />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50/50">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-2 rounded-xl font-semibold transition-all ${currentStep === 1 ? 'opacity-0' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> {t.previous}
          </button>
          
          <button
            onClick={currentStep === 5 ? handleCreateAsset : nextStep}
            className="flex items-center px-8 py-2 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-all shadow-md active:scale-95"
          >
            {currentStep === 5 ? t.finish : t.next} <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetForm;
