import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppHeader } from '../../components/ui/AppHeader';
import { CheckCircle2, XCircle } from 'lucide-react';
import { fetchAPI } from '../../services/supabaseService';
import type { StaffMember } from '../../types/user';


const MealList = ({ onBack }: { onBack: () => void }) => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    fetchAPI('/list')
      .then(data => {
        setStaffList(data.staff);
        setLocked(data.locked);
        // setLocked(false);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleStatus = async (staff: StaffMember) => {
    if (locked) return;
    const newStatus = staff.todayStatus === 'yes' ? 'no' : 'yes';
    const newExtra = newStatus === 'no' ? 0 : staff.extraMeals;
    setStaffList(prev => prev.map(s => s.id === staff.id ? { ...s, todayStatus: newStatus, extraMeals: newExtra } : s));
    try {
      await fetchAPI('/update-order', {
        method: 'POST',
        body: JSON.stringify({ staffId: staff.id, status: newStatus, extra: newExtra })
      });
    } catch (err) {
      console.error(err);
      toast.error('Cập nhật trạng thái thất bại. Vui lòng thử lại!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      loadData();
    }
  };

  const incrementExtra = async (e: React.MouseEvent, staff: StaffMember) => {
    e.stopPropagation();
    if (locked || staff.todayStatus === 'no') return;
    const newExtra = staff.extraMeals + 1;
    setStaffList(prev => prev.map(s => s.id === staff.id ? { ...s, extraMeals: newExtra } : s));
    try {
      await fetchAPI('/update-order', {
        method: 'POST',
        body: JSON.stringify({ staffId: staff.id, status: staff.todayStatus, extra: newExtra })
      });
    } catch (err) {
      console.error(err);
      toast.error('Cập nhật số suất ăn thêm thất bại. Vui lòng thử lại!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      loadData();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <ToastContainer />
      <AppHeader
        title="Danh sách bữa ăn"
        subtitle={new Date().toLocaleDateString('vn-VI', { weekday: 'long', month: 'long', day: 'numeric' })}
        onBack={onBack}
        isLocked={locked}
      />
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Loading...</div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {staffList.map((staff) => (
              <div
                key={staff.id}
                onClick={() => toggleStatus(staff)}
                className={`flex items-center justify-between p-4 rounded-xl border shadow-sm transition-all ${staff.todayStatus === 'yes'
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
            {locked ? 'Danh sách đã chốt' : 'Chọn nhân viên để thay đổi trạng thái đăng ký ăn'}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealList;
