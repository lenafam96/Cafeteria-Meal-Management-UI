

import { useEffect } from 'react';
import { fetchAPI } from './services/supabaseService';
import AppRoutes from './routes';

export default function App() {
  useEffect(() => {
    fetchAPI('/init', {method: 'POST'}).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl overflow-hidden relative">
        <AppRoutes />
      </div>
    </div>
  );
}
