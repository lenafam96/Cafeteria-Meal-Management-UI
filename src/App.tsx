import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Calendar, 
  Users, 
  Lock, 
  Unlock, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  Utensils,
  RefreshCw
} from 'lucide-react';
import { projectId, publicAnonKey } from './utils/supabase/info';

// --- API Helper ---

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-c08f8213`;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const headers = {
    'Authorization': `Bearer ${publicAnonKey}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// --- Types ---

type MealStatus = 'yes' | 'no';

interface StaffMember {
  id: string;
  name: string;
  department: string;
  todayStatus: MealStatus;
  extraMeals: number;
}

interface WeeklyStaffMember {
  id: string;
  name: string;
  weeklySchedule: Record<string, MealStatus>;
  total: number;
}

// --- Components ---

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

const Dashboard = ({ onNavigate }: { onNavigate: (screen: 'dashboard' | 'list' | 'weekly') => void }) => {
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
      <Header 
        title="Cafeteria" 
        subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} 
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
        <div className={`rounded-xl p-4 flex items-center justify-between border-l-8 shadow-sm ${
          locked ? 'bg-white border-emerald-500' : 'bg-red-50 border-red-500'
        }`}>
          <div>
            <div className="font-bold text-lg text-slate-800">
              {locked ? 'Orders Locked' : 'Orders Open'}
            </div>
            <div className="text-slate-500 text-sm">
              {locked ? 'List is final for today' : 'Changes allowed until 8:00 AM'}
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
            onClick={() => onNavigate('list')}
            className="bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 flex items-center justify-between group transition-all active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-700">
                <Utensils size={28} />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-slate-900">View Meal List</div>
                <div className="text-slate-500">Check individual orders</div>
              </div>
            </div>
            <ChevronLeft size={24} className="rotate-180 text-slate-400" />
          </button>

          <button 
            onClick={() => onNavigate('weekly')}
            className="bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 flex items-center justify-between group transition-all active:scale-95"
          >
             <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full text-purple-700">
                <Calendar size={28} />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-slate-900">Weekly View</div>
                <div className="text-slate-500">Plan ahead for the week</div>
              </div>
            </div>
            <ChevronLeft size={24} className="rotate-180 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

const MealList = ({ onBack }: { onBack: () => void }) => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    fetchAPI('/list')
      .then(data => {
        setStaffList(data.staff);
        setLocked(data.locked);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleStatus = async (staff: StaffMember) => {
    if (locked) return;
    
    // Optimistic update
    const newStatus = staff.todayStatus === 'yes' ? 'no' : 'yes';
    const newExtra = newStatus === 'no' ? 0 : staff.extraMeals; // Reset extra if disabling
    
    setStaffList(prev => prev.map(s => 
      s.id === staff.id ? { ...s, todayStatus: newStatus, extraMeals: newExtra } : s
    ));

    try {
      await fetchAPI('/update-order', {
        method: 'POST',
        body: JSON.stringify({
          staffId: staff.id,
          status: newStatus,
          extra: newExtra
        })
      });
    } catch (err) {
      console.error(err);
      loadData(); // Revert on error
    }
  };

  const incrementExtra = async (e: React.MouseEvent, staff: StaffMember) => {
    e.stopPropagation();
    if (locked || staff.todayStatus === 'no') return;

    const newExtra = staff.extraMeals + 1;
    setStaffList(prev => prev.map(s => 
      s.id === staff.id ? { ...s, extraMeals: newExtra } : s
    ));

    try {
      await fetchAPI('/update-order', {
        method: 'POST',
        body: JSON.stringify({
          staffId: staff.id,
          status: staff.todayStatus,
          extra: newExtra
        })
      });
    } catch (err) {
      console.error(err);
      loadData();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <Header title="Today's List" onBack={onBack} />
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Loading...</div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {staffList.map((staff) => (
              <div 
                key={staff.id}
                onClick={() => toggleStatus(staff)}
                className={`flex items-center justify-between p-4 rounded-xl border shadow-sm transition-all ${
                  staff.todayStatus === 'yes' 
                    ? 'bg-white border-emerald-100' 
                    : 'bg-slate-100 border-slate-200 opacity-60'
                } ${!locked ? 'active:scale-[0.98] cursor-pointer' : ''}`}
              >
                <div>
                  <div className={`text-lg font-bold ${staff.todayStatus === 'yes' ? 'text-slate-900' : 'text-slate-500'}`}>
                    {staff.name}
                  </div>
                  <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">
                    {staff.department}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {staff.todayStatus === 'yes' && (
                    <button 
                      onClick={(e) => incrementExtra(e, staff)}
                      className="flex flex-col items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-lg border border-amber-200 active:bg-amber-200"
                    >
                      <span className="text-xs font-bold uppercase">Extra</span>
                      <span className="text-xl font-black">+{staff.extraMeals}</span>
                    </button>
                  )}
                  
                  {staff.todayStatus === 'yes' ? (
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-full">
                      <CheckCircle2 size={32} strokeWidth={2.5} />
                    </div>
                  ) : (
                    <div className="bg-slate-200 text-slate-400 p-2 rounded-full">
                      <XCircle size={32} strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center text-slate-400 text-sm pb-8">
            {locked ? 'List is locked' : 'Tap a row to toggle meal status'}
          </div>
        </div>
      )}
    </div>
  );
};

const WeeklyView = ({ onBack }: { onBack: () => void }) => {
  const [staffList, setStaffList] = useState<WeeklyStaffMember[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  console.log(dates, ChefHat, RefreshCw)

  useEffect(() => {
    fetchAPI('/weekly')
      .then(data => {
        setStaffList(data.staff);
        setDates(data.dates);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <Header title="Weekly Overview" onBack={onBack} />

      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400">Loading...</div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="p-4 font-bold text-slate-700 sticky left-0 bg-slate-100 z-10 border-r border-slate-200">Name</th>
                      {days.map(day => (
                        <th key={day} className="p-4 font-bold text-slate-600 text-center min-w-[60px]">{day}</th>
                      ))}
                      <th className="p-4 font-bold text-slate-700 text-center bg-slate-50 border-l border-slate-200">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {staffList.map(staff => (
                      <tr key={staff.id} className="hover:bg-slate-50">
                        <td className="p-4 font-semibold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                          {staff.name}
                        </td>
                        {days.map(day => {
                          const isEating = staff.weeklySchedule[day] === 'yes';
                          return (
                            <td key={day} className="p-3 text-center">
                              <div className="flex justify-center">
                                {isEating ? (
                                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <CheckCircle2 size={20} />
                                  </div>
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                                )}
                              </div>
                            </td>
                          );
                        })}
                        <td className="p-4 text-center font-bold text-slate-900 bg-slate-50 border-l border-slate-100">
                          {staff.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-4 bg-blue-50 text-blue-800 p-4 rounded-lg text-sm border border-blue-100 flex gap-2">
              <Users size={20} className="shrink-0" />
              <p>
                Scroll horizontally to see the full week. <br/>
                <strong>Note:</strong> Future days are subject to change until 8:00 AM on that day.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'list' | 'weekly'>('dashboard');

  // Seed data on load
  useEffect(() => {
    fetchAPI('/init').catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center">
      {/* Mobile Frame Constraint for Desktop Viewing */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl overflow-hidden relative">
        {currentScreen === 'dashboard' && <Dashboard onNavigate={setCurrentScreen} />}
        {currentScreen === 'list' && <MealList onBack={() => setCurrentScreen('dashboard')} />}
        {currentScreen === 'weekly' && <WeeklyView onBack={() => setCurrentScreen('dashboard')} />}
      </div>
    </div>
  );
}
