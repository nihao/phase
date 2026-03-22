import { NavLink, Outlet } from 'react-router-dom';
import { CloudLightning, FlaskConical, User } from 'lucide-react';
import { cn } from '../lib/utils';

export function Layout() {
  return (
    <div className="flex h-[100dvh] bg-[#F4EFE6] text-[#3E362E] overflow-hidden flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-24 flex-col items-center py-8 border-r border-[#3E362E]/10 bg-[#F4EFE6]/90 backdrop-blur-xl shrink-0 z-50">
        <div className="mb-12">
          <div className="w-10 h-10 border border-[#8C3333] flex items-center justify-center rotate-45">
            <div className="w-8 h-8 border border-[#8C3333] flex items-center justify-center -rotate-45">
              <span className="text-[#8C3333] text-[12px] font-serif">相</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8 w-full">
          <NavItems />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 relative">
        <Outlet />
      </main>
      
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-[#3E362E]/10 bg-[#F4EFE6]/90 px-6 pb-safe backdrop-blur-xl">
        <NavItems />
      </nav>
    </div>
  );
}

function NavItems() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex flex-col items-center gap-1.5 transition-colors w-full py-2",
      isActive ? "text-[#8C3333]" : "text-[#3E362E]/40 hover:text-[#3E362E]/70"
    );

  return (
    <>
      <NavLink to="/" className={linkClass}>
        <CloudLightning className="h-6 w-6 md:h-5 md:w-5" strokeWidth={2} />
        <span className="text-[10px] font-serif tracking-widest">相谕</span>
      </NavLink>
      <NavLink to="/lab" className={linkClass}>
        <FlaskConical className="h-6 w-6 md:h-5 md:w-5" strokeWidth={2} />
        <span className="text-[10px] font-serif tracking-widest">灵机</span>
      </NavLink>
      <NavLink to="/profile" className={linkClass}>
        <User className="h-6 w-6 md:h-5 md:w-5" strokeWidth={2} />
        <span className="text-[10px] font-serif tracking-widest">本我</span>
      </NavLink>
    </>
  );
}
