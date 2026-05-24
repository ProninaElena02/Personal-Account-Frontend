import React, { memo, useState, useMemo, useCallback } from 'react';
import ArticleCard from './ArticleCard';
import type { ArticleListProps, Article } from '../../utils/interfaces';

//фильтры
type FilterType = 'all' | 'my' | 'commented';

const ArticleList: React.FC<ArticleListProps & { onEdit?: (article: Article) => void }> = memo(({ 
  articles, //мы отдали эти пропсы
  onDelete, 
  onDeleteNote,
  onEdit,  
  currentUserDocumentId 
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  //фильтр. комментарий - вообще все комментарии мы вызываем эту функцию и она делает запрос 
  const filteredArticles = useMemo(() => {
    switch (activeFilter) {
      case 'my':
        return articles.filter(article => article.author?.documentId === currentUserDocumentId);
      case 'commented':
        return articles.filter(article => 
          article.notes?.some(note => {
            const noteAuthorId = note._authorDocumentId || note.author?.documentId;
            return noteAuthorId === currentUserDocumentId;
          })
        );
      case 'all':
      default:
        return articles;
    }
  }, [articles, activeFilter, currentUserDocumentId]);

  // для фильтров меммо функции чтобы из вызывать
  const setFilterAll = useCallback(() => setActiveFilter('all'), []);
  const setFilterMy = useCallback(() => setActiveFilter('my'), []);
  const setFilterCommented = useCallback(() => setActiveFilter('commented'), []);

  if (articles.length === 0) {
    return (
      <section className="posts-feed-full">
        <p className="empty-message">Публикаций пока нет...</p>
      </section>
    );
  }

  return (
    <section className="posts-feed-full">
      <div className="feed-filters">
        <button 
          type="button" 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={setFilterAll}
        >
          Все публикации
        </button>
        <button 
          type="button" 
          className={`filter-btn ${activeFilter === 'my' ? 'active' : ''}`}
          onClick={setFilterMy}
        >
          Мои публикации
        </button>
        <button 
          type="button" 
          className={`filter-btn ${activeFilter === 'commented' ? 'active' : ''}`}
          onClick={setFilterCommented}
        >
          Прокомментированные
        </button>
      </div>
      {/* сама отрисовка, она или пустая, или список с пропсами */}
      {filteredArticles.length === 0 ? (
        <p className="empty-message">Нет публикаций по фильтру</p>
      ) : (
        <ul className="feed-list">
          {filteredArticles.map((article) => (
            <li key={article.documentId} className="feed-item">
              <ArticleCard 
                article={article} 
                onDelete={onDelete} 
                onDeleteNote={onDeleteNote}
                onEdit={onEdit}
                currentUserDocumentId={currentUserDocumentId} 
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
});

ArticleList.displayName = 'ArticleList';
export default ArticleList;