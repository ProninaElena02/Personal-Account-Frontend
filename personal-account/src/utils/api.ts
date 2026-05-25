
import axios from 'axios';
import type { RegisterResponse, ArticlesResponse, Article, User, Note, NotesResponse,UserFile, UpdateUserPayload } from './interfaces';
//Вместо того чтобы каждый раз писать полный URL сервера, мы создадим 
//экземпляр с базовым адресом
const API_URL = 'http://localhost:1337/api';//базовый урл

const $api = axios.create({
  baseURL: API_URL,
});
const $uploadApi = axios.create({
  baseURL: 'http://localhost:1337',  // для аватара
});
$uploadApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Интерцептор для автоматической подстановки токена, чтобы нам не нужно было его всегда ставить в запросы
$api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// содержит функции для выполнения конкретных задач: 
//register и login отправляют данные пользователя на сервер;
export const api = {
  async register(formData: Record<string, string>): Promise<RegisterResponse> {
    const { data } = await $api.post<RegisterResponse>('/auth/local/register', formData);//отправили пост запрос на сервер и ждём его
    return data;
  },
 // получают данные пользователя с сервера
  async getMe(): Promise<User> {
    const { data } = await $api.get<User>('/users/me?populate=*');
    return data;
  },

  async login(formData: Record<string, string>): Promise<RegisterResponse> {
    const { data } = await $api.post<RegisterResponse>('/auth/local', {
      identifier: formData.email,
      password: formData.password
    });
    return data;
  },
 //загружает список статей (публикаций, постов)
 async getArticles(): Promise<ArticlesResponse> {
    const { data } = await $api.get<ArticlesResponse>(
      '/articles?populate[author][populate]=*&populate[notes][populate]=*&sort=createdAt:desc'
    );
    return data;
},

  //создает статью и преобразует плоский 
 
  async createArticle(articleData: { title: string; content: string; author: string }): Promise<{ data: Article }> {
    const { data } = await $api.post<{ data: Article }>('/articles?populate=*', {
      data: {
        title: articleData.title,
        content: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: articleData.content }]
          }
        ],
        author: articleData.author
      }
    });
    return data;
  },


  //удаляет статью
async deleteArticle(documentId: string): Promise<boolean> {
    // все комментариев к статье
    const notes = await $api.get<NotesResponse>(
      `/notes?filters[article][documentId][$eq]=${documentId}`
    );
    
    // и все удалии

    if (notes.data && notes.data.data.length > 0) {//нужно сначала во внутрь обертки, потом во внутрь даты
      await Promise.all(
        notes.data.data.map((note: Note) => 
          $api.delete(`/notes/${note.documentId}`)
        )
      );
    }
    
    await $api.delete(`/articles/${documentId}`);
    return true;
},

  //редактирование пользователя

async updateUser(userId: number, updateData: UpdateUserPayload): Promise<User> {
    const { data } = await $api.put<User>(`/users/${userId}?populate=*`, updateData);
    return data;
},



  async uploadFile(file: File): Promise<UserFile[]> {
      const formData = new FormData();
      formData.append('files', file);
      
      const { data } = await $uploadApi.post<UserFile[]>('/api/upload', formData);
      return data;
  },


  async createNote(noteData: { text: string; article: string; author: string }): Promise<{ data: Note }> {
    const { data } = await $api.post<{ data: Note }>('/notes?populate=*', {
      data: {
        text: noteData.text,
        article: noteData.article,
        author: noteData.author
      }
    });
    return data;
  },



  // получение комментариев к  статье
  async getNotesByArticle(articleDocumentId: string): Promise<NotesResponse> {
    const { data } = await $api.get<NotesResponse>(
      `/notes?filters[article][documentId][$eq]=${articleDocumentId}&populate=*`
    );
    return data;
  },

  // удаление комментария
  async deleteNote(documentId: string): Promise<boolean> {
    await $api.delete(`/notes/${documentId}`);
    return true;
  },


 async updateArticle(documentId: string, articleData: { title?: string; content?: string }): Promise<{ data: Article }> {
    const { data } = await $api.put<{ data: Article }>(`/articles/${documentId}?populate=*`, {
      data: {
        ...(articleData.title && { title: articleData.title }),
        ...(articleData.content && {
          content: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: articleData.content }]
            }
          ]
        })
      }
    });
    return data;
  },

  // поиск публикаций по автору
  async getArticlesByAuthor(authorDocumentId: string): Promise<ArticlesResponse> {
    const { data } = await $api.get<ArticlesResponse>(
      `/articles?filters[author][documentId][$eq]=${authorDocumentId}&populate=*&sort=createdAt:desc`
    );
    return data;
  },

  // поиск статей, прокомментированных автором
  async getCommentedArticles(authorDocumentId: string): Promise<ArticlesResponse> {
    const { data } = await $api.get<NotesResponse>(
      `/notes?filters[author][documentId][$eq]=${authorDocumentId}&populate[article][populate]=*`
    );
    
    const articles = data.data
      .filter((note): note is Note & { article: Article } => !!note.article)
      .map(note => note.article)
      .filter((article, index, self) => 
        index === self.findIndex(a => a.documentId === article.documentId)
      );
    
    return {
      data: articles,
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: articles.length
        }
      }
    };
  },




};
