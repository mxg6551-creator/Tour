import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Send, Gamepad2, Swords, Dice5 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sound } from '../services/sound';
import { ASSET_IMAGES } from '../assets/images';

export const HeroSlider: React.FC = () => {
  const { settings, setActiveModal, setIs7Up7DownModalOpen } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 'b-1',
      title: 'XEB TOUR গ্র্যান্ড টুর্নামেন্ট এরিনা',
      subtitle: 'Free Fire BR & Clash Squad এন্ট্রি নিন ও আসল প্রাইজ পুল জিতুন',
      imageUrl: ASSET_IMAGES.heroBanner,
      tag: 'FEATURED ESPORTS',
      action: 'ESPORTS'
    },
    {
      id: 'b-2',
      title: '৭ আপ ৭ ডাউন ক্যাসিনো লাইভ এরিনা (24/7 Live)',
      subtitle: '২-৬ ডাউন, ৮-১২ আপ এবং লাকি ৭ ডাইস বাজি ধরে লাইভ জয়ী হোন!',
      imageUrl: ASSET_IMAGES.gameMode7Up7Down,
      tag: 'HOT CASINO GAME',
      action: 'SEVEN_UP'
    },
    {
      id: 'b-3',
      title: 'লুডু কিং ক্লাসিক ১v১, ২v২ ও ৪v৪ ব্যাটেল',
      subtitle: '১০০% ফেয়ার ও আসল ডাইস রোলিং সিস্টেমে খেলুন',
      imageUrl: ASSET_IMAGES.gameModeLudo,
      tag: 'LUDO KING LIVE',
      action: 'LUDO'
    }
  ];

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleBannerAction = (action: string) => {
    sound.playClick();
    if (action === 'SEVEN_UP') {
      setIs7Up7DownModalOpen(true);
    } else if (action === 'LUDO') {
      setActiveModal('LUDO_ARENA');
    } else {
      const el = document.getElementById('matches-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-300 dark:border-amber-500/30 bg-slate-900 shadow-xl group">
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-700 ease-out h-48 sm:h-64 md:h-72"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div 
            key={banner.id}
            className="w-full flex-shrink-0 relative overflow-hidden cursor-pointer"
            onClick={() => handleBannerAction(banner.action)}
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            {/* Scrim overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-4 md:p-6">
              <div className="max-w-2xl space-y-1.5 sm:space-y-2">
                <span className="inline-block text-[10px] md:text-xs font-black tracking-widest text-amber-400 uppercase bg-amber-500/20 border border-amber-400/30 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                  {banner.tag}
                </span>
                <h2 className="text-base sm:text-xl md:text-2xl font-black text-white leading-tight drop-shadow-md">
                  {banner.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-1">
                  {banner.subtitle}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button 
                    type="button"
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/30 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform"
                  >
                    {banner.action === 'SEVEN_UP' && <Dice5 className="w-3.5 h-3.5" />}
                    {banner.action === 'LUDO' && <Gamepad2 className="w-3.5 h-3.5" />}
                    {banner.action === 'ESPORTS' && <Swords className="w-3.5 h-3.5" />}
                    <span>এখনই খেলুন (PLAY)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 border border-amber-500/30 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-500 hover:text-slate-950"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          setCurrentSlide((prev) => (prev + 1) % banners.length);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 border border-amber-500/30 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-500 hover:text-slate-950"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Indicator dots */}
      <div className="absolute bottom-2.5 right-4 flex items-center gap-1.5 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              setCurrentSlide(idx);
            }}
            className={`h-1.5 rounded-full transition-all ${
              currentSlide === idx ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
