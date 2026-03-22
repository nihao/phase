import { useState, useEffect, useMemo } from 'react';
import { LogOut, Settings, ChevronRight, Zap, Star, Hexagon, TrendingUp, History, Lock, ArrowRight, ShieldCheck, Trash2, CalendarDays, Activity, Wind, Droplets, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function ProfilePage() {
  const { t, i18n } = useTranslation();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'activity' | 'insights' | 'settings'>('activity');

  const RECENT_ACTIVITY = useMemo(() => [
    { id: 1, type: 'insight', title: t('profile.activity.insight'), date: `${t('profile.time.today')} 14:30`, value: '+40 EXP' },
    { id: 2, type: 'action', title: t('profile.activity.action'), date: `${t('profile.time.yesterday')} 09:15`, value: '+20 EXP' },
    { id: 3, type: 'chat', title: t('profile.activity.chat'), date: 'Mar 18', value: '+10 EXP' },
  ], [t]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', auth.currentUser!.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${auth.currentUser!.uid}`);
      }
    };
    fetchProfile();
  }, []);

  const handleSignOut = () => {
    auth.signOut();
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  if (!auth.currentUser) return null;

  return (
    <div className="min-h-full bg-[#FDFBF7] text-[#1A1D1E] pb-32 md:pb-16 font-sans relative overflow-x-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-[#FFE5D4] to-[#FDFBF7] -z-10" />

      <div className="max-w-md mx-auto px-6 pt-12 md:pt-16 space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <button 
            onClick={() => setActiveTab('settings')}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1A1D1E] hover:bg-black/5 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <h1 className="text-[18px] font-bold tracking-tight">{t('profile.title')}</h1>
          <button 
            onClick={handleSignOut}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1A1D1E] hover:bg-black/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Main Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#FF9F43]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="relative mb-4">
              <img 
                src={auth.currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser.uid}`} 
                alt="Avatar" 
                className="h-24 w-24 rounded-full border-4 border-white shadow-md object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-[#1A1D1E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full border-2 border-white">
                {t('profile.level')}3
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-1">{auth.currentUser.displayName || t('flow.defaultName')}</h2>
            <p className="text-[13px] text-[#1A1D1E]/50 font-medium mb-6">{auth.currentUser.email}</p>

            {/* EXP Bar */}
            <div className="w-full bg-[#FDFBF7] rounded-2xl p-4 border border-[#1A1D1E]/5">
              <div className="flex items-center justify-between text-[12px] font-bold text-[#1A1D1E]/60 mb-2">
                <span>340 {t('profile.exp')}</span>
                <span>500 {t('profile.exp')}</span>
              </div>
              <div className="w-full h-2 bg-[#1A1D1E]/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "68%" }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-[#FF9F43]"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-[#FFF5ED] flex items-center justify-center text-[#FF9F43] mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">45<span className="text-sm text-[#1A1D1E]/40 ml-1">%</span></div>
            <div className="text-[12px] font-medium text-[#1A1D1E]/50">{t('profile.avgEnergy')}</div>
          </div>
          <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#1A1D1E] mb-3">
              <Star className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-1">12</div>
            <div className="text-[12px] font-medium text-[#1A1D1E]/50">{t('profile.insights')}</div>
          </div>
        </motion.div>

        {/* Tabs & Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-full shadow-sm">
            <button 
              onClick={() => setActiveTab('activity')}
              className={cn(
                "flex-1 py-2.5 rounded-full text-[13px] font-bold transition-all",
                activeTab === 'activity' ? "bg-[#1A1D1E] text-white shadow-sm" : "text-[#1A1D1E]/60 hover:bg-black/5"
              )}
            >
              {t('profile.tabs.activity')}
            </button>
            <button 
              onClick={() => setActiveTab('insights')}
              className={cn(
                "flex-1 py-2.5 rounded-full text-[13px] font-bold transition-all",
                activeTab === 'insights' ? "bg-[#1A1D1E] text-white shadow-sm" : "text-[#1A1D1E]/60 hover:bg-black/5"
              )}
            >
              {t('profile.tabs.insights')}
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={cn(
                "flex-1 py-2.5 rounded-full text-[13px] font-bold transition-all",
                activeTab === 'settings' ? "bg-[#1A1D1E] text-white shadow-sm" : "text-[#1A1D1E]/60 hover:bg-black/5"
              )}
            >
              {t('profile.tabs.settings')}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'activity' && (
              <motion.div 
                key="activity"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {RECENT_ACTIVITY.map((activity, i) => (
                  <div key={activity.id} className="bg-white rounded-[24px] p-5 flex items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        activity.type === 'insight' ? "bg-[#FFF5ED] text-[#FF9F43]" : 
                        activity.type === 'action' ? "bg-[#E0F2FE] text-[#0EA5E9]" : 
                        "bg-[#F3F4F6] text-[#1A1D1E]"
                      )}>
                        {activity.type === 'insight' ? <Star className="w-5 h-5" /> : 
                         activity.type === 'action' ? <Activity className="w-5 h-5" /> : 
                         <Wind className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold mb-0.5">{activity.title}</h4>
                        <p className="text-[12px] text-[#1A1D1E]/50 font-medium flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" /> {activity.date}
                        </p>
                      </div>
                    </div>
                    <span className="text-[13px] font-bold text-[#1A1D1E]">{activity.value}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div 
                  onClick={toggleLanguage}
                  className="bg-white rounded-[24px] p-5 flex items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#1A1D1E]">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold mb-0.5">{t('profile.language')}</h4>
                      <p className="text-[12px] text-[#1A1D1E]/50 font-medium">{i18n.language === 'zh' ? '中文' : 'English'}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#1A1D1E]/30" />
                </div>
                
                <div 
                  onClick={handleSignOut}
                  className="bg-white rounded-[24px] p-5 flex items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold mb-0.5 text-red-500">{t('profile.logout')}</h4>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}
