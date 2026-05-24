import React, { useState, useCallback, useMemo , memo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import { addNewNote } from '../../store/notesSlice';
import { selectUser } from '../../store/authSlice';
import { validateNoteForm, type FormErrors } from '../../utils/validators';

interface CommentFormProps {
  articleDocumentId: string;
  onClose: () => void;
}

const CommentForm: React.FC<CommentFormProps> = memo(({ articleDocumentId, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Валидация текста и обновление ошибок
  // const validateAndSetErrors = useCallback((value: string) => {
  //   const validationErrors = validateNoteForm({ text: value });
  //   setErrors(validationErrors);
  //   return Object.keys(validationErrors).length === 0;
  // }, []);

  // const handleChange = useCallback((value: string) => {
  //   setText(value);
  //   validateAndSetErrors(value);
  // }, [validateAndSetErrors]);


  //то же самое что выше но объединены
  const handleChange = useCallback((value: string) => {
    setText(value);
    const validationErrors = validateNoteForm({ text: value });
    setErrors(validationErrors);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateNoteForm({ text });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!user?.documentId) return;

    setIsSubmitting(true);
    try {
      await dispatch(addNewNote({//и вызовутся все редуксы
        text: text.trim(),
        article: articleDocumentId,
        author: user.documentId
      })).unwrap();
      setText('');
      onClose();
    } catch (err) {
      setErrors({ text: 'Ошибка при добавлении комментария' });
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, text, articleDocumentId, user, onClose]);

  // Проверка, валидна ли форма
  const isFormValid = useMemo(() => {//вызывается при изменении текста
    const validationErrors = validateNoteForm({ text });
    return Object.keys(validationErrors).length === 0;//проверяет есть ли там ошибка
  }, [text]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Добавить комментарий</h3>
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
            <label htmlFor="comment-text">Комментарий</label>
            <textarea
            id="comment-text"
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Введите ваш комментарий..."
            disabled={isSubmitting}
            rows={4}
          />
          {errors.text && <p className="form-error">{errors.text}</p>}
          </div>
          
          <div className="modal-actions">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default CommentForm;
