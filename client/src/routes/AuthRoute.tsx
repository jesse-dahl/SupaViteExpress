import React from 'react'
import { useAuth } from '../providers/AuthProvider'
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const AuthRoute = () => {
  const { isAuthed } = useAuth();
  const location = useLocation();

  return isAuthed ? (
    <Outlet />
  ) : (
    <Navigate to={"/sign-in"} replace state={{ path: location.pathname }} />
  );
}

export default AuthRoute;
