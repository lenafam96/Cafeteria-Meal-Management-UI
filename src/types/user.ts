export type MealStatus = 'yes' | 'no';

export interface StaffMember {
  id: string;
  name: string;
  department: string;
  todayStatus: MealStatus;
  extraMeals: number;
}

export interface WeeklyStaffMember {
  id: string;
  name: string;
  weeklySchedule: Record<string, MealStatus>;
  total: number;
}
