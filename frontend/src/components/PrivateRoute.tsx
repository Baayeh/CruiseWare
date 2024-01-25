/* eslint-disable @typescript-eslint/no-explicit-any */

import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = ({ redirectPath = '/login', children }: any) => {
  const accessToken = localStorage.getItem('accessToken') || '';
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to={redirectPath} state={{ from: location }} />;
  }

  return children || <Outlet />;
};

export default PrivateRoute;
