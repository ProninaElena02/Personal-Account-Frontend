import React, { memo, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { changeAvatar } from '../../store/authSlice';
import type { UserInfoProps } from '../../utils/interfaces';

interface ExtendedUserInfoProps extends UserInfoProps {
  onEdit?: () => void;
}

const UserInfo: React.FC<ExtendedUserInfoProps> = memo(({ user, onLogout, onEdit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user || !user?.username) {
    return (
      <aside className="profile-card">
        <p>Загрузка профиля...</p>
      </aside>
    );
  }

  const handleAvatarClick = useCallback(() => {
    
// очищаем input,  можно загрузить тот же файл повторно
  fileInputRef.current?.click();
  }, []);

 const handleAvatarChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await dispatch(changeAvatar(file)).unwrap();//вызывает это из аус слайс и прерисовывает если это изменение происходит
    } catch (err) {
      alert('Ошибка при загрузке аватара');
    }
  }, [dispatch]);

  return (
    <aside className="profile-card">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        style={{ display: 'none' }}
      />
      
      <div 
        className="profile-avatar" 
        role="img" 
        aria-label={`Аватар пользователя ${user.username}`}
        onClick={handleAvatarClick}
        style={{ cursor: 'pointer' }}
      >
        {user.avatar?.url && (
          <img 
            src={`http://localhost:1337${user.avatar.url}`}
            alt={`Аватар пользователя ${user.username}`}
          />
        )}
      </div>
      
      <h2 className="auth-title">{user.username}</h2>
      <p className="auth-title">{user.email}</p>
      {user.phone && <p className="auth-title">{user.phone}</p>}
      {user.gender && <p className="auth-title">{user.gender}</p>}
      
      <nav className="profile-actions" aria-label="Управление профилем">
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={onEdit}
        >
          Редактировать
        </button>
        <button 
          type="button" 
          onClick={onLogout} 
          className="btn btn-primary"
        >
          Выйти
        </button>
      </nav>
    </aside>
  );
});

UserInfo.displayName = 'UserInfo';
export default UserInfo;
