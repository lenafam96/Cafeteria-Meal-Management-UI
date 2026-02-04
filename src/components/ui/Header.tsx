import { ChevronLeft } from 'lucide-react';

const Header = ({ title, subtitle, onBack }: { title: string, subtitle?: string, onBack?: () => void }) => (
  <div className="bg-slate-900 text-white p-6 pb-8 rounded-b-3xl shadow-lg relative z-10">
    <div className="flex items-center gap-3 mb-2">
      {onBack && (
        <button 
          onClick={onBack}
          className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
      )}
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
    </div>
    {subtitle && <p className="text-slate-300 text-lg font-medium ml-1">{subtitle}</p>}
  </div>
);

export default Header;
