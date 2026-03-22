import { useState, useEffect } from 'react';
import { LogOut, Crown, ShieldAlert, ChevronRight, Zap, FileText, Settings, CreditCard, Umbrella, Star, Hexagon, TrendingUp, History, Lock, ArrowRight, Gift, ShieldCheck, Trash2, Eye, Sparkles, CalendarDays } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const RECENT_ACTIVITY = [
  { id: 1, type: 'report', title: '双人合盘深度解析', date: '今天 14:30', cost: '¥99' },
  { id: 2, type: 'kit', title: '情绪急救包 (已使用)', date: '昨天 09:15', cost: '-1 伞' },
  { id: 3, type: 'chat', title: 'AI 能量管家对话', date: '3月18日', cost: '免费' },
];

export function ProfilePage() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showBlackGold, setShowBlackGold] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', auth.currentUser!.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserProfile(data);
          if (data.totalSpent >= 500) {
            setShowBlackGold(true);
          }
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

  const simulateSpend = async () => {
    if (!auth.currentUser || !userProfile) return;
    const newTotal = (userProfile.totalSpent || 0) + 100;
    
    try {
      await setDoc(doc(db, 'demo_purchases', `${auth.currentUser.uid}_${Date.now()}`), {
        uid: auth.currentUser.uid,
        item: 'energy_kit',
        amount: 100,
        createdAt: serverTimestamp()
      });
      setUserProfile({ ...userProfile, totalSpent: newTotal });
      if (newTotal >= 500) setShowBlackGold(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `demo_purchases`);
    }
  };

  if (!auth.currentUser) return null;

  return (
    <div className="min-h-full bg-[#050505] px-6 pt-12 pb-32">
      <header className="mb-10 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md mb-6">
            <Settings className="h-3.5 w-3.5 text-indigo-400" />
            <span className="tracking-widest uppercase">Profile</span>
          </div>
          <h1 className="text-4xl font-serif font-light text-white tracking-tight mb-2">我的档案</h1>
          <p className="text-[15px] text-zinc-400">数字资产与能量管理中枢</p>
        </motion.div>
        
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleSignOut} 
          className="rounded-full bg-white/5 p-4 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
        >
          <LogOut className="h-5 w-5" />
        </motion.button>
      </header>

      {/* User Card & Level System */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 rounded-[32px] border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px]" />
        
        <div className="flex items-center gap-6 mb-8 relative z-10">
          <div className="relative">
            <img 
              src={auth.currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser.uid}`} 
              alt="Avatar" 
              className="h-24 w-24 rounded-full border-2 border-indigo-500/30 bg-zinc-800 object-cover"
            />
            <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-zinc-900">
              Lv.3
            </div>
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-2.5 py-1 text-[10px] font-medium text-indigo-300 mb-2 border border-indigo-500/30">
              <Hexagon className="w-3 h-3" /> 觉醒者
            </div>
            <h2 className="text-3xl font-serif text-white mb-1">{auth.currentUser.displayName || '能量行者'}</h2>
            <p className="text-[14px] text-zinc-500 font-mono">{auth.currentUser.email}</p>
          </div>
        </div>

        {/* EXP Bar */}
        <div className="relative z-10">
          <div className="flex items-center justify-between text-[12px] text-zinc-400 mb-2 font-mono">
            <span>EXP 340</span>
            <span>500 (Lv.4)</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "68%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          </div>
          <p className="text-[11px] text-zinc-500 mt-3 text-center">再获得 160 经验值即可解锁「高阶灵视」权限</p>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <div className="rounded-[24px] border border-white/5 bg-zinc-900/50 p-6 hover:bg-zinc-800/50 transition-colors relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-[20px]" />
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <Zap className="h-5 w-5 text-amber-400" />
            <span className="text-[13px] font-medium text-zinc-400 uppercase tracking-wider">当前能量值</span>
          </div>
          <div className="text-4xl font-mono text-white relative z-10">45<span className="text-xl text-zinc-500 ml-1">%</span></div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 relative z-10">
            <TrendingUp className="w-3 h-3" /> 较昨日提升 12%
          </div>
        </div>
        <div className="rounded-[24px] border border-white/5 bg-zinc-900/50 p-6 hover:bg-zinc-800/50 transition-colors relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-[20px]" />
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <Star className="h-5 w-5 text-indigo-400" />
            <span className="text-[13px] font-medium text-zinc-400 uppercase tracking-wider">灵魂年龄</span>
          </div>
          <div className="text-4xl font-serif text-white relative z-10">老灵魂</div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-zinc-500 relative z-10">
            <Hexagon className="w-3 h-3" /> 阅历值 8,402
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        {/* Assets List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="rounded-[24px] border border-white/5 bg-zinc-900/50 p-6 flex items-center justify-between cursor-pointer hover:bg-zinc-800/80 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                <Umbrella className="h-7 w-7 text-zinc-300" />
              </div>
              <div>
                <h3 className="text-[18px] font-medium text-zinc-100 mb-1">能量急救包</h3>
                <p className="text-[14px] text-zinc-500">剩余 <span className="text-white font-mono">{userProfile?.energyTokens || 0}</span> 把雨伞</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </div>

          <div className="rounded-[24px] border border-white/5 bg-zinc-900/50 p-6 flex items-center justify-between cursor-pointer hover:bg-zinc-800/80 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                <Gift className="h-7 w-7 text-rose-300" />
              </div>
              <div>
                <h3 className="text-[18px] font-medium text-zinc-100 mb-1">能量红包</h3>
                <p className="text-[14px] text-zinc-500">可转赠给好友的急救伞</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </div>

          <div className="rounded-[24px] border border-white/5 bg-zinc-900/50 p-6 flex items-center justify-between cursor-pointer hover:bg-zinc-800/80 transition-colors group" onClick={simulateSpend}>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                <FileText className="h-7 w-7 text-zinc-300" />
              </div>
              <div>
                <h3 className="text-[18px] font-medium text-zinc-100 mb-1">已购报告库</h3>
                <p className="text-[14px] text-zinc-500">点击模拟消费 (¥100)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[12px] text-zinc-500">累计消费</div>
                <div className="text-[14px] font-mono text-white">¥{userProfile?.totalSpent || 0}</div>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </div>
          </div>
        </motion.div>

        {/* Locked Feature Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-[32px] border border-indigo-500/20 bg-gradient-to-br from-indigo-900/20 to-zinc-900/50 p-8 mt-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] group-hover:bg-indigo-500/20 transition-colors" />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-400" />
              <h3 className="text-[17px] font-medium text-white">高阶灵视权限</h3>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              <Lock className="w-3 h-3" /> Lv.4 解锁
            </div>
          </div>
          <p className="text-[13px] text-zinc-400 mb-6 leading-relaxed relative z-10">
            解锁更深维度的能量解析，包括前世业力追踪、灵魂伴侣雷达高级版，以及专属的每月能量定制冥想音频。
          </p>
          <div className="w-full rounded-2xl bg-black/40 border border-white/5 py-3 text-center text-[13px] text-zinc-500 flex items-center justify-center gap-2 relative z-10">
            <Sparkles className="w-4 h-4" /> 努力提升能量值吧
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-[32px] border border-white/5 bg-zinc-900/50 p-8 mt-8"
        >
          <div className="flex items-center gap-2 mb-8">
            <History className="w-5 h-5 text-zinc-400" />
            <h3 className="text-[17px] font-medium text-white">近期能量轨迹</h3>
          </div>
          <div className="space-y-0">
            {RECENT_ACTIVITY.map((activity, i) => (
              <div key={activity.id} className="relative pl-8 pb-8 group last:pb-0">
                {/* Timeline line */}
                {i !== RECENT_ACTIVITY.length - 1 && (
                  <div className="absolute left-[11px] top-8 bottom-0 w-px bg-gradient-to-b from-white/20 to-white/5 group-hover:from-white/40 transition-colors" />
                )}
                {/* Timeline dot */}
                <div className={cn(
                  "absolute left-0 top-2 w-6 h-6 rounded-full border-4 border-[#050505] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                  activity.type === 'report' ? 'bg-emerald-500 shadow-emerald-500/20' : activity.type === 'kit' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-indigo-500 shadow-indigo-500/20'
                )}>
                  <div className="w-1.5 h-1.5 bg-[#050505] rounded-full" />
                </div>
                
                <div className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg">
                  <div>
                    <h4 className="text-[15px] font-medium text-zinc-200 mb-1.5 group-hover:text-white transition-colors">{activity.title}</h4>
                    <p className="text-[12px] text-zinc-500 flex items-center gap-1.5">
                      <CalendarDays className="w-3 h-3" /> {activity.date}
                    </p>
                  </div>
                  <span className={cn(
                    "text-[13px] font-mono font-medium px-3 py-1 rounded-lg bg-black/40 border border-white/5",
                    activity.cost.includes('-') ? "text-amber-400" : activity.cost === '免费' ? "text-emerald-400" : "text-zinc-300"
                  )}>{activity.cost}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 text-center text-[13px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors py-3 rounded-xl hover:bg-white/5">
            查看完整记录 <ChevronRight className="w-3 h-3 inline-block ml-1" />
          </button>
        </motion.div>

        {/* Data & Privacy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-[32px] border border-white/5 bg-zinc-900/50 p-8 mt-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-zinc-400" />
            <h3 className="text-[17px] font-medium text-white">数据与隐私安全</h3>
          </div>
          <p className="text-[13px] text-zinc-500 mb-6 leading-relaxed">
            我们深知生辰数据与情绪倾诉的高度隐私性。您的输入仅用于生成当次的能量报告与 AI 回复，绝不向第三方泄露。
          </p>
          <button className="w-full rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 px-5 py-4 text-[14px] font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
            <Trash2 className="w-4 h-4" /> 一键清除所有记录与对话
          </button>
        </motion.div>

        {/* Black Gold Invitation */}
        {showBlackGold && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 rounded-[32px] border border-amber-500/30 bg-gradient-to-br from-amber-900/40 to-black p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldAlert className="w-32 h-32 text-amber-500" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Star className="w-3 h-3" /> Exclusive
              </div>
              <h3 className="text-3xl font-serif text-amber-400 mb-4">黑金邀请函</h3>
              <p className="text-[15px] text-amber-200/70 mb-8 max-w-[240px] leading-relaxed">
                首席气象师 1v1 深度梳理与高端实物周边定制。仅限高阶玩家。
              </p>
              <button className="w-full rounded-2xl bg-amber-500 text-black px-6 py-4 text-[15px] font-medium hover:bg-amber-400 transition-colors shadow-[0_0_30px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2">
                预约私密咨询 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
