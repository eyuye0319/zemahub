import {StrictMode, Suspense, lazy} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {AuthProvider} from './context/AuthContext';
import './index.css';

// The admin dashboard is a separate bundle, downloaded only when someone opens /admin.
const AdminApp = lazy(() => import('./admin/AdminApp'));
const isAdminRoute = /^\/admin(\/|$)/.test(window.location.pathname);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      {isAdminRoute ? (
        <Suspense fallback={<div className="min-h-screen bg-[#16030A]" />}>
          <AdminApp />
        </Suspense>
      ) : (
        <App />
      )}
    </AuthProvider>
  </StrictMode>,
);
