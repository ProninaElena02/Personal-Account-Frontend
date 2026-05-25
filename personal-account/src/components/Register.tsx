import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, selectAuthLoading, selectAuthError, clearError } from '../store/authSlice';
import type { AppDispatch } from '../store';
import { validateRegisterForm, type FormErrors } from '../utils/validators';

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);//перевыполнит эту функцию только если что-то из этого массива изменилось
   
   
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    
    const validationErrors = validateRegisterForm(updatedFormData);
    setErrors(prev => ({
      ...prev,
      [name]: validationErrors[name] || ''
    }));
  }, [formData]);

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      navigate('/profile');
    }
  }, [dispatch, formData, navigate]);
  
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h2 className="auth-title">Регистрация</h2>
        <form onSubmit={handleRegister} className="form">
          <div className="form-group">
            <label htmlFor="reg-username">Ваше имя</label>
            <input 
              id="reg-username"
              name="username" 
              type="text" 
              placeholder="RocketMan" 
              value={formData.username} 
              onChange={handleChange} 
              disabled={loading}
              required 
              autoComplete="username"
              className={errors.username ? 'input-error' : ''}
            />
            {errors.username && <p className="form-error">{errors.username}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="reg-email">Email</label>
            <input 
              id="reg-email"
              name="email" 
              type="email" 
              placeholder="email@example.com" 
              value={formData.email}
              onChange={handleChange} 
              disabled={loading}
              required 
              autoComplete="email"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="reg-password">Пароль</label>
            <input 
              id="reg-password"
              name="password" 
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange} 
              disabled={loading}
              required 
              autoComplete="new-password"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
          {error && <p className="form-error" role="alert">{error}</p>} 
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="auth-footer">
          Уже есть аккаунт? <Link to="/login" className="link-btn">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
