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
            const noteAuthorId = (note as any)._authorDocumentId || note.author?.documentId;
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

// import React, { memo, useState, useMemo } from 'react';
// import ArticleCard from './ArticleCard';
// import type { ArticleListProps } from '../../utils/interfaces';

// type FilterType = 'all' | 'my' | 'commented';

// const ArticleList: React.FC<ArticleListProps> = memo(({ 
//   articles, 
//   onDelete, 
//   onDeleteNote,
//   currentUserDocumentId 
// }) => {
//   const [activeFilter, setActiveFilter] = useState<FilterType>('all');

//   const filteredArticles = useMemo(() => {
//     switch (activeFilter) {
//       case 'my':
//         return articles.filter(article => article.author?.documentId === currentUserDocumentId);
//       case 'commented':
//         return articles.filter(article => article.notes && article.notes.length > 0);
//       case 'all':
//       default:
//         return articles;
//     }
//   }, [articles, activeFilter, currentUserDocumentId]);

//   if (articles.length === 0) {
//     return (
//       <section className="posts-feed-full">
//         <p className="empty-message">Публикаций пока нет...</p>
//       </section>
//     );
//   }

//   return (
//     <section className="posts-feed-full">
//       <div className="feed-filters">
//         <button 
//           type="button" 
//           className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
//           onClick={() => setActiveFilter('all')}
//         >
//           Все публикации
//         </button>
//         <button 
//           type="button" 
//           className={`filter-btn ${activeFilter === 'my' ? 'active' : ''}`}
//           onClick={() => setActiveFilter('my')}
//         >
//           Мои публикации
//         </button>
//         <button 
//           type="button" 
//           className={`filter-btn ${activeFilter === 'commented' ? 'active' : ''}`}
//           onClick={() => setActiveFilter('commented')}
//         >
//           Прокомментированные
//         </button>
//       </div>
      
//       {filteredArticles.length === 0 ? (
//         <p className="empty-message">Нет публикаций по выбранному фильтру</p>
//       ) : (
//         <ul className="feed-list">
//           {filteredArticles.map((article) => (
//             <li key={article.documentId} className="feed-item">
//               <ArticleCard 
//                 article={article} 
//                 onDelete={onDelete} 
//                 onDeleteNote={onDeleteNote}
//                 currentUserDocumentId={currentUserDocumentId} 
//               />
//             </li>
//           ))}
//         </ul>
//       )}
//     </section>
//   );
// });

// ArticleList.displayName = 'ArticleList';
// export default ArticleList;

//вообще старое
// import React, { memo } from 'react';
// import ArticleCard from './ArticleCard';
// import type { ArticleListProps } from '../../utils/interfaces';

// const ArticleList: React.FC<ArticleListProps> = memo(({ 
//   articles, 
//   onDelete, 
//   onDeleteNote,
//   currentUserDocumentId 
// }) => {
  
//   if (articles.length === 0) {
//     return (
//       <section className="posts-feed-full">
//         <p className="empty-message">Публикаций пока нет...</p>
//       </section>
//     );
//   }
  
//   return (
//     <section className="posts-feed-full">
//       <div className="feed-filters">
//         <button type="button" className="filter-btn active">Все публикации</button>
//         <button type="button" className="filter-btn">Мои публикации</button>
//         <button type="button" className="filter-btn">Прокомментированные</button>
//       </div>
//       <ul className="feed-list">
//         {articles.map((article) => (
//           <li key={article.documentId} className="feed-item">
//             <ArticleCard 
//               article={article} 
//               onDelete={onDelete} 
//               onDeleteNote={onDeleteNote}
//               currentUserDocumentId={currentUserDocumentId} 
//             />
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// });

// ArticleList.displayName = 'ArticleList';
// export default ArticleList;


// import React, { memo } from 'react';
// import ArticleCard from './ArticleCard';
// import type { ArticleListProps } from '../../utils/interfaces';
// const ArticleList: React.FC<ArticleListProps> = memo(({ 
//   articles, 
//   onDelete, 
//   currentUserDocumentId 
// }) => {
  
//   if (articles.length === 0) {
//     return (
//       <section className="posts-feed-full">
//         <p className="empty-message">Публикаций пока нет...</p>
//       </section>
//     );
//   }
//   return (
//     <section className="posts-feed-full">
//       {/* Заготовка для фильтров (логику переключения напишите сами) */}
//       <div className="feed-filters">
//         <button type="button" className="filter-btn active">Все публикации</button>
//         <button type="button" className="filter-btn">Мои публикации</button>
//         <button type="button" className="filter-btn">Прокомментированные</button>
//       </div>
//       <ul className="feed-list">
//         {articles.map((article) => (
//           <li key={article.documentId} className="feed-item">
//             <ArticleCard 
//               article={article} 
//               onDelete={onDelete} 
//               currentUserDocumentId={currentUserDocumentId} 
//             />
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// });
// ArticleList.displayName = 'ArticleList';
// export default ArticleList;