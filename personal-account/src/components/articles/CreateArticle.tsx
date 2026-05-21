//ВАЛИДАЦИЯ С КНОПКОЙ
import React, { memo, useState, useCallback, useMemo } from 'react'; 
import type { CreateArticleProps } from '../../utils/interfaces';
import { validateArticleForm, type FormErrors } from '../../utils/validators';

const CreateArticle: React.FC<CreateArticleProps & { isLoading?: boolean }> = memo(({ 
  articleData,
  setArticleData,
  onSubmit,
  isLoading = false 
}) => {
  const [errors, setErrors] = useState<FormErrors>({});

  // Обработчик изменения — валидирует сразу
  const handleChange = useCallback((field: 'title' | 'content', value: string) => {
    const updatedArticleData = { 
      ...articleData, 
      [field]: value 
    };
    setArticleData(updatedArticleData);
    
    const validationErrors = validateArticleForm(updatedArticleData);
    setErrors(prev => ({ 
      ...prev, 
      [field]: validationErrors[field] || '' 
    }));
  }, [setArticleData, articleData]);

  // Проверка, валидна ли форма
  const isFormValid = useMemo(() => {
    const validationErrors = validateArticleForm(articleData);
    return Object.keys(validationErrors).length === 0;
  }, [articleData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateArticleForm(articleData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    onSubmit(e);
  };

  return (
    <section className="card-base create-post" aria-labelledby="create-post-title">
      <h3 id="create-post-title" className="create-post-title">Создать публикацию</h3> 
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title">Заголовок</label>
          <input 
            id="post-title"
            type="text" 
            placeholder="Заголовок" 
            value={articleData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            disabled={isLoading}
          />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>
        
        <div className="form-group flex-grow">
          <label htmlFor="post-content">Контент сатьи</label>
          <textarea
            id="post-content"
            placeholder="Содержание"
            value={articleData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            disabled={isLoading}
          ></textarea>
          {errors.content && <p className="form-error">{errors.content}</p>}
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? 'Публикация...' : 'Опубликовать'}
        </button>
      </form>
    </section>
  );
});

CreateArticle.displayName = 'CreateArticle';
export default CreateArticle;



// import React, { memo, useState } from 'react'; 
// import type { CreateArticleProps } from '../../utils/interfaces';
// import { validateArticleForm, type FormErrors } from '../../utils/validators';
// //  isLoading используем для блокировки полей и 
// //кнопки, чтобы пользователь не смог отправить два одинаковых поста или 
// //изменить текст в момент отправки.
// const CreateArticle: React.FC<CreateArticleProps & { isLoading?: boolean }> = memo(({ 
//   articleData,
//   setArticleData,
//   onSubmit,
//   isLoading = false 
// }) => {
//   const [errors, setErrors] = useState<FormErrors>({});

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const validationErrors = validateArticleForm({
//       title: articleData.title,
//       content: articleData.content
//     });
    
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
    
//     setErrors({});
//     onSubmit(e);
//   };

//   return (
//     <section className="card-base create-post" aria-labelledby="create-post-title">
//       <h3 id="create-post-title" className="create-post-title">Создать публикацию</h3> 
//       <form className="form" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="post-title">Заголовок</label>
//           <input 
//             id="post-title"
//             type="text" 
//             placeholder="Заголовок" 
//             value={articleData.title}
//             onChange={(e) => {
//               setArticleData((prev) => ({ ...prev, title: e.target.value }));
//               setErrors(prev => ({ ...prev, title: '' }));
//             }}
//             disabled={isLoading}
//             required 
//           />
//           {errors.title && <p className="form-error">{errors.title}</p>}
//         </div>
//         <div className="form-group flex-grow">
//           <label htmlFor="post-content">Контент</label>
//           <textarea
//             id="post-content"
//             placeholder="Содержание"
//             value={articleData.content}
//             onChange={(e) => {
//               setArticleData((prev) => ({ ...prev, content: e.target.value }));
//               setErrors(prev => ({ ...prev, content: '' }));
//             }}
//             disabled={isLoading}
//             required
//           ></textarea>
//           {errors.content && <p className="form-error">{errors.content}</p>}
//         </div>
//         <button 
//           type="submit" 
//           className="btn btn-primary" 
//           disabled={isLoading}
//         >
//           {isLoading ? 'Публикация...' : 'Опубликовать'}
//         </button>
//       </form>
//     </section>
//   );
// });

// CreateArticle.displayName = 'CreateArticle';
// export default CreateArticle;