import { useState, useEffect } from 'react';
import { LogOut, Crown, ShieldAlert, ChevronRight, Zap, FileText, Settings, CreditCard, Umbrella, Star, Hexagon, TrendingUp, History, Lock, ArrowRight, Gift, ShieldCheck, Trash2, Eye, Sparkles, CalendarDays, Archive, BookOpen } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const RECENT_PATTERNS = [
  { id: 1, type: 'pattern', title: '在不确定中提前用力', desc: '过去两周高频出现。建议：先降低内部噪音，再安排动作。', status: '正在改善' },
  { id: 2, type: 'window', title: '错过沟通窗口', desc: '常在收束期强行沟通导致摩擦。建议：参考节律地图的上升窗口。', status: '需关注' },
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
    <div className="min-h-full text-ink pb-32 md:pb-16 selection:bg-seal/20 font-serif">
      <div className="max-w-3xl mx-auto px-6 pt-12 md:pt-20 relative z-10 space-y-20">
        
        <header className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-[11px] tracking-[0.4em] text-ink/50 uppercase font-sans mb-3">
              Growth Archive
            </div>
            <h1 className="text-3xl font-light tracking-[0.1em] text-ink mb-2">长期成长档案</h1>
            <p className="text-[14px] text-ink/60 tracking-widest">你的结构资产与成长证据</p>
          </motion.div>
          
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleSignOut} 
            className="rounded-full bg-mist p-4 text-ink/60 hover:bg-white hover:text-seal transition-colors border border-ink/10 shadow-sm"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.5} />
          </motion.button>
        </header>

        {/* Core Matrix Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-mist border border-ink/10 p-8 relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-seal/5 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
            <div className="relative shrink-0">
              <img 
                src={auth.currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser.uid}`} 
                alt="Avatar" 
                className="h-24 w-24 rounded-full border border-ink/20 bg-white object-cover shadow-sm"
              />
              <div className="absolute -bottom-2 -right-2 bg-seal text-white text-[10px] tracking-widest px-2.5 py-1 rounded-full border border-white font-sans">
                Lv.3
              </div>
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-2.5 py-1 text-[10px] tracking-widest text-ink/70 mb-4 border border-ink/10 font-sans">
                <Archive className="w-3 h-3" /> 长期底盘已建立
              </div>
              <h2 className="text-2xl text-ink mb-2 tracking-widest">{auth.currentUser.displayName || '能量行者'}</h2>
              <p className="text-[14px] text-ink/60 font-serif tracking-wider leading-[1.8]">
                核心张力：<span className="text-ink">木火相刑</span><br/>
                长期主轴：<span className="text-ink">在不确定中寻找秩序</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Pattern Review Snapshot */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-5 h-5 text-ink/60" strokeWidth={1.5} />
            <h3 className="text-[18px] text-ink tracking-widest">模式回顾快照</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RECENT_PATTERNS.map((pattern) => (
              <div key={pattern.id} className="bg-white/60 border border-ink/10 p-6 shadow-sm hover:bg-white transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-[15px] text-ink tracking-widest font-medium">{pattern.title}</h4>
                  <span className={cn(
                    "text-[10px] font-sans tracking-widest px-2 py-1 border",
                    pattern.status === '正在改善' ? "text-jade border-jade/20 bg-jade/5" : "text-seal border-seal/20 bg-seal/5"
                  )}>
                    {pattern.status}
                  </span>
                </div>
                <p className="text-[13px] text-ink/60 leading-[2.0] text-justify">
                  {pattern.desc}
                </p>
              </div>
            ))}
          </div>
          
          <div className="bg-mist border border-ink/10 p-6 mt-4">
            <h4 className="text-[14px] text-ink mb-2 tracking-widest">下一步改善方向</h4>
            <p className="text-[13px] text-ink/70 leading-[2.0] text-justify">
              如果你想继续往更稳的方向走，下一步值得练习的是：<strong className="text-ink font-medium">更早识别自己什么时候已经开始局部过热</strong>。系统后续会更关注你在这类场景中的节律使用方式。
            </p>
          </div>
        </motion.div>

        {/* Deep Lab */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Hexagon className="w-5 h-5 text-ink/60" strokeWidth={1.5} />
            <h3 className="text-[18px] text-ink tracking-widest">深度实验室</h3>
          </div>

          <div className="border border-ink/20 bg-ink/5 p-8 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-ink/60" strokeWidth={1.5} />
                <h3 className="text-[16px] text-ink tracking-widest">高阶结构解析</h3>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-ink/60 bg-white/50 px-2.5 py-1 border border-ink/10 tracking-widest font-sans">
                <Lock className="w-3 h-3" /> 需完整出生信息
              </div>
            </div>
            <p className="text-[14px] text-ink/70 mb-8 leading-[2.2] relative z-10 text-justify">
              如果你想更完整地理解自己的长期结构、阶段主题与深层反复模式，可以进入深度分析。它的价值不在于替你下更重的结论，而在于帮助你更完整地看懂自己的人生结构。
            </p>
            <button className="w-full bg-white border border-ink/20 py-3.5 text-center text-[13px] text-ink/80 hover:bg-ink hover:text-white transition-colors flex items-center justify-center gap-2 tracking-widest">
              补全信息并解锁
            </button>
          </div>
        </motion.div>

        {/* Black Gold Invitation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-12 border border-gold/30 bg-ink p-10 relative overflow-hidden group text-center flex flex-col items-center shadow-lg"
          onClick={simulateSpend}
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] text-gold uppercase tracking-widest mb-6 font-sans">
              <Star className="w-3 h-3" /> Deep Service
            </div>
            <h3 className="text-[20px] text-paper mb-5 tracking-widest">真人周期咨询</h3>
            <p className="text-[14px] text-paper/70 mb-8 max-w-[280px] leading-[2.2]">
              首席气象师 1v1 深度梳理。适合有高意图、低频、但更重度问题的阶段。
            </p>
            <button className="bg-gold text-ink px-8 py-3.5 text-[14px] hover:bg-gold/90 transition-colors flex items-center justify-center gap-2 tracking-widest">
              预约私密咨询 <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
