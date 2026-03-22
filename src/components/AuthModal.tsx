import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { CloudLightning } from 'lucide-react';

export function AuthModal() {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F4EFE6]/90 backdrop-blur-xl px-6">
      <div className="w-full max-w-md rounded-[32px] border border-[#3E362E]/10 bg-white/90 p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#8C3333]/10 rounded-full blur-[60px]" />
        
        <div className="relative z-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#8C3333]/10 border border-[#8C3333]/20 shadow-[0_0_30px_rgba(140,51,51,0.1)]">
            <CloudLightning className="h-10 w-10 text-[#8C3333]" />
          </div>
          
          <h2 className="mb-2 text-3xl font-serif text-[#3E362E] tracking-wide">相谕 Phase.</h2>
          <p className="mb-8 text-[15px] font-medium text-[#8C3333] tracking-widest uppercase">你的专属能量气象局</p>
          
          <div className="text-left bg-[#3E362E]/5 rounded-2xl p-6 border border-[#3E362E]/5 mb-8 backdrop-blur-sm">
            <p className="text-[14px] text-[#3E362E]/80 leading-relaxed mb-4">
              我们相信：<strong className="text-[#3E362E] font-serif">人生如相，见相非相 (Embrace every phase.)</strong>
            </p>
            <p className="text-[13px] text-[#3E362E]/60 leading-relaxed">
              就像天气有晴有雨，人的状态也有高低起伏。如果你今天效率低下、情绪崩溃，那不是因为你“能力差”或“命不好”，很可能只是你正处于能量的低压带——<strong className="text-[#8C3333]">雨不是你的错，你只需要带把伞。</strong>
            </p>
          </div>
          
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#3E362E] px-4 py-4 text-[15px] font-medium text-white transition-all hover:bg-[#3E362E]/90 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(62,54,46,0.2)]"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google 账号登录
              </>
            )}
          </button>
          
          <p className="mt-6 text-[11px] text-[#3E362E]/50 leading-relaxed">
            本服务提供基于传统文化与现代视角的自我参考框架，不构成任何医疗、心理诊断或命运预测决策依据。若身体/心理极度不适请及时就医。
          </p>
        </div>
      </div>
    </div>
  );
}
