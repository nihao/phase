import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, Activity, Compass } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { getEnergyAdvice } from '../services/gemini';
import { cn } from '../lib/utils';

const QUICK_PROMPTS = [
  "我今天特别想推进一件事，但又有点不稳，怎么办？",
  "我最近总在同一个关系问题上打转，今天该先做什么？",
  "我现在到底该继续扛，还是先恢复？"
];

export function LabPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
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

  return (
    <div className="min-h-full text-ink pb-32 md:pb-16 selection:bg-seal/20 flex flex-col font-serif">
      <div className="max-w-3xl mx-auto w-full px-6 pt-12 md:pt-20 flex-1 flex flex-col relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center gap-3 mb-8 shrink-0"
        >
          <div className="text-[11px] tracking-[0.4em] text-ink/50 uppercase font-sans mb-2">
            Companion
          </div>
          <h1 className="text-[24px] text-ink tracking-[0.2em] font-light">灵机陪伴</h1>
          <p className="text-[13px] text-ink/50 tracking-widest mt-2">你的长期节律协作系统</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-mist border border-ink/10 shadow-sm flex flex-col flex-1 min-h-[500px] mb-8 relative overflow-hidden"
        >
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 no-scrollbar">
            {messages.length === 0 && (
              <div className="flex flex-col h-full justify-center items-center text-center mt-10">
                <Compass className="w-8 h-8 text-ink/20 mb-6" strokeWidth={1} />
                <p className="text-[15px] text-ink/70 leading-[2.2] max-w-[320px] mb-12 font-serif text-justify text-center-last">
                  我在这里陪你。<br/>
                  不仅是解答今天的困惑，更是为了在长期的变化里，帮你看见自己的结构，找到更稳的节奏。
                </p>
                <div className="w-full max-w-[360px] space-y-3">
                  {QUICK_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="block w-full text-left px-6 py-4 bg-white/50 border border-ink/10 text-[14px] text-ink/80 hover:bg-white hover:border-ink/30 transition-all tracking-widest shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-10">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={cn(
                    "flex flex-col",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "text-[11px] font-sans tracking-widest mb-2 px-1",
                    msg.role === 'user' ? "text-ink/40" : "text-seal/60"
                  )}>
                    {msg.role === 'user' ? 'YOU' : 'COMPANION'}
                  </div>
                  <div className={cn(
                    "max-w-[85%] text-[15px] leading-[2.2] tracking-wide p-6 font-serif text-justify",
                    msg.role === 'user' 
                      ? "bg-ink/5 border border-ink/10 text-ink" 
                      : "bg-white border border-ink/10 text-ink/90 shadow-sm relative"
                  )}>
                    {msg.role === 'model' && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-seal/20" />
                    )}
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="text-[11px] font-sans tracking-widest mb-2 px-1 text-seal/60">COMPANION</div>
                  <div className="bg-white border border-ink/10 text-ink/60 text-[14px] p-6 max-w-[85%] shadow-sm flex items-center gap-3 relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-seal/20" />
                    <div className="w-1.5 h-1.5 bg-ink/40 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1.5 h-1.5 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-mist border-t border-ink/10 shrink-0">
            <div className="flex gap-3 items-center bg-white border border-ink/20 p-2 pl-6 focus-within:border-ink/50 transition-colors shadow-sm">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="描述你现在的状态或困惑..."
                className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-ink/30 focus:outline-none tracking-widest font-serif"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="flex h-10 w-12 flex-none items-center justify-center text-ink/60 hover:text-ink transition-colors disabled:opacity-30"
              >
                <Send className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
