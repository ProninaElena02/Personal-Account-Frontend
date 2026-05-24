// src/utils/interfaces.ts
//мет
export interface UserFile {
  id: number;
  url: string;
  name: string;
}


export interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  phone?: string; 
  gender?: string;
  avatar?: UserFile;  
}
//мет
export interface UpdateUserPayload {
  username?: string;
  email?: string;
  phone?: string;
  gender?: string;
  avatar?: number | null; //айди файла
}

export interface RegisterResponse {
  jwt: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ContentBlock {
  type: 'paragraph' | 'heading' | 'list' | 'image';
  children: {
    type: 'text';
    text: string;
    bold?: boolean;
    italic?: boolean;
  }[];
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  content: ContentBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  author?: User;
  notes?: Note[];
}

export interface ArticlesState {
  items: Article[];
  loading: boolean;
  error: string | null;
}

export interface ArticlesResponse {
  data: Article[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface Note {
  id: number;
  documentId: string;
  text: string;  
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  author?: User;
  article?: Article; 
  _authorDocumentId?: string;
}

export interface NotesResponse {
  data: Note[];
  meta: {
    pagination: {
      total: number;
    };
  };
}

export interface NotesState {
  items: Note[];
  loading: boolean;
  error: string | null;
}

export interface RegisterModalHandle {
  open: () => void;
  close: () => void;
}

export interface UserInfoProps {
  user: User | null;
  onLogout: () => void;
}

export interface CreateArticleProps {//публикация
  articleData: { title: string; content: string };
  setArticleData: React.Dispatch<React.SetStateAction<{ title: string; content: string }>>;
  onSubmit: (e: React.FormEvent) => void;

}

// export interface ArticleCardProps {//карточка
//   article: Article;
//   onDelete: (documentId: string) => void;
//   onDeleteNote: (documentId: string) => void;
//   currentUserDocumentId?: string | null;  //Strapi работает с documentId , а не с id (число), а проверки авторства в коде сравнивают currentUserDocumentId === article.author?.documentId
// }

export interface ArticleListProps {//лента статей
  articles: Article[];
  onDelete: (documentId: string) => void;
  onDeleteNote: (documentId: string) => void; 
  currentUserDocumentId?: string | null;
}

// редактирование

export interface EditArticleProps {
  article: Article;
  onSave: (documentId: string, data: { title?: string; content?: string }) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export interface ArticleCardProps {
  article: Article;
  onDelete: (documentId: string) => void;
  onDeleteNote: (documentId: string) => void;
  onEdit?: (article: Article) => void;  
  currentUserDocumentId?: string | null;
}


//это оптимизация комеентов, им нужен свой тип
export interface CreateNoteFulfilledAction {
  type: 'notes/create/fulfilled';
  payload: Note & { _articleDocumentId?: string; _authorDocumentId?: string };
}

export interface DeleteNoteFulfilledAction {
  type: 'notes/delete/fulfilled';
  payload: string;
}
