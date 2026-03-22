import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Compass, MessageSquare, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-[100dvh] bg-paper text-ink overflow-hidden flex-col md:flex-row font-serif">
      {/* Global Background Texture */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-multiply z-0" />

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-64 flex-col py-12 border-r border-ink/10 bg-paper/90 backdrop-blur-xl shrink-0 z-50 relative">
        <div className="mb-16 px-10">
          <div className="w-12 h-12 border border-seal flex items-center justify-center rotate-45 mb-6">
            <div className="w-10 h-10 border border-seal flex items-center justify-center -rotate-45">
              <span className="text-seal text-[14px] font-serif">相</span>
            </div>
          </div>
          <h1 className="text-xl font-serif text-ink tracking-widest">相谕</h1>
          <p className="text-[10px] font-sans text-ink/50 tracking-[0.2em] uppercase mt-1">Phase V2</p>
        </div>
        <div className="flex flex-col gap-2 w-full px-6">
          <NavItems desktop />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-ink/10 bg-paper/90 px-6 pb-safe backdrop-blur-xl">
        <NavItems />
      </nav>
    </div>
  );
}

function NavItems({ desktop = false }: { desktop?: boolean }) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "transition-all duration-300 relative",
      desktop 
        ? "flex items-center gap-4 w-full px-4 py-3 rounded-xl" 
        : "flex flex-col items-center gap-1.5 w-full py-2",
      isActive 
        ? (desktop ? "bg-mist border border-ink/5 text-ink shadow-sm" : "text-seal scale-105") 
        : (desktop ? "text-ink/60 hover:text-ink hover:bg-mist/50" : "text-ink/40 hover:text-ink/70")
    );

  return (
    <>
      <NavLink to="/" className={linkClass}>
        {({ isActive }) => (
          <>
            <Compass className={cn("h-6 w-6 md:h-5 md:w-5", desktop && isActive ? "text-seal" : "")} strokeWidth={isActive ? 2 : 1.5} />
            <span className={cn("font-serif tracking-widest", desktop ? "text-[14px]" : "text-[10px]")}>牵引</span>
            {!desktop && isActive && <motion.div layoutId="nav-indicator-mobile" className="absolute -bottom-2 md:-left-2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-seal" />}
            {desktop && isActive && <motion.div layoutId="nav-indicator-desktop" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-seal" />}
          </>
        )}
      </NavLink>
      <NavLink to="/lab" className={linkClass}>
        {({ isActive }) => (
          <>
            <MessageSquare className={cn("h-6 w-6 md:h-5 md:w-5", desktop && isActive ? "text-seal" : "")} strokeWidth={isActive ? 2 : 1.5} />
            <span className={cn("font-serif tracking-widest", desktop ? "text-[14px]" : "text-[10px]")}>陪伴</span>
            {!desktop && isActive && <motion.div layoutId="nav-indicator-mobile" className="absolute -bottom-2 md:-left-2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-seal" />}
            {desktop && isActive && <motion.div layoutId="nav-indicator-desktop" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-seal" />}
          </>
        )}
      </NavLink>
      <NavLink to="/profile" className={linkClass}>
        {({ isActive }) => (
          <>
            <Archive className={cn("h-6 w-6 md:h-5 md:w-5", desktop && isActive ? "text-seal" : "")} strokeWidth={isActive ? 2 : 1.5} />
            <span className={cn("font-serif tracking-widest", desktop ? "text-[14px]" : "text-[10px]")}>档案</span>
            {!desktop && isActive && <motion.div layoutId="nav-indicator-mobile" className="absolute -bottom-2 md:-left-2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-seal" />}
            {desktop && isActive && <motion.div layoutId="nav-indicator-desktop" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-seal" />}
          </>
        )}
      </NavLink>
    </>
  );
}
