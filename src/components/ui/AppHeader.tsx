import React from 'react';
import { ChevronLeft, Lock, Unlock } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  isLocked?: boolean;
  onBack?: () => void;
  className?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  subtitle, 
  isLocked, 
  onBack,
  className = ""
}) => {
  return (
    <div className={`w-full bg-white border-b border-slate-200 px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-50 mb-4${className}`}>
      <div className="flex items-center gap-3 overflow-hidden">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-1 -ml-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors flex-shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft size={28} />
          </button>
        )}
        
        <div className="flex flex-col min-w-0">
          <h1 className="text-lg font-bold text-slate-900 leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs font-medium text-slate-500 leading-tight truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {isLocked !== undefined && (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ml-4 flex-shrink-0 ${
          isLocked 
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {isLocked ? (
            <>
              <Lock size={12} strokeWidth={3} />
              <span>Khoá đăng ký</span>
            </>
          ) : (
            <>
              <Unlock size={12} strokeWidth={3} />
              <span>Mở khoá</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
