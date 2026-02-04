import Login from '../pages/Login';
import React from 'react';

export const publicRoutes = [
  {
    path: '/login',
    element: React.createElement(Login),
    key: 'login',
  },
];
