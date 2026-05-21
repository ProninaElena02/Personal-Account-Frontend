import React, { useState, useCallback, useMemo,memo} from 'react';
import type { User } from '../../utils/interfaces';
import { validateProfileForm, type FormErrors } from '../../utils/validators';

interface EditProfileProps {
  user: User;
  onSave: (updateData: { username?: string; email?: string; phone?: string }) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const EditProfile: React.FC<EditProfileProps> = memo(({ user, onSave, onClose, isLoading = false }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    phone: user.phone || '',
    gender: user.gender || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // валидна ли форма
  const isFormValid = useMemo(() => {
    const validationErrors = validateProfileForm(formData);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  //есть ли изменения
  const hasChanges = useMemo(() => {
    return formData.username !== user.username || 
           formData.email !== user.email || 
           formData.phone !== (user.phone || '') ||
           formData.gender !== (user.gender || '');
  }, [formData, user]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    
    const validationErrors = validateProfileForm(updatedFormData);
    setErrors(prev => ({
      ...prev,
      [name]: validationErrors[name] || ''
    }));
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateProfileForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onSave(formData);//из Родителя Проброшен
  }, [formData, onSave]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Редактировать профиль</h3>
          <button 
            type="button" 
            className="modal-close" 
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="form" noValidate>
          <div className="form-group">
            <label htmlFor="edit-username">Имя пользователя</label>
            <input
              id="edit-username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.username && <p className="form-error">{errors.username}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-email">Email</label>
            <input
              id="edit-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-phone">Телефон</label>
            <input
              id="edit-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="+7 (999) 123-45-67"
            />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="edit-gender">Пол</label>
            <select
              id="edit-gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Не выбран</option>
              <option value="Женский">Женский</option>
              <option value="Мужской">Мужской</option>
            </select>
            {errors.gender && <p className="form-error">{errors.gender}</p>}
          </div>
                    
          <div className="modal-actions">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading || !isFormValid || !hasChanges}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isLoading}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
EditProfile.displayName = 'EditProfile'; 
export default EditProfile;

//до валидации

// import React, { useState, useEffect, useCallback } from 'react';
// import type { User } from '../../utils/interfaces';
// import { validateForm } from '../../utils/validators.ts';

// interface EditProfileProps {
//   user: User;
//   onSave: (updateData: { username?: string; email?: string; phone?: string }) => void;
//   onClose: () => void;
//   isLoading?: boolean;
// }

// const EditProfile: React.FC<EditProfileProps> = ({ user, onSave, onClose, isLoading = false }) => {
//   const [formData, setFormData] = useState({
//     username: user.username || '',
//     email: user.email || '',
//     phone: user.phone || '',
//     gender: user.gender || '',
//   });
//   const [error, setError] = useState('');

//   const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setError(''); // очищаем ошибку при вводе
//   }, []);

//   const handleSubmit = useCallback((e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.username.trim()) {
//       setError('Имя пользователя обязательно');
//       return;
//     }
    
//     if (!formData.email.trim()) {
//       setError('Email обязателен');
//       return;
//     }
    
//     onSave(formData);
//   }, [formData, onSave]);

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={e => e.stopPropagation()}>
//         <div className="modal-header">
//           <h3>Редактировать профиль</h3>
//           <button 
//             type="button" 
//             className="modal-close" 
//             onClick={onClose}
//             aria-label="Закрыть"
//           >
//             ×
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmit} className="form">
//           <div className="form-group">
//             <label htmlFor="edit-username">Имя пользователя</label>
//             <input
//               id="edit-username"
//               name="username"
//               type="text"
//               value={formData.username}
//               onChange={handleChange}
//               disabled={isLoading}
//               required
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="edit-email">Email</label>
//             <input
//               id="edit-email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               disabled={isLoading}
//               required
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="edit-phone">Телефон</label>
//             <input
//               id="edit-phone"
//               name="phone"
//               type="tel"
//               value={formData.phone}
//               onChange={handleChange}
//               disabled={isLoading}
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="edit-gender">Пол</label>
//             <input
//               id="edit-gender"
//               name="gender"
//               type="text"
//               value={formData.gender}
//               onChange={handleChange}
//               disabled={isLoading}
//             />
//           </div>
                    
//           {error && <p className="form-error" role="alert">{error}</p>}
          
//           <div className="modal-actions">
//             <button 
//               type="submit" 
//               className="btn btn-primary" 
//               disabled={isLoading}
//             >
//               {isLoading ? 'Сохранение...' : 'Сохранить'}
//             </button>
//             <button 
//               type="button" 
//               className="btn btn-secondary" 
//               onClick={onClose}
//               disabled={isLoading}
//             >
//               Отмена
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;