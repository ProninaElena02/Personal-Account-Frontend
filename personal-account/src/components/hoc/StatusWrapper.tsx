import React from 'react';
import { useDispatch } from 'react-redux';
import { clearError } from '../../store/authSlice';
interface StatusWrapperProps {
  loading: boolean;
  error: string | null;
  isEmpty?: boolean; 
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}
const StatusWrapper: React.FC<StatusWrapperProps> = ({ 
  loading, 
  error, 
  isEmpty, 
  children,
  loadingComponent = <div className="auth-screen auth-card"><h2 className="auth
title">Загрузка...</h2></div>
}) => {
  const dispatch = useDispatch();
  if (loading) return <>{loadingComponent}</>;
  if (error) return <div className="auth-screen auth-card"> 
        <h2 className="auth-title">Ошибка: {error}</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => dispatch(clearError())}
        >Назад</button>
        </div>;
  if (isEmpty) return <div className="empty-state">Данных пока нет</div>;
  return <>{children}</>;
};
export default StatusWrapper;