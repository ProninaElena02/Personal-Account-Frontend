// у пользователя будет иллюзия, что он переходит между разными страницами
// SPA означает: браузер не перезагружает всю страницу при переходе, а просто подменяет компоненты React внутри одного HTML-файла.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import type React from 'react';
import ProtectedRoute from './components/hoc/ProtectedRoute';
import { selectIsAuth, selectAuthLoading, selectAuthError } from './store/authSlice';
import StatusWrapper from './components/hoc/StatusWrapper';

const App: React.FC = () => {
  const isAuth = useSelector(selectIsAuth);
  const authLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  return (
    <BrowserRouter>
      <StatusWrapper loading={authLoading} error={authError}>
        <Routes> 
          {/* они как раз и будут направлять нас на нужные компоненты  */}
          <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/profile" replace />} />
          <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/profile" replace />} />
          <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to={isAuth ? "/profile" : "/login"} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </StatusWrapper>
    </BrowserRouter>
  );
};

export default App;