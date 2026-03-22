import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Wind, Compass, Calendar as CalendarIcon, Lock, Cloud, Leaf, BookOpen, ChevronDown, MessageSquare, Crown } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { getEnergyAdvice } from '../services/gemini';
import { cn } from '../lib/utils';

const QUICK_PROMPTS = [
  "今日心绪不宁，求一签解惑。",
  "面临抉择，不知进退如何？",
  "近期人际纷扰，如何化解？",
  "感觉能量低迷，求转运之法。"
];

const CALENDAR_EVENTS = [
  { day: 3, event: '水星逆行', type: 'ji', desc: '言多必失，宜静心少言。' },
  { day: 8, event: '满月盈亏', type: 'ji', desc: '情绪满溢，忌冲动行事。' },
  { day: 11, event: '木星顺行', type: 'yi', desc: '贵人暗助，宜拓展人脉。' },
  { day: 14, event: '新月祈福', type: 'yi', desc: '万物复苏，宜开启新篇。' },
];

export function FlowPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showRadar, setShowRadar] = useState(false);
  const [radarScanning, setRadarScanning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const q = query(
      collection(db, `users/${auth.currentUser.uid}/messages`),
      orderBy('createdAt', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${auth.currentUser!.uid}/messages`);
    });

    return () => unsubscribe();
  }, []);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || !auth.currentUser) return;
    
    const userMsg = text;
    setInput('');
    setIsLoading(true);

    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/messages`), {
        role: 'user',
        text: userMsg,
        createdAt: serverTimestamp()
      }).catch(error => handleFirestoreError(error, OperationType.CREATE, `users/${auth.currentUser!.uid}/messages`));

      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const aiResponse = await getEnergyAdvice(userMsg, history, userProfile);

      await addDoc(collection(db, `users/${auth.currentUser.uid}/messages`), {
        role: 'model',
        text: aiResponse,
        createdAt: serverTimestamp()
      }).catch(error => handleFirestoreError(error, OperationType.CREATE, `users/${auth.currentUser!.uid}/messages`));
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startRadarScan = () => {
    setRadarScanning(true);
    setTimeout(() => {
      setRadarScanning(false);
      setShowRadar(true);
    }, 3000);
  };

  return (
    <div className="min-h-full bg-[#F4EFE6] text-[#3E362E] pb-24 md:pb-8 selection:bg-[#8C3333]/20">
      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-multiply" />
      
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-8 md:pt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
          
          {/* 1. Hero Section (col-span-8) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-8 bg-white/40 backdrop-blur-sm border border-[#3E362E]/10 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-[#8C3333]/5 rounded-full blur-3xl" />
            <div className="flex gap-8 items-start">
              <div className="relative shrink-0">
                <h1 className="font-serif text-[64px] md:text-[80px] leading-[1] font-light tracking-widest text-[#3E362E]" style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>
                  情绪易燃
                </h1>
                <div className="absolute -bottom-4 -left-6 w-10 h-10 border border-[#8C3333] text-[#8C3333] flex items-center justify-center opacity-80 rotate-12 bg-[#F4EFE6]">
                  <span className="font-serif text-[14px] leading-none" style={{ writingMode: 'vertical-rl' }}>凶</span>
                </div>
              </div>
              <div className="flex flex-col justify-between py-2 space-y-6">
                <div className="w-10 h-10 border border-[#8C3333] flex items-center justify-center rotate-45">
                  <div className="w-8 h-8 border border-[#8C3333] flex items-center justify-center -rotate-45">
                    <span className="text-[#8C3333] text-[12px] font-serif">相</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#3E362E]/70 tracking-[0.2em]">
                    <span className="flex items-center gap-1.5"><Cloud className="w-4 h-4 opacity-50" /> 局部雷暴</span>
                    <span className="w-1 h-1 bg-[#3E362E]/30 rounded-full" />
                    <span className="flex items-center gap-1.5"><Wind className="w-4 h-4 opacity-50" /> 木火相刑</span>
                  </div>
                  <p className="text-[14px] text-[#3E362E]/80 max-w-[280px] leading-[2] font-serif text-justify">
                    今日行运至丙午，火势猛烈，易引发内心情绪的剧烈波动与无名火。建议静心独处，开启防御模式。
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. Date & Theme (col-span-4) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 bg-[#3E362E] text-[#F4EFE6] p-8 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
            <div className="flex justify-between items-start relative z-10">
              <div className="w-12 h-[1px] bg-[#F4EFE6]/30 mt-3" />
              <div className="text-[11px] tracking-[0.4em] text-[#F4EFE6]/60 uppercase text-right" style={{ writingMode: 'vertical-rl' }}>
                Oriental Aesthetics
              </div>
            </div>
            <div className="relative z-10 mt-12">
              <div className="font-serif text-[24px] tracking-widest mb-2">甲辰年</div>
              <div className="font-serif text-[16px] text-[#F4EFE6]/70 tracking-widest">二月十二</div>
            </div>
          </motion.div>

          {/* 3. Yi / Ji Split Cards (col-span-4) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 grid grid-cols-2 gap-4"
          >
            <div className="bg-white/40 backdrop-blur-sm p-6 border border-[#3E362E]/10 flex flex-col items-center justify-center text-center h-full">
              <div className="w-10 h-10 rounded-full border border-[#8C3333]/20 flex items-center justify-center mb-4 bg-white/50">
                <span className="text-[#8C3333] text-[14px] tracking-widest font-serif">宜</span>
              </div>
              <span className="text-[#3E362E] font-serif text-[15px] tracking-widest mb-1.5">独处沉淀</span>
              <span className="text-[#3E362E]/60 font-serif text-[12px] tracking-widest">整理思绪</span>
            </div>
            <div className="bg-white/40 backdrop-blur-sm p-6 border border-[#3E362E]/10 flex flex-col items-center justify-center text-center h-full">
              <div className="w-10 h-10 rounded-full border border-[#3E362E]/20 flex items-center justify-center mb-4 bg-white/50">
                <span className="text-[#3E362E]/60 text-[14px] tracking-widest font-serif">忌</span>
              </div>
              <span className="text-[#3E362E] font-serif text-[15px] tracking-widest mb-1.5">向上汇报</span>
              <span className="text-[#3E362E]/60 font-serif text-[12px] tracking-widest">冲动决策</span>
            </div>
          </motion.div>

          {/* 4. The Oracle Chat (col-span-8, row-span-2) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-8 md:row-span-2 border border-[#3E362E]/10 bg-white/50 backdrop-blur-md flex flex-col h-[600px] md:h-auto shadow-sm relative overflow-hidden"
          >
            {/* Header */}
            <div className="h-14 border-b border-[#3E362E]/10 flex items-center justify-between px-6 bg-white/40 shrink-0">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-[#3E362E]/60" strokeWidth={1.5} />
                <span className="text-[14px] font-serif text-[#3E362E] tracking-[0.3em]">相谕 · 灵机</span>
              </div>
              <div className="w-2 h-2 bg-[#8C3333]/60 rounded-full animate-pulse" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {messages.length === 0 && (
                <div className="flex flex-col h-full justify-center items-center text-center opacity-80">
                  <p className="text-[14px] text-[#3E362E]/70 font-serif leading-[2.5] max-w-[280px] mb-8">
                    心有千结，皆可诉诸于此。<br/>
                    卦象已成，静候君音。
                  </p>
                  <div className="w-full max-w-[320px] space-y-3">
                    {QUICK_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="block w-full text-center px-5 py-3 bg-white/60 border border-[#3E362E]/10 text-[13px] text-[#3E362E]/80 hover:bg-white transition-all font-serif tracking-widest"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={cn(
                      "max-w-[85%] text-[14px] leading-[2] font-serif tracking-wide p-5",
                      msg.role === 'user' 
                        ? "ml-auto bg-[#3E362E]/5 border border-[#3E362E]/10 text-[#3E362E]" 
                        : "bg-white border border-[#3E362E]/10 text-[#3E362E]/90 shadow-sm"
                    )}
                  >
                    {msg.text}
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="bg-white border border-[#3E362E]/10 text-[#3E362E]/60 font-serif text-[14px] p-5 max-w-[85%] shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#3E362E]/40 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#3E362E]/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-[#3E362E]/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-5 bg-white/60 border-t border-[#3E362E]/10 shrink-0">
              <div className="flex gap-3 items-center bg-white border border-[#3E362E]/20 p-1.5 pl-5 focus-within:border-[#3E362E]/50 transition-colors shadow-sm">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="诉说心事..."
                  className="flex-1 bg-transparent text-[14px] text-[#3E362E] placeholder:text-[#3E362E]/30 focus:outline-none font-serif tracking-widest"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="flex h-10 w-12 flex-none items-center justify-center text-[#3E362E]/60 hover:text-[#3E362E] transition-colors disabled:opacity-30"
                >
                  <Send className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* 5. Almanac (col-span-4) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-4 bg-white/40 backdrop-blur-sm border border-[#3E362E]/10 p-6 md:p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="inline-flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#3E362E]/60" strokeWidth={1.5} />
                <h2 className="text-lg font-serif text-[#3E362E] tracking-widest">行动黄历</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-8">
              {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                <div key={day} className="text-center text-[10px] font-serif text-[#3E362E]/40 mb-2">{day}</div>
              ))}
              {Array.from({ length: 14 }).map((_, i) => {
                const isToday = i === 6;
                const event = CALENDAR_EVENTS.find(e => e.day === i);
                
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "aspect-square flex flex-col items-center justify-center relative transition-all border",
                      isToday ? "bg-[#3E362E] border-[#3E362E] text-white shadow-md" : "bg-white/50 border-[#3E362E]/10 text-[#3E362E]/60",
                      event && !isToday && "border-[#3E362E]/30 text-[#3E362E]"
                    )}
                  >
                    <span className="text-[13px] font-serif">{i + 1}</span>
                    {event?.type === 'ji' && <div className={cn("absolute bottom-1 w-1 h-1 rounded-full", isToday ? "bg-white" : "bg-[#3E362E]/40")} />}
                    {event?.type === 'yi' && <div className={cn("absolute bottom-1 w-1 h-1 rounded-full", isToday ? "bg-[#8C3333]" : "bg-[#8C3333]/60")} />}
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 flex-1">
              {CALENDAR_EVENTS.slice(0, 2).map((evt, i) => (
                <div key={i} className="flex items-start gap-4 bg-white/60 p-4 border border-[#3E362E]/10">
                  <span className={cn(
                    "text-[12px] w-6 h-6 shrink-0 flex items-center justify-center border font-serif",
                    evt.type === 'ji' ? "border-[#3E362E]/30 text-[#3E362E]" : "border-[#8C3333]/30 text-[#8C3333]"
                  )}>
                    {evt.type === 'ji' ? '忌' : '宜'}
                  </span>
                  <div>
                    <div className="text-[14px] font-serif text-[#3E362E] tracking-widest mb-1">{evt.event}</div>
                    <div className="text-[12px] text-[#3E362E]/70 leading-[1.8] font-serif">{evt.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 6. Synastry Chart (col-span-6) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-6 bg-white/50 backdrop-blur-sm border border-[#3E362E]/10 p-6 md:p-8 flex flex-col"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-xl font-serif text-[#3E362E] mb-2 tracking-widest">合盘推演</h3>
                <p className="text-[12px] text-[#3E362E]/50 font-serif tracking-widest">洞悉因果羁绊</p>
              </div>
              <Compass className={cn("w-6 h-6 text-[#3E362E]/40", radarScanning && "animate-spin text-[#8C3333]")} strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              {!showRadar ? (
                <div className="space-y-5 relative">
                  {radarScanning && (
                    <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center border border-[#3E362E]/10">
                      <Compass className="w-8 h-8 text-[#3E362E]/80 animate-spin mb-4" strokeWidth={1} />
                      <span className="text-[12px] text-[#3E362E]/80 font-serif tracking-[0.3em]">推演命盘中...</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="对方生辰 (如 19950815)" 
                      className="w-full bg-white border border-[#3E362E]/20 px-4 py-3 text-[13px] text-[#3E362E] placeholder:text-[#3E362E]/30 focus:outline-none focus:border-[#3E362E]/50 transition-colors font-serif tracking-widest text-center shadow-sm"
                    />
                    <input 
                      type="text" 
                      placeholder="时辰 (选填)" 
                      className="w-full bg-white border border-[#3E362E]/20 px-4 py-3 text-[13px] text-[#3E362E] placeholder:text-[#3E362E]/30 focus:outline-none focus:border-[#3E362E]/50 transition-colors font-serif tracking-widest text-center shadow-sm"
                    />
                  </div>
                  <button 
                    onClick={startRadarScan}
                    disabled={radarScanning}
                    className="w-full bg-transparent border border-[#3E362E] text-[#3E362E] px-4 py-3 text-[13px] font-serif hover:bg-[#3E362E] hover:text-white transition-colors tracking-widest disabled:opacity-50"
                  >
                    开启推演
                  </button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative"
                >
                  <div className="flex items-center justify-around mb-6 bg-white/60 p-4 border border-[#3E362E]/10">
                    <div className="text-center">
                      <div className="text-3xl font-serif text-[#3E362E]">85<span className="text-sm text-[#3E362E]/50">%</span></div>
                      <div className="text-[10px] text-[#3E362E]/50 font-serif tracking-[0.2em]">契合度</div>
                    </div>
                    <div className="w-[1px] h-10 bg-[#3E362E]/10" />
                    <div className="text-center">
                      <div className="text-2xl font-serif text-[#8C3333]">冥王星</div>
                      <div className="text-[10px] text-[#3E362E]/50 font-serif tracking-[0.2em]">核心业力</div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F4EFE6] via-[#F4EFE6]/90 to-transparent z-10 flex flex-col items-center justify-end pb-2">
                      <Lock className="w-4 h-4 text-[#3E362E]/40 mb-3" strokeWidth={1.5} />
                      <span className="text-[12px] text-[#8C3333] font-serif tracking-widest text-center block mb-4">
                        存在深层业力冲突，邀请好友解开完整签文
                      </span>
                      <button className="bg-[#3E362E] text-white px-6 py-2.5 text-[12px] font-serif hover:bg-[#3E362E]/90 transition-colors tracking-widest">
                        邀请解签
                      </button>
                    </div>
                    <p className="text-[13px] text-[#3E362E]/40 font-serif leading-[2] blur-[3px] select-none text-justify">
                      你们的相遇带有强烈的宿命感。对方的金星落在你的第十二宫，这意味着在潜意识深处，你们有着难以言喻的吸引力。然而，土星的刑克相位提示着，这段关系中可能会出现控制与反控制的权力斗争...
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* 7. Amulet Card (col-span-6) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="md:col-span-6 bg-white/50 backdrop-blur-sm border border-[#3E362E]/10 p-6 md:p-8 relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#8C3333]/5 rounded-bl-full" />
            <div className="flex items-center gap-2 mb-8 relative z-10">
              <Leaf className="w-5 h-5 text-[#3E362E]/60" strokeWidth={1.5} />
              <span className="text-[13px] font-serif tracking-[0.2em] text-[#3E362E]/60">静心锦囊</span>
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="text-2xl font-serif text-[#3E362E] mb-4 tracking-widest">隔绝负能量场</h3>
              <p className="text-[14px] text-[#3E362E]/70 mb-8 font-serif leading-[2] max-w-[280px]">
                状态极差时，为你量身定制的急救补剂。包含专属转运判词与高频疗愈音频。
              </p>
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-[#3E362E]/10 relative z-10">
              <span className="text-xl font-serif text-[#3E362E] tracking-widest">¥9.9</span>
              <button className="bg-[#3E362E] text-white px-8 py-3 text-[13px] font-serif hover:bg-[#3E362E]/90 transition-colors tracking-widest">
                求取
              </button>
            </div>
          </motion.div>

          {/* 8. Prime Subscription (col-span-12) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="md:col-span-12 bg-[#3E362E] p-8 md:p-12 relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-[#A67C52]" strokeWidth={1.5} />
                <h3 className="text-2xl font-serif text-white tracking-widest">相谕 VIP · 解锁天机</h3>
              </div>
              <p className="text-[14px] text-white/70 leading-[2] font-serif max-w-[400px]">
                生活是一场长期的修行。解锁高级权限，获得最完整的运势掌控感。包含无限次灵机推演、每日高阶黄历与专属能量护身符。
              </p>
            </div>
            <div className="relative z-10 w-full md:w-auto">
              <button className="w-full md:w-[240px] bg-[#A67C52] text-[#3E362E] px-6 py-4 text-[14px] font-serif hover:bg-[#A67C52]/90 transition-colors tracking-widest">
                订阅 ¥19.9 / 月
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
