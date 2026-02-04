import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes } from './publicRoutes';
import { privateRoutes } from './privateRoutes';

export default function AppRoutes() {
  // Only pass props that are valid for <Route>
  const filterRouteProps = (route: any) => {
    const { path, element, index, caseSensitive, key } = route;
    return { path, element, index, caseSensitive, key };
  };
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes: index, login */}
        {publicRoutes.map((route) => {
          const props = filterRouteProps(route);
          return <Route {...props} />;
        })}
        {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        {/* Private routes: all other pages */}
        {privateRoutes.map((route) => {
          const props = filterRouteProps(route);
          return <Route {...props} />;
        })}
      </Routes>
    </BrowserRouter>
  );
}
