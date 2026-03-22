import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Activity, Wind, Flame, Droplets, Compass, MessageSquare, BookOpen, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebase';
import { cn } from '../lib/utils';
import { CompanionPanel } from '../components/CompanionPanel';

export function FlowPage() {
  const { t } = useTranslation();
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);

  const CALENDAR = useMemo(() => {
    const days = t('flow.days', { returnObjects: true }) as string[];
    const today = new Date();
    const calendar = [];
    for (let i = -2; i <= 4; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      calendar.push({
        date: d,
        dayName: days[d.getDay()],
        dayNum: d.getDate(),
        isToday: i === 0,
      });
    }
    return calendar;
  }, [t]);

  const [selectedDate, setSelectedDate] = useState(CALENDAR.find(d => d.isToday)?.date.getTime());

  const isTodaySelected = selectedDate === CALENDAR.find(d => d.isToday)?.date.getTime();
  
  const RHYTHM_DATA = useMemo(() => ({
    today: {
      title: t('flow.rhythm.today.title'),
      type: t('flow.rhythm.today.type'),
      desc: t('flow.rhythm.today.desc'),
      stats: [
        { icon: Flame, label: t('flow.rhythm.today.stats.tension.label'), value: t('flow.rhythm.today.stats.tension.value'), progress: 80, color: 'text-[#FF9F43]', bg: 'bg-[#FF9F43]/10' },
        { icon: Wind, label: t('flow.rhythm.today.stats.resistance.label'), value: t('flow.rhythm.today.stats.resistance.value'), progress: 50, color: 'text-[#FF9F43]', bg: 'bg-[#FF9F43]/10' },
        { icon: Droplets, label: t('flow.rhythm.today.stats.recovery.label'), value: t('flow.rhythm.today.stats.recovery.value'), progress: 40, color: 'text-[#4CB5F9]', bg: 'bg-[#4CB5F9]/10' },
      ]
    },
    other: {
      title: t('flow.rhythm.other.title'),
      type: t('flow.rhythm.other.type'),
      desc: t('flow.rhythm.other.desc'),
      stats: [
        { icon: Flame, label: t('flow.rhythm.other.stats.tension.label'), value: t('flow.rhythm.other.stats.tension.value'), progress: 40, color: 'text-[#FF9F43]', bg: 'bg-[#FF9F43]/10' },
        { icon: Wind, label: t('flow.rhythm.other.stats.resistance.label'), value: t('flow.rhythm.other.stats.resistance.value'), progress: 20, color: 'text-[#FF9F43]', bg: 'bg-[#FF9F43]/10' },
        { icon: Droplets, label: t('flow.rhythm.other.stats.recovery.label'), value: t('flow.rhythm.other.stats.recovery.value'), progress: 80, color: 'text-[#4CB5F9]', bg: 'bg-[#4CB5F9]/10' },
      ]
    }
  }), [t]);

  const currentData = isTodaySelected ? RHYTHM_DATA.today : RHYTHM_DATA.other;
  const chartDays = t('flow.chartDays', { returnObjects: true }) as string[];

  return (
    <div className="min-h-full bg-[#FDFBF7] text-[#1A1D1E] pb-32 md:pb-16 font-sans relative overflow-x-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#FFE5D4] to-[#FDFBF7] -z-10" />

      <div className="max-w-md mx-auto px-6 pt-12 md:pt-16 space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={auth.currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser?.uid || 'default'}`} 
              alt="Avatar" 
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
            />
            <div>
              <p className="text-[13px] text-[#1A1D1E]/60 font-medium">{t('flow.greeting')}, {auth.currentUser?.displayName || t('flow.defaultName')}</p>
              <h1 className="text-[20px] font-bold tracking-tight">{t('flow.todayGuidance')} <Flame className="inline w-5 h-5 text-[#FF9F43] mb-1" /></h1>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1A1D1E] relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#1A1D1E] rounded-full border-2 border-white" />
          </button>
        </header>

        {/* Breathing Orb / Energy Aura */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full py-8 flex flex-col items-center justify-center"
        >
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9F43]/20 to-[#0EA5E9]/20 rounded-full animate-pulse-ring" />
            <div className="absolute inset-4 bg-gradient-to-tr from-[#FF9F43]/40 to-[#0EA5E9]/40 rounded-full animate-pulse-ring" style={{ animationDelay: '1s' }} />
            <div className="absolute inset-8 bg-gradient-to-tr from-[#FF9F43]/60 to-[#0EA5E9]/60 rounded-full shadow-[0_0_40px_rgba(255,159,67,0.3)] flex items-center justify-center">
               <Wind className="w-8 h-8 text-white animate-float" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[12px] font-bold text-[#1A1D1E]/40 tracking-widest uppercase mb-1">{t('flow.energyAura')}</p>
            <h2 className="text-[22px] font-bold tracking-tight text-[#1A1D1E]">{t('flow.energyState')}</h2>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCompanionOpen(true)}
            className="col-span-2 bg-[#1A1D1E] text-white rounded-[28px] p-5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.15)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-[16px] tracking-wide">{t('flow.actions.chat')}</h3>
                <p className="text-white/60 text-[13px] font-medium mt-0.5">{t('flow.actions.chatDesc')}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-[28px] p-5 flex flex-col items-start gap-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
          >
            <div className="w-10 h-10 bg-[#E0F2FE] rounded-full flex items-center justify-center text-[#0EA5E9]">
              <Wind className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-[15px] text-[#1A1D1E]">{t('flow.actions.breathe')}</h3>
              <p className="text-[#1A1D1E]/50 text-[12px] font-medium mt-0.5">{t('flow.actions.breatheDesc')}</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-[28px] p-5 flex flex-col items-start gap-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
          >
            <div className="w-10 h-10 bg-[#FFF5ED] rounded-full flex items-center justify-center text-[#FF9F43]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-[15px] text-[#1A1D1E]">{t('flow.actions.journal')}</h3>
              <p className="text-[#1A1D1E]/50 text-[12px] font-medium mt-0.5">{t('flow.actions.journalDesc')}</p>
            </div>
          </motion.button>
        </div>

        {/* Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#FFB067] to-[#FF9F43] rounded-[28px] p-5 flex items-center justify-between shadow-md shadow-orange-500/20"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1A1D1E] rounded-full flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-[16px] tracking-wide">{t('flow.mainTension')}</h2>
              <p className="text-white/90 text-[13px] font-medium mt-0.5">{t('flow.tensionDesc')}</p>
            </div>
          </div>
          <button className="bg-white text-[#FF9F43] px-5 py-2.5 rounded-full text-[13px] font-bold tracking-wide shadow-sm hover:scale-105 transition-transform">
            {t('flow.view')}
          </button>
        </motion.div>

        {/* Calendar Strip */}
        <div className="flex justify-between items-center px-1">
          {CALENDAR.map((day, i) => {
            const isSelected = selectedDate === day.date.getTime();
            return (
              <button 
                key={i}
                onClick={() => setSelectedDate(day.date.getTime())}
                className="flex flex-col items-center gap-3"
              >
                <span className="text-[12px] font-medium text-[#1A1D1E]/40">{day.dayName}</span>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold transition-all",
                  isSelected 
                    ? "bg-[#1A1D1E] text-white shadow-md" 
                    : "text-[#1A1D1E] hover:bg-black/5"
                )}>
                  {day.dayNum}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Card */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedDate}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-[#FFF5ED] rounded-full flex items-center justify-center text-[#FF9F43]">
                <Activity className="w-5 h-5" />
              </div>
              <div className="bg-[#1A1D1E] text-white px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wide">
                {currentData.type}
              </div>
            </div>

            <div>
              <h3 className="text-[24px] font-bold mb-2">{currentData.title}</h3>
              <p className="text-[14px] text-[#1A1D1E]/50 font-medium leading-relaxed">
                {currentData.desc}
              </p>
            </div>

            {/* Bar Chart Mockup */}
            <div className="flex items-end justify-between h-24 gap-2 pt-4">
              {[40, 60, 85, 50, 30, 70, 90].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-[#FFF5ED] rounded-t-md relative flex items-end justify-center" style={{ height: '100%' }}>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={cn(
                        "w-full rounded-t-md",
                        i === 3 ? "bg-[#FF9F43]" : "bg-[#FFD4B2]"
                      )}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#1A1D1E]/40">
                    {chartDays[i]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* List of Stats */}
        <div className="space-y-4">
          {currentData.stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white rounded-[28px] p-5 flex items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div>
                  <h4 className="text-[16px] font-bold">{stat.value}</h4>
                  <p className="text-[13px] text-[#1A1D1E]/50 font-medium">{stat.label}</p>
                </div>
              </div>
              
              {/* Circular Progress */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-[#1A1D1E]/5" />
                  <circle 
                    cx="24" cy="24" r="20" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    fill="transparent" 
                    strokeDasharray={20 * 2 * Math.PI}
                    strokeDashoffset={20 * 2 * Math.PI * (1 - stat.progress / 100)}
                    className={stat.color} 
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold">{stat.progress}%</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      <CompanionPanel 
        isOpen={isCompanionOpen} 
        onClose={() => setIsCompanionOpen(false)} 
      />
    </div>
  );
}
