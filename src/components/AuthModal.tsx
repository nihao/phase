import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Compass, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AuthModal() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef).catch(error => handleFirestoreError(error, OperationType.GET, `users/${user.uid}`));
      
      if (userSnap && !userSnap.exists()) {
        // Create new user profile
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isPrime: false,
          energyTokens: 0,
          totalSpent: 0,
          createdAt: serverTimestamp()
        }).catch(error => handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}`));
      }
    } catch (error) {
      console.error("Error signing in with Google", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A1D1E]/40 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-[0_20px_60px_rgb(0,0,0,0.1)] relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#FF9F43]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#0EA5E9]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#FF9F43] rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-orange-500/20 relative">
              <Compass className="text-white w-8 h-8" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Sparkles className="w-3 h-3 text-[#FF9F43]" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-[#1A1D1E] mb-2 tracking-tight">{t('auth.welcome')}</h2>
            <p className="text-[14px] text-[#1A1D1E]/50 mb-8 max-w-[240px] leading-relaxed">
              {t('auth.subtitle')}
            </p>

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-[#1A1D1E] text-white rounded-2xl py-4 px-6 text-[15px] font-bold shadow-[0_4px_20px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t('auth.continueWithGoogle')}
                </>
              )}
            </button>
            
            <p className="text-[11px] text-[#1A1D1E]/40 mt-6 max-w-[240px]">
              {t('auth.terms')}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
