// ArticleCard.tsx

import React, { memo, useMemo, useState, useCallback } from 'react';
import type { ArticleCardProps } from '../../utils/interfaces';
import CommentForm from './CommentForm';

const ArticleCard: React.FC<ArticleCardProps> = memo(({ 
  article, 
  onDelete, 
  onDeleteNote, 
  onEdit,
  currentUserDocumentId 
}) => {
  const [showCommentForm, setShowCommentForm] = useState(false);

  if (!article) return null;

  const contentText = useMemo(() => {
    return article.content?.[0]?.children?.[0]?.text || "Пустая публикация";
  }, [article.content]);

  const formattedDate = useMemo(() => {
    return new Date(article.createdAt).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [article.createdAt]);

  const isAuthor = currentUserDocumentId === article.author?.documentId;

  const handleDelete = useCallback(() => {
    onDelete(article.documentId);
  }, [onDelete, article.documentId]);

  const handleEdit = useCallback(() => {
    onEdit?.(article);  //вызыв onEdit 
  }, [onEdit, article]);

  const handleToggleCommentForm = useCallback(() => {
    setShowCommentForm(prev => !prev);
  }, []);

  const handleCloseCommentForm = useCallback(() => {
    setShowCommentForm(false);
  }, []);

  const handleDeleteNote = useCallback((documentId: string) => {
    onDeleteNote(documentId);
  }, [onDeleteNote]);

  return (
    <article className="post-card">
      <header className="post-header">
        <h4 className="post-title">{article.title || "Без заголовка"}</h4>
        <time className="post-date" dateTime={article.createdAt}>
          {formattedDate}
        </time>
      </header>
      <p className="post-content">{contentText}</p>
      <footer className="post-footer">
        <span>{article.notes?.length || 0} комментариев</span>
        <button 
          className="link-btn post-action"
          onClick={handleToggleCommentForm}
        > 
          Комментировать 
        </button>
        {isAuthor && (
          <>
            <button 
              className="link-btn post-action"
              onClick={handleEdit}
              aria-label="Редактировать публикацию"
            >
              Редактировать
            </button>
            <button 
              type="button" 
              onClick={handleDelete} 
              className="link-btn danger"
              aria-label="Удалить публикацию"
            >
              Удалить публикацию
            </button>
          </>
        )}
      </footer>
      
      {article.notes && article.notes.length > 0 && (
        <div className="comments-section">
          {article.notes.map((note) => {
            



            const noteAuthorId = note._authorDocumentId || note.author?.documentId;
            return (
              <div key={note.documentId} className="comment">
                <p className="comment-text">{note.text}</p>
                <p className="comment-author">{note.author?.username || 'Аноним'}</p>
                {noteAuthorId === currentUserDocumentId && (
                  <button 
                    type="button"
                    className="link-btn danger"
                    onClick={() => handleDeleteNote(note.documentId)}
                  >
                    Удалить комментарий
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
          
      {showCommentForm && (
        <CommentForm 
          articleDocumentId={article.documentId}
          onClose={handleCloseCommentForm}
        />
      )}
    </article>
  );
});

ArticleCard.displayName = 'ArticleCard';
export default ArticleCard;

