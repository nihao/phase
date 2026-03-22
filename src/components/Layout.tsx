import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Compass, MessageSquare, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

export function Layout() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="flex h-[100dvh] bg-[#FDFBF7] text-[#1A1D1E] overflow-hidden flex-col md:flex-row font-sans">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-64 flex-col py-12 border-r border-[#1A1D1E]/5 bg-white shrink-0 z-50 relative shadow-[4px_0_24px_rgb(0,0,0,0.02)]">
        <div className="mb-16 px-10">
          <div className="w-12 h-12 bg-[#FF9F43] rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-orange-500/20">
            <Compass className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1D1E] tracking-tight">{t('nav.appName')}</h1>
          <p className="text-[11px] font-bold text-[#1A1D1E]/40 tracking-[0.1em] uppercase mt-1">Energy Flow</p>
        </div>
        <div className="flex flex-col gap-2 w-full px-6">
          <NavItems desktop />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50 flex h-16 items-center justify-around bg-white rounded-full px-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <NavItems />
      </nav>
    </div>
  );
}

function NavItems({ desktop = false }: { desktop?: boolean }) {
  const { t } = useTranslation();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "transition-all duration-300 relative",
      desktop 
        ? "flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl font-bold" 
        : "flex flex-col items-center justify-center w-12 h-12 rounded-full",
      isActive 
        ? (desktop ? "bg-[#1A1D1E] text-white shadow-md" : "text-white bg-[#1A1D1E] shadow-md") 
        : (desktop ? "text-[#1A1D1E]/50 hover:text-[#1A1D1E] hover:bg-black/5" : "text-[#1A1D1E]/40 hover:text-[#1A1D1E]/70")
    );

  return (
    <>
      <NavLink to="/" className={linkClass}>
        {({ isActive }) => (
          <>
            <Compass className={cn("h-5 w-5", desktop && isActive ? "text-white" : "")} strokeWidth={isActive ? 2.5 : 2} />
            {desktop && <span className="text-[14px]">{t('nav.home')}</span>}
          </>
        )}
      </NavLink>
      <NavLink to="/profile" className={linkClass}>
        {({ isActive }) => (
          <>
            <User className={cn("h-5 w-5", desktop && isActive ? "text-white" : "")} strokeWidth={isActive ? 2.5 : 2} />
            {desktop && <span className="text-[14px]">{t('nav.profile')}</span>}
          </>
        )}
      </NavLink>
    </>
  );
}
