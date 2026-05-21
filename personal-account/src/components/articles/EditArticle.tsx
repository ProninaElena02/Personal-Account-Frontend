import React, { memo, useState, useCallback, useMemo } from 'react';
import type { Article } from '../../utils/interfaces';
import { validateArticleForm, type FormErrors } from '../../utils/validators';

interface EditArticleProps {
  article: Article;
  //пропс и он его вызывает
  onSave: (documentId: string, data: { title?: string; content?: string }) => void;
  onClose: () => void;
  isLoading?: boolean;
}
//редактироввние
const EditArticle: React.FC<EditArticleProps> = memo(({ article, onSave, onClose, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: article.title || '',
    content: article.content?.[0]?.children?.[0]?.text || ''
  });
  const [errors, setErrors] = useState<FormErrors>({});



  //валидна или не валидна форма
  const isFormValid = useMemo(() => {
    const validationErrors = validateArticleForm(formData);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  //  есть ли изменения в форме, чтобы не сохранять то что и так уже было
  const hasChanges = useMemo(() => {
    const originalContent = article.content?.[0]?.children?.[0]?.text || '';
    return formData.title !== article.title || formData.content !== originalContent;
  }, [formData.title, formData.content, article.title, article.content]);

  //валидация которая реагирует
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    
    const validationErrors = validateArticleForm(updatedFormData);
    setErrors(prev => ({
      ...prev,
      [name]: validationErrors[name] || ''
    }));
  }, [formData]);

  //на отправку
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    //валидация
    const validationErrors = validateArticleForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    //сохранение в родителе, то есть в профиле
    onSave(article.documentId, formData);
  }, [formData, article.documentId, onSave]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Редактировать публикацию</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Закрыть">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="form" noValidate>
          <div className="form-group">
            <label htmlFor="edit-title">Заголовок</label>
            <input
            id="edit-title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Заголовок публикации"
          />
          {errors.title && <p className="form-error">{errors.title}</p>} 
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-content">Контент</label>
            <textarea
            id="edit-content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="О чем вы хотите рассказать?"
            rows={6}
          />
          {errors.content && <p className="form-error">{errors.content}</p>}
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

EditArticle.displayName = 'EditArticle';
export default EditArticle;