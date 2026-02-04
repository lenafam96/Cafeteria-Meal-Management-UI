import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Calendar, Lock, Unlock, ChevronLeft } from 'lucide-react';
import { AppHeader } from '../../components/ui/AppHeader';
import { fetchAPI } from '../../services/supabaseService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI('/dashboard')
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-full flex items-center justify-center text-slate-400">Loading...</div>;

  const { total, main, extra, locked } = data || { total: 0, main: 0, extra: 0, locked: false };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AppHeader
        title="Bếp ăn – Hôm nay"
        subtitle={new Date().toLocaleDateString('vn-VI', { weekday: 'long', month: 'long', day: 'numeric' })}
        isLocked={locked}
      />
      <div className="flex-1 p-4 -mt-4 flex flex-col gap-4 overflow-y-auto pb-8">
        {/* Main Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
          <h2 className="text-slate-500 font-semibold uppercase tracking-wider text-sm mb-2">Total Meals to Cook</h2>
          <div className="text-8xl font-black text-slate-900 leading-none mb-4">{total}</div>
          <div className="flex w-full gap-4 mt-2">
            <div className="flex-1 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
              <div className="text-3xl font-bold text-emerald-700">{main}</div>
              <div className="text-emerald-800 text-sm font-medium">Standard</div>
            </div>
            <div className="flex-1 bg-amber-50 rounded-xl p-3 border border-amber-100">
              <div className="text-3xl font-bold text-amber-700">{extra}</div>
              <div className="text-amber-800 text-sm font-medium">Extra</div>
            </div>
          </div>
        </div>
        {/* Lock Status */}
        <div className={`rounded-xl p-4 flex items-center justify-between border-l-8 shadow-sm ${locked ? 'bg-white border-emerald-500' : 'bg-red-50 border-red-500'
          }`}>
          <div>
            <div className="font-bold text-lg text-slate-800">
              {locked ? 'Khoá đăng ký' : 'Đăng ký mở'}
            </div>
            <div className="text-slate-500 text-sm">
              {locked ? 'Danh sách đã chốt' : 'Danh sách còn mở để đăng ký đến 8:00 AM'}
            </div>
          </div>
          {locked ? (
            <Lock className="text-emerald-600" size={32} />
          ) : (
            <Unlock className="text-red-500" size={32} />
          )}
        </div>
        {/* Actions */}
        <div className="grid grid-cols-1 gap-4 mt-2">
          <button
            onClick={() => navigate('/list')}
            className="bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 flex items-center justify-between group transition-all active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-700">
                <Utensils size={28} />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-slate-900">Xem danh sách </div>
                <div className="text-slate-500">Kiểm tra danh sách đăng ký ăn</div>
              </div>
            </div>
            <ChevronLeft size={24} className="rotate-180 text-slate-400" />
          </button>
          <button
            onClick={() => navigate('/weekly')}
            className="bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 flex items-center justify-between group transition-all active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full text-purple-700">
                <Calendar size={28} />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-slate-900">Báo cáo  tuần</div>
                <div className="text-slate-500">Chi tiết đăng ký ăn theo tuần</div>
              </div>
            </div>
            <ChevronLeft size={24} className="rotate-180 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
