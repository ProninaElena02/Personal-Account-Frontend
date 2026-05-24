
//новая

import React, { useState, useEffect, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../store';
import { 
  logout, 
  selectUser, 
  selectIsAuth, 
  selectAuthLoading, 
  selectAuthError,
  updateUserProfile 
} from '../store/authSlice';
import { 
  fetchArticles, 
  createNewArticle, 
  removeArticle,
  editArticle,  
  selectArticles, 
  selectArticlesLoading, 
  selectArticlesError 
} from '../store/articlesSlice';
import UserInfo from '../components/profile/UserInfo';
import CreateArticle from '../components/articles/CreateArticle';
import ArticleList from '../components/articles/ArticleList'; 
import StatusWrapper from '../components/hoc/StatusWrapper';
import EditProfile from '../components/profile/EditProfile';
import EditArticle from '../components/articles/EditArticle';  
import { removeNote } from '../store/notesSlice';
import type { Article } from '../utils/interfaces';  



const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // const [articleErrors, setArticleErrors] = useState<FormErrors>({});
  const [articleData, setArticleData] = useState({ title: '', content: '' });
  const [isPublishing, setIsPublishing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);  
  const [isEditing, setIsEditing] = useState(false);  
  
  // теперь берем из Redux, а не из локального state
  const isAuth = useSelector(selectIsAuth);
  const user = useSelector(selectUser);
  const articles = useSelector(selectArticles);
  const articlesLoading = useSelector(selectArticlesLoading);
  const articlesError = useSelector(selectArticlesError);

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
  }, [isAuth, navigate]);

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchArticles());
    }
  }, [isAuth, dispatch]);

  const handleLogout = useCallback(() => {//если пользователь разлогинился
    dispatch(logout());
  }, [dispatch]);

  const handleCreateArticle = useCallback(async (e: React.FormEvent) => {//создать статью
    e.preventDefault();
    if (!user?.documentId || !isAuth) return;
  

    setIsPublishing(true);
    try {
      await dispatch(createNewArticle({
        ...articleData,
        author: user.documentId
      })).unwrap();
      
      setArticleData({ title: '', content: '' });
    } catch (err) {
      alert("Ошибка при публикации");
    } finally {
      setIsPublishing(false);
    }
  }, [user, isAuth, articleData, dispatch]);


  //мет
  const handleDeleteArticle = useCallback(async (documentId: string) => {//удаление с алармом
    if (!isAuth || !documentId) return;
    if (!window.confirm("Вы уверены, что хотите удалить эту статью?")) return;
    
    try {
      await dispatch(removeArticle(documentId)).unwrap();//перерисовка если убрали айди документа, иначе нет
    } catch (err) {
      console.error("Ошибка удаления:", err);
      alert("Не удалось удалить статью на сервере");
    }
  }, [isAuth, dispatch]);

  const handleUpdateUser = useCallback(async (updateData: { username?: string; email?: string; phone?: string }) => {
    if (!user?.id) return;
    
    try {
      await dispatch(updateUserProfile({ //перерисовка профиля - он вызовет слайс, а тот апи
        userId: user.id, 
        updateData 
      })).unwrap();
      setShowEditProfile(false);
    } catch (err) {
      alert('Ошибка при обновлении профиля');
    }
  }, [user, dispatch]);
  

  
  const handleDeleteNote = useCallback(async (documentId: string) => {
    if (!isAuth || !documentId) return;
    
    try {
      await dispatch(removeNote(documentId)).unwrap();
    } catch (err) {
      console.error("Ошибка удаления комментария:", err);
      alert("Не удалось удалить комментарий");
    }
  }, [isAuth, dispatch]);


  //МЕмо изированные функции
  const handleOpenEditProfile = useCallback(() => {
    setShowEditProfile(true);
  }, []);

  const handleCloseEditProfile = useCallback(() => {
    setShowEditProfile(false);
  }, []);


  //ЗАДАНИЕ окно редактирования
   
  const handleEditArticle = useCallback((article: Article) => {
    setEditingArticle(article);
  }, []);

  //сохранить изменения 
  const handleSaveEditArticle = useCallback(async (documentId: string, data: { title?: string; content?: string }) => {
    if (!isAuth || !documentId) return;
    
    setIsEditing(true);
    try {
      await dispatch(editArticle({//реагирует и перерисовывает если произошли изменения в статье
        documentId,
        title: data.title,
        content: data.content
      })).unwrap();
      setEditingArticle(null);
    } catch (err) {
      alert('Ошибка при редактировании статьи');
    } finally {
      setIsEditing(false);
    }
  }, [isAuth, dispatch]);

  //  Закрыть модальное окно редактирования
  const handleCloseEditArticle = useCallback(() => {
    setEditingArticle(null);
  }, []);


{/* <UserInfo 
        user={user} 
        onLogout={handleLogout} 
        onEdit={() => setShowEditProfile(true)}
      /> */}


  return (
    <main className="dashboard-grid">
      {/* мой профиль */}
      <UserInfo 
        user={user} 
        onLogout={handleLogout} 
        onEdit={handleOpenEditProfile}
      />
      {/* крыло создания статей */}
      <CreateArticle 
        articleData={articleData} 
        setArticleData={setArticleData} 
        onSubmit={handleCreateArticle}
        isLoading={isPublishing}
      />
      <StatusWrapper 
        loading={articlesLoading} 
        isEmpty={articles.length === 0} 
        error={articlesError}
      >
        {/* список */}
        <ArticleList 
          articles={articles} 
          onDelete={handleDeleteArticle}
          onDeleteNote={handleDeleteNote}
          onEdit={handleEditArticle}  
          currentUserDocumentId={user?.documentId}
        />
      </StatusWrapper>
      {/* окно редактирования */}
      {showEditProfile && user && (
        <EditProfile 
          user={user}
          onSave={handleUpdateUser}
          onClose={handleCloseEditProfile}
        />
      )}
      {/* редактирование статьи */}
      {editingArticle && (
        <EditArticle 
          article={editingArticle}
          onSave={handleSaveEditArticle}
          onClose={handleCloseEditArticle}
          isLoading={isEditing}
        />
      )}
    </main>
  );
};

export default memo(Profile);
