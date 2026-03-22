import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Compass, ArrowRight, Loader2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { getEnergyAdvice } from '../services/gemini';
import { cn } from '../lib/utils';

interface CompanionPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompanionPanel({ isOpen, onClose }: CompanionPanelProps) {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const QUICK_PROMPTS = useMemo(() => {
    return t('lab.prompts', { returnObjects: true }) as string[];
  }, [t]);

  useEffect(() => {
    if (!auth.currentUser || !isOpen) return;

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
  }, [isOpen]);

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
      const aiResponse = await getEnergyAdvice(userMsg, history, userProfile, i18n.language);

      await addDoc(collection(db, `users/${auth.currentUser.uid}/messages`), {
        role: 'model',
        text: aiResponse || t('lab.fallback'),
        createdAt: serverTimestamp()
      }).catch(error => handleFirestoreError(error, OperationType.CREATE, `users/${auth.currentUser!.uid}/messages`));
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1A1D1E]/40 backdrop-blur-sm z-[100]"
          />

          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 top-12 md:top-auto md:h-[85vh] md:max-w-md md:right-6 md:left-auto md:bottom-6 bg-[#FDFBF7] rounded-t-[32px] md:rounded-[32px] shadow-2xl z-[101] flex flex-col overflow-hidden font-sans"
          >
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-[#E0F2FE]/50 to-transparent -z-10" />

            {/* Header */}
            <header className="pt-6 pb-4 px-6 shrink-0 flex items-center justify-between relative z-10 border-b border-[#1A1D1E]/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0EA5E9]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold tracking-tight leading-tight">{t('lab.title')}</h2>
                  <p className="text-[12px] text-[#1A1D1E]/50 font-medium">{t('lab.subtitle')}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[#1A1D1E]/60 hover:bg-black/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 relative z-10">
              {messages.length === 0 && !isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-8"
                >
                  <div className="w-20 h-20 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center text-[#0EA5E9] relative">
                    <div className="absolute inset-0 bg-[#0EA5E9]/10 rounded-full animate-ping" />
                    <Compass className="w-10 h-10 relative z-10" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">{t('lab.emptyTitle')}</h2>
                    <p className="text-[14px] text-[#1A1D1E]/50 max-w-[260px] mx-auto leading-relaxed">
                      {t('lab.emptyDesc')}
                    </p>
                  </div>
                  
                  <div className="w-full space-y-3">
                    {QUICK_PROMPTS.map((prompt, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => handleSend(prompt)}
                        className="w-full bg-white border border-[#1A1D1E]/5 p-4 rounded-2xl text-left text-[14px] font-medium text-[#1A1D1E]/80 hover:bg-black/5 hover:text-[#1A1D1E] transition-all flex items-center justify-between shadow-sm"
                      >
                        {prompt}
                        <ArrowRight className="w-4 h-4 text-[#1A1D1E]/30" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex w-full",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[85%] rounded-[24px] px-5 py-3.5 text-[15px] leading-relaxed shadow-sm",
                      msg.role === 'user' 
                        ? "bg-[#1A1D1E] text-white rounded-tr-sm" 
                        : "bg-white border border-[#1A1D1E]/5 text-[#1A1D1E] rounded-tl-sm"
                    )}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-[#1A1D1E]/5 rounded-[24px] rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-[#0EA5E9] animate-spin" />
                      <span className="text-[13px] font-medium text-[#1A1D1E]/50">{t('lab.sensing')}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-[#1A1D1E]/5 shrink-0 relative z-20 pb-safe">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('lab.inputPlaceholder')}
                  className="w-full bg-[#FDFBF7] border border-[#1A1D1E]/10 rounded-full pl-5 pr-12 py-3.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all placeholder:text-[#1A1D1E]/30"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#1A1D1E] text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-[#1A1D1E]/10 disabled:text-[#1A1D1E]/40 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
