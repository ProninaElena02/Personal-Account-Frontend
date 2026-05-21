
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../utils/api';
import type { Note, NotesState } from '../utils/interfaces';
import type { RootState } from './index';

export const fetchNotesByArticle = createAsyncThunk<Note[], string>(//получить текущие коменты
  'notes/fetchByArticle',
  async (articleDocumentId: string) => {
    const response = await api.getNotesByArticle(articleDocumentId);
    return response.data;
  }
);

// export const addNewNote = createAsyncThunk<Note, { text: string; article: string; author: string }>(
//   'notes/create',
//   async (noteData) => {
//     const response = await api.createNote(noteData);
//     return response.data;
//   }
// );
//создать 
export const addNewNote = createAsyncThunk<Note & { _articleDocumentId?: string; _authorDocumentId?: string }, { text: string; article: string; author: string }>(//сначала -что вводим а потом параметры
  'notes/create',//имя действия
  async (noteData) => {
    const response = await api.createNote(noteData);
    return { 
      ...response.data, 
      _articleDocumentId: noteData.article,//айди статьи и автора
      _authorDocumentId: noteData.author 
    };
  }
);
//удалить
export const removeNote = createAsyncThunk<string, string>(
  'notes/delete',
  async (documentId: string) => {
    await api.deleteNote(documentId);
    return documentId;
  }
);

const initialState: NotesState = {
  items: [],//массив коментов
  loading: false,
  error: null,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearNotes: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotesByArticle.pending, (state) => {//когда ушел запрос - крутится крудок
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotesByArticle.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotesByArticle.rejected, (state, action) => {//незагрузились комментарии
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки комментариев';
      })
      .addCase(addNewNote.pending, (state) => {//запос ушел на сервер и мы поменяли флаги
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewNote.fulfilled, (state, action: PayloadAction<Note>) => {//комент на сервере и все хорошо        state.loading = false;
        state.items = [...state.items, action.payload];
      })
      .addCase(addNewNote.rejected, (state, action) => {//ошибка
        state.loading = false;
        state.error = action.error.message || 'Ошибка создания комментария';
      })
      .addCase(removeNote.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(note => note.documentId !== action.payload);
      })
      .addCase(removeNote.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка удаления комментария';
      });
  },
});

export const { clearNotes } = notesSlice.actions;

export const selectNotes = (state: RootState): Note[] => state.notes.items;
export const selectNotesLoading = (state: RootState): boolean => state.notes.loading;
export const selectNotesError = (state: RootState): string | null => state.notes.error;

export default notesSlice.reducer;
// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import { api } from '../utils/api';
// import type { Note, NotesState } from '../utils/interfaces';
// import type { RootState } from './index';

// export const fetchNotesByArticle = createAsyncThunk<Note[], string>(
//   'notes/fetchByArticle',
//   async (articleDocumentId: string) => {
//     const response = await api.getNotesByArticle(articleDocumentId);
//     return response.data;
//   }
// );

// export const addNewNote = createAsyncThunk<Note, { text: string; article: string; author: string }>(
//   'notes/create',
//   async (noteData) => {
//     const response = await api.createNote(noteData);
//     return response.data;
//   }
// );

// export const removeNote = createAsyncThunk<string, string>(
//   'notes/delete',
//   async (documentId: string) => {
//     await api.deleteNote(documentId);
//     return documentId;
//   }
// );

// const initialState: NotesState = {
//   items: [],
//   loading: false,
//   error: null,
// };

// const notesSlice = createSlice({
//   name: 'notes',
//   initialState,
//   reducers: {
//     clearNotes: (state) => {
//       state.items = [];
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchNotesByArticle.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchNotesByArticle.fulfilled, (state, action: PayloadAction<Note[]>) => {
//         state.loading = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchNotesByArticle.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Ошибка загрузки комментариев';
//       })
//       .addCase(addNewNote.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addNewNote.fulfilled, (state, action: PayloadAction<Note>) => {
//         state.loading = false;
//         state.items.push(action.payload);
//       })
//       .addCase(addNewNote.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Ошибка создания комментария';
//       })
//       .addCase(removeNote.fulfilled, (state, action: PayloadAction<string>) => {
//         state.items = state.items.filter(note => note.documentId !== action.payload);
//       })
//       .addCase(removeNote.rejected, (state, action) => {
//         state.error = action.error.message || 'Ошибка удаления комментария';
//       });
//   },
// });

// export const { clearNotes } = notesSlice.actions;

// export const selectNotes = (state: RootState): Note[] => state.notes.items;
// export const selectNotesLoading = (state: RootState): boolean => state.notes.loading;
// export const selectNotesError = (state: RootState): string | null => state.notes.error;

// export default notesSlice.reducer;



//До 2-ого пятого пункта

// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import { api } from '../utils/api';
// import type { Note, NotesState } from '../utils/interfaces';
// import type { RootState } from './index';

// // Асинхронные действия
// export const fetchNotesByArticle = createAsyncThunk<Note[], string>(
//   'notes/fetchByArticle',
//   async (articleDocumentId: string) => {
//     const response = await api.getNotesByArticle(articleDocumentId);
//     return response.data;
//   }
// );

// export const addNewNote = createAsyncThunk<Note, { text: string; article: string; author: string }>(
//   'notes/create',
//   async (noteData) => {
//     const response = await api.createNote(noteData);
//     return response.data;
//   }
// );

// export const removeNote = createAsyncThunk<string, string>(
//   'notes/delete',
//   async (documentId: string) => {
//     await api.deleteNote(documentId);
//     return documentId;
//   }
// );

// const initialState: NotesState = {
//   items: [],
//   loading: false,
//   error: null,
// };

// const notesSlice = createSlice({
//   name: 'notes',
//   initialState,
//   reducers: {
//     clearNotes: (state) => {
//       state.items = [];
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // fetchNotesByArticle
//       .addCase(fetchNotesByArticle.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchNotesByArticle.fulfilled, (state, action: PayloadAction<Note[]>) => {
//         state.loading = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchNotesByArticle.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Ошибка загрузки комментариев';
//       })
//       // addNewNote
//       .addCase(addNewNote.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addNewNote.fulfilled, (state, action: PayloadAction<Note>) => {
//         state.loading = false;
//         state.items.push(action.payload);
//       })
//       .addCase(addNewNote.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Ошибка создания комментария';
//       })
//       // removeNote
//       .addCase(removeNote.fulfilled, (state, action: PayloadAction<string>) => {
//         state.items = state.items.filter(note => note.documentId !== action.payload);
//       });
//   },
// });




// export const { clearNotes } = notesSlice.actions;

// // Селекторы
// export const selectNotes = (state: RootState): Note[] => state.notes.items;
// export const selectNotesLoading = (state: RootState): boolean => state.notes.loading;
// export const selectNotesError = (state: RootState): string | null => state.notes.error;

// export default notesSlice.reducer;