import { useState, useEffect } from 'react';
import { AppHeader } from '../../components/ui/AppHeader';
import { Users, CheckCircle2 } from 'lucide-react';
import { fetchAPI } from '../../services/supabaseService';
import type { WeeklyStaffMember } from '../../types/user';


const WeeklyView = ({ onBack }: { onBack: () => void }) => {
  const [staffList, setStaffList] = useState<WeeklyStaffMember[]>([]);
  const [dates, setDates] = useState<string[]>([]); 
  const [loading, setLoading] = useState(true);

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
  const start_date = dates[0] ? new Date(dates[0]) : new Date();
  // start_date_string in dd/mm format not dd-mm
  const start_date_str = `${String(start_date.getDate()).padStart(2, '0')}/${String(start_date.getMonth() + 1).padStart(2, '0')}`;
  const last_date = dates[dates.length - 1] ? new Date(dates[dates.length - 1]) : new Date();
  const last_date_str = `${String(last_date.getDate()).padStart(2, '0')}/${String(last_date.getMonth() + 1).padStart(2, '0')}`;
  const date_range_str = `Từ ${start_date_str} đến ${last_date_str}`;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AppHeader title="Thống kê tuần" subtitle={date_range_str} onBack={onBack} />
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
                      <th className="p-4 font-bold text-slate-700 text-center bg-slate-50 border-l border-slate-200">Tổng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {staffList.map(staff => (
                      <tr key={staff.id} className="hover:bg-slate-50">
                        <td className="p-4 font-semibold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                          {staff.name}
                        </td>
                        {days.map(day => {
                          const value = staff.weeklySchedule[day];
                          let cellContent;
                          if (value === 'yes') {
                            cellContent = (
                              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <CheckCircle2 size={20} />
                              </div>
                            );
                          } else if (value === 'no') {
                            cellContent = (
                              <div className="w-2 h-2 rounded-full bg-slate-200" />
                            );
                          } else if (!isNaN(Number(value)) && Number(value) > 0) {
                            cellContent = (
                              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base">
                                {value}
                              </div>
                            );
                          } else {
                            cellContent = (
                              <div className="w-2 h-2 rounded-full bg-slate-200" />
                            );
                          }
                          return (
                            <td key={day} className="p-3 text-center">
                              <div className="flex justify-center">
                                {cellContent}
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
                Cuộn theo chiều ngang để xem cả tuần. <br/>
                <strong>Chú ý:</strong> Các ngày tiếp theo vẫn cho phép điều chỉnh trước 8:00 sáng.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeeklyView;
