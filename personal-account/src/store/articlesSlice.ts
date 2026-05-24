
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../utils/api';
import type {  Article,  ArticlesState, Note, CreateNoteFulfilledAction,  DeleteNoteFulfilledAction } from '../utils/interfaces';
import type { RootState } from './index';
// import { addNewNote, removeNote } from './notesSlice';

// getArticles
export const fetchArticles = createAsyncThunk<Article[]>(
  'articles/fetchAll',
  async () => {
    const response = await api.getArticles();
    return response.data;
  }
);
//getArticlesByAuthor
export const fetchArticlesByAuthor = createAsyncThunk<Article[], string>(
  'articles/fetchByAuthor',
  async (authorDocumentId: string) => {
    const response = await api.getArticlesByAuthor(authorDocumentId);
    return response.data;
  }
);

//createArticle
export const createNewArticle = createAsyncThunk<Article, { title: string; content: string; author: string }>(
  'articles/create',
  async (articleData) => {
    const response = await api.createArticle(articleData);
    return response.data;
  }
);
//deleteArticle
export const removeArticle = createAsyncThunk<string, string>(
  'articles/delete',
  async (documentId: string) => {
    await api.deleteArticle(documentId);
    return documentId;
  }
);

export const editArticle = createAsyncThunk<
  Article,                                          // вернуть статью
  { documentId: string; title?: string; content?: string },  // пdocumentId и  данные
  { rejectValue: string }
>(
  'articles/edit',
  async ({ documentId, title, content }, { rejectWithValue }) => {
    try {
      const response = await api.updateArticle(documentId, { title, content });
      return response.data;
    } catch (err) {
      return rejectWithValue('Ошибка при редактировании статьи');
    }
  }
);

const initialState: ArticlesState = {
  items: [],
  loading: false,
  error: null,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearArticles: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  

  extraReducers: (builder) => {
    builder
    //разная логика у thunk
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
        state.loading = false;
        state.items = action.payload.map(article => ({
          ...article,
          notes: article.notes?.map(note => ({
            ...note,
            // сохраняем documentId автора для проверкиI
            _authorDocumentId: note.author?.documentId
          }))
        }));
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки статей';
      })
      .addCase(createNewArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewArticle.fulfilled, (state, action: PayloadAction<Article>) => {
        state.loading = false;
        state.items = [action.payload, ...state.items];
      })
      .addCase(createNewArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка создания статьи';
      })
      .addCase(removeArticle.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(article => article.documentId !== action.payload);
      })

      //комментарий
      // .addCase(addNewNote.fulfilled, (state, action) => {
      //   const articleDocumentId = action.payload._articleDocumentId;
      //   if (!articleDocumentId) return;
        
      //   const articleIndex = state.items.findIndex(a => a.documentId === articleDocumentId);
      //   if (articleIndex !== -1) {
      //     const article = state.items[articleIndex];//мы положим комент в массив или создадим этот массив
      //     const updatedNotes = article.notes ? [...article.notes, action.payload] : [action.payload];
      //     state.items[articleIndex] = {
      //       ...article,
      //       notes: updatedNotes
      //     };
      //   }
      // })
      

      //edit
      .addCase(editArticle.pending, (state) => {//загрузка
        state.loading = true;
        state.error = null;
      })

      .addCase(editArticle.fulfilled, (state, action: PayloadAction<Article>) => {
        state.loading = false;
        
        const index = state.items.findIndex(
          article => article.documentId === action.payload.documentId
        );
        
        if (index !== -1) {
          // старая версия статьи
          const existingArticle = state.items[index];
          
          //комментарии не доожны меняться
          state.items[index] = {
            ...existingArticle,           
            title: action.payload.title,  
            content: action.payload.content, 
            updatedAt: action.payload.updatedAt,
          };
        }
      })
      .addCase(editArticle.rejected, (state, action) => {//ошибка
        state.loading = false;
        state.error = action.payload || 'Ошибка редактирования статьи';
      })

      //удаление комента
      // .addCase(removeNote.fulfilled, (state, action: PayloadAction<string>) => {
      //   state.items = state.items.map(article => {
      //     if (article.notes) {
      //       return {
      //         ...article,
      //         notes: article.notes.filter(note => note.documentId !== action.payload)
      //       };
      //     }
      //     return article;
      //   });
      // });
      .addCase('notes/create/fulfilled', (state, action: CreateNoteFulfilledAction) => {
        const articleDocumentId = action.payload._articleDocumentId;
        if (!articleDocumentId) return;
        
        const articleIndex = state.items.findIndex(a => a.documentId === articleDocumentId);
        if (articleIndex !== -1) {
          const article = state.items[articleIndex];
          const updatedNotes = article.notes ? [...article.notes, action.payload] : [action.payload];
          state.items[articleIndex] = {
            ...article,
            notes: updatedNotes
          };
        }
      })
      .addCase('notes/delete/fulfilled', (state, action: DeleteNoteFulfilledAction) => {
        state.items = state.items.map(article => {
          if (article.notes) {
            return {
              ...article,
              notes: article.notes.filter(note => note.documentId !== action.payload)
            };
          }
          return article;
        });
      })

  },
});

export const { clearArticles } = articlesSlice.actions;

export const selectArticles = (state: RootState): Article[] => state.articles.items;
export const selectArticlesLoading = (state: RootState): boolean => state.articles.loading;
export const selectArticlesError = (state: RootState): string | null => state.articles.error;

export default articlesSlice.reducer;