import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { AuthModal } from './components/AuthModal';
import { FlowPage } from './pages/FlowPage';
import { LabPage } from './pages/LabPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  if (!isAuthReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4EFE6]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3E362E] border-t-transparent" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {!user && <AuthModal />}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={user ? <FlowPage /> : <Navigate to="/" />} />
            <Route path="lab" element={user ? <LabPage /> : <Navigate to="/" />} />
            <Route path="profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
