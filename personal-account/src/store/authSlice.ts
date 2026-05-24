import { createSlice, createAsyncThunk, type PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { api } from '../utils/api';
import type { RootState } from '../store'; 
import type { User, RegisterResponse, AuthState } from '../utils/interfaces';//мы просто

//сохранияет данный в localStorage. 
const saveAuthData = (jwt: string, user: User) => {
  localStorage.setItem('jwt', jwt);
  localStorage.setItem('user', JSON.stringify(user));
};
//ошибки
const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error?.message || 'Ошибка сервера';
  }
  if (err instanceof Error) return err.message;
  return 'Произошла неизвестная ошибка';
};



export const registerUser = createAsyncThunk<RegisterResponse, Record<string, string>, { 
rejectValue: string }>(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await api.register(formData);
      localStorage.setItem('jwt', data.jwt);
      const fullUser = await api.getMe();
      saveAuthData(data.jwt, fullUser);
      return { jwt: data.jwt, user: fullUser };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const loginUser = createAsyncThunk<RegisterResponse, Record<string, string>, { 
rejectValue: string }>(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await api.login(formData);
     
      localStorage.setItem('jwt', data.jwt); // токен
      // данные профиля
      const fullUser = await api.getMe();
      
      saveAuthData(data.jwt, fullUser);
      return { jwt: data.jwt, user: fullUser };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

//Если в localStorage есть токен и данные пользователя,
// мы их восстанавливаем, и пользователю не нужно входить заново
const getSavedUser = (): User | null => {
  try {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
};
const initialState: AuthState = {
  user: getSavedUser(),//берем все из локал сторидж
  token: localStorage.getItem('jwt'),
  loading: false,
  error: null,
};
const authSlice = createSlice({
  name: 'auth',//имя
  initialState,//начальное состояние

  //Часть раз
  reducers: {//синхронные
    logout: (state) => {
      state.user = null;//очистка
      state.token = null;
      localStorage.clear(); 
    },
    clearError: (state) => {//убрать ошибку
      state.error = null;
    },
  },

  //Часть два
//   // Оптимизация - с  помощью addMatcher (как в нашем коде) можно объединять одинаковую 
// логику для входа и регистрации, чтобы не дублировать код
 extraReducers: (builder) => {//асинхронные 
  builder
    .addMatcher(isAnyOf(registerUser.pending, loginUser.pending), (state) => {
      state.loading = true;
      state.error = null;
    })
    .addMatcher(isAnyOf(registerUser.fulfilled, loginUser.fulfilled), (state, action: PayloadAction<RegisterResponse>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.jwt;
    })
    .addMatcher(isAnyOf(registerUser.rejected, loginUser.rejected), (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Ошибка авторизации';
    })
    // новое
    .addMatcher(isAnyOf(updateUserProfile.pending), (state) => {
      state.loading = true;
      state.error = null;
    })
    .addMatcher(isAnyOf(updateUserProfile.fulfilled), (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addMatcher(isAnyOf(updateUserProfile.rejected), (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Ошибка обновления профиля';
    })
    .addMatcher(isAnyOf(changeAvatar.pending), (state) => {
      state.loading = true;
      state.error = null;
    })
    .addMatcher(isAnyOf(changeAvatar.fulfilled), (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addMatcher(isAnyOf(changeAvatar.rejected), (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Ошибка загрузки аватара';
    });
  },
  
})
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuth = (state: RootState) => !!state.auth.token;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;




export const updateUserProfile = createAsyncThunk<User, { userId: number; updateData: { username?: string; email?: string; phone?: string; gender?: string } }, { rejectValue: string }>(
  'auth/updateProfile',
  async ({ userId, updateData }, { rejectWithValue }) => {
    try {
      const updatedUser = await api.updateUser(userId, updateData);
      const fullUser = await api.getMe();
      localStorage.setItem('user', JSON.stringify(fullUser));
      return fullUser;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const changeAvatar = createAsyncThunk<User, File, { rejectValue: string }>(
  'auth/changeAvatar',
  async (file, { rejectWithValue, getState }) => {
    try {
      //апи с файлом
      const uploadedFiles = await api.uploadFile(file);
      
      if (!uploadedFiles || uploadedFiles.length === 0) {
        return rejectWithValue('Ошибка загрузки файла');
      }
      
      const state = getState() as RootState;
      const userId = state.auth.user?.id;
      
      if (!userId) {
        return rejectWithValue('Пользователь не найден');
      }
      
      // обновление с апи
      await api.updateUser(userId, {
        avatar: uploadedFiles[0].id,
      });
      
      const fullUserData = await api.getMe();
      
      localStorage.setItem('user', JSON.stringify(fullUserData));
      
      return fullUserData; 
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// );