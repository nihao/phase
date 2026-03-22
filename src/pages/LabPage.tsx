import { BookOpen, Map, Edit3, Compass, Star, Eye, Flame, Droplets, Mountain, Hexagon, ArrowRight, Activity, Users, Sparkles, CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const categories = [
  { id: 'deep', name: '深度排盘', count: 5 },
  { id: 'spiritual', name: '灵性指引', count: 2 },
  { id: 'social', name: '关系合盘', count: 1 },
];

const tools = [
  {
    id: 'naming',
    title: '起名与改名',
    desc: '结合五行八字与现代审美的专业起名服务，为新生儿或个人重塑能量场。',
    icon: Edit3,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    colSpan: 'col-span-12 md:col-span-8',
    users: '12,405',
    tag: 'HOT',
    suitableFor: '新生儿 / 寻求转运者'
  },
  {
    id: 'bazi',
    title: '硬核八字排盘',
    desc: '提供给懂行用户的专业排盘工具，包含大运流年与神煞解析。',
    icon: Map,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
    border: 'border-indigo-400/20',
    colSpan: 'col-span-12 md:col-span-4',
    users: '8,920',
    suitableFor: '命理爱好者'
  },
  {
    id: 'date',
    title: '高阶择日',
    desc: '商业签约、搬家、领证等重大事项的精准能量择时。',
    icon: CalendarDays,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    colSpan: 'col-span-12 md:col-span-4',
    users: '6,210',
    suitableFor: '重大决策前'
  },
  {
    id: 'life',
    title: '人生事业详批',
    desc: '万字长文报告，深度解析一生格局、财富走向与事业转折点。',
    icon: BookOpen,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    colSpan: 'col-span-12 md:col-span-8',
    users: '5,312',
    tag: 'NEW',
    suitableFor: '职业迷茫期'
  },
  {
    id: 'synastry',
    title: '双人合盘',
    desc: '透视关系本质，解析情感羁绊与前世因果。',
    icon: Compass,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/20',
    colSpan: 'col-span-12 md:col-span-6',
    users: '24,109',
    tag: 'HOT',
    suitableFor: '恋爱 / 合伙'
  },
  {
    id: 'tarot',
    title: '塔罗潜意识',
    desc: '抽取当下能量卡牌，直击潜意识深处的答案。',
    icon: Eye,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    colSpan: 'col-span-12 md:col-span-6',
    users: '18,550',
    suitableFor: '具体事件抉择'
  },
  {
    id: 'ziwei',
    title: '紫微斗数',
    desc: '皇家秘传星象学，十二宫位全景扫描。',
    icon: Star,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
    colSpan: 'col-span-12 md:col-span-12',
    users: '3,201',
    suitableFor: '全面人生体检'
  },
];

export function LabPage() {
  return (
    <div className="min-h-full bg-[#050505] px-6 pt-12 pb-32">
      <header className="mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-md mb-6"
        >
          <Hexagon className="h-3.5 w-3.5" />
          <span className="tracking-widest uppercase">Phase Lab</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-serif font-light text-white tracking-tight mb-4"
        >
          玄学实验室
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[15px] text-zinc-400 max-w-[280px] leading-relaxed"
        >
          气象局的专业雷达室，仅供有特定需求的用户深入探索。
        </motion.p>
      </header>

      {/* Daily Tarot Hero */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-10 rounded-[32px] border border-purple-500/30 bg-gradient-to-br from-purple-900/40 to-black p-8 relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-500/20 rounded-full blur-[40px] group-hover:bg-purple-500/30 transition-colors" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2594&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="relative z-10 flex flex-col items-start">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-[11px] font-medium text-purple-300 mb-6 border border-purple-500/30 backdrop-blur-md">
            <Sparkles className="w-3 h-3" /> 每日免费抽取
          </div>
          <h3 className="text-3xl font-serif text-white mb-3">今日能量指引</h3>
          <p className="text-[15px] text-purple-200/70 mb-4 leading-relaxed max-w-[240px]">
            在潜意识的海洋中，抽取一张属于你今天的塔罗牌，获得灵性启示。
          </p>
          <div className="border-l-2 border-purple-500/50 pl-3 py-1 mb-8">
            <p className="text-sm text-purple-300/60 italic">
              "答案不在风中，而在你抽出的牌面里。"
            </p>
          </div>
          <button className="rounded-full bg-purple-500 text-white px-6 py-3.5 text-[15px] font-medium hover:bg-purple-600 transition-colors shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center gap-2">
            点击抽取 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 pb-2">
        <button className="flex-none rounded-full bg-white text-black px-5 py-2 text-sm font-medium">
          全部工具
        </button>
        {categories.map(cat => (
          <button key={cat.id} className="flex-none rounded-full bg-zinc-900 border border-white/10 text-zinc-400 px-5 py-2 text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2">
            {cat.name} <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-12 gap-4">
        {tools.map((tool, index) => (
          <motion.div 
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className={cn(
              "group relative overflow-hidden rounded-[32px] border bg-zinc-900/50 p-8 transition-all duration-500 hover:bg-zinc-800/80 hover:-translate-y-1 hover:shadow-2xl",
              tool.border,
              tool.colSpan
            )}
          >
            {/* Background Glow Effect */}
            <div className={cn(
              "absolute -right-6 -top-6 p-8 rounded-full opacity-20 transition-all duration-700 group-hover:scale-[1.5] group-hover:opacity-40 blur-2xl",
              tool.bg
            )} />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className={cn(
                  "inline-flex items-center justify-center w-14 h-14 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg",
                  tool.bg
                )}>
                  <tool.icon className={cn("h-7 w-7", tool.color)} />
                </div>
                {tool.tag && (
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm",
                    tool.tag === 'HOT' ? "bg-red-500/20 text-red-400 border border-red-500/30 shadow-red-500/20" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/20"
                  )}>
                    {tool.tag}
                  </span>
                )}
              </div>
              
              <h3 className="mb-3 text-2xl font-serif text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all duration-300">
                {tool.title}
              </h3>
              <p className="mb-6 text-[14px] text-zinc-400 leading-relaxed flex-1 group-hover:text-zinc-300 transition-colors duration-300">
                {tool.desc}
              </p>
              
              <div className="flex items-center gap-2 mb-6">
                 <span className="text-[11px] text-zinc-400 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-sm group-hover:border-white/10 transition-colors duration-300">
                   适用: <span className="text-zinc-300">{tool.suitableFor}</span>
                 </span>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 group-hover:border-white/10 transition-colors duration-300">
                <div className="flex items-center gap-1.5 text-[12px] text-zinc-500 font-medium">
                  <Users className="w-4 h-4" /> {tool.users} 人已测
                </div>
                <button className="rounded-full bg-white/5 px-5 py-2.5 text-[13px] font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-2 group/btn">
                  进入 <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
