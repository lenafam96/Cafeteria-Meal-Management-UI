import type { RouteObject } from 'react-router-dom';
import MealList from '../pages/MealList/';
import WeeklyView from '../pages/WeeklyView/';
import Dashboard from '../pages/Dashboard/';
import React from 'react';

export const privateRoutes: RouteObject[] = [
  {
    path: '/',
    element: React.createElement(Dashboard),
  },
  {
    path: '/list',
    element: React.createElement(MealList, { onBack: () => window.history.back() }),
  },
  {
    path: '/weekly',
    element: React.createElement(WeeklyView, { onBack: () => window.history.back() }),
  },
];
