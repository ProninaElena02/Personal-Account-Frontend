
export type FormErrors = Record<string, string>;


// не пусто поле, самаяя первая провекра
export const validateRequired = (value: string, fieldName: string): string => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} не может быть пустым`;
  }
  return '';
};

// минимальная длина
export const validateMinLength = (value: string, minLength: number, fieldName: string): string => {
  if (value.trim().length < minLength) {
    return `Минимальная длина ${fieldName}: ${minLength} символов`;
  }
  return '';
};

// нет пробелов
export const validateNoLeadingSpaces = (value: string, fieldName: string): string => {
  if (value !== value.trimStart()) {
    return `${fieldName} не должно начинаться с пробелов`;
  }
  return '';
};

//
export const dobleSpaces = (value: string, fieldName: string): string => {
  if (/\s{2,}/.test(value)) {
    return `${fieldName} не должно начинаться с пробелов`;
  }
  return '';
};

//формат почты
export const validateEmail = (email: string): string => {
  if (!email || email.trim().length === 0) {
    return 'Email обязателен';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Неверный формат email';
  }
  return '';
};

//


//имя пользователя
// export const validateUsername = (username: string): string => {
//   if (!username || username.trim().length === 0) {
//     return 'Имя пользователя обязательно';
//   }
//   if (username.trim().length < 2) {
//     return 'Минимальная длина имени: 2 символа';
//   }
//   if (!/^[A-Za-zА-Яа-яЁё\s-]+$/.test(username.trim())) {
//     return 'Разрешены только буквы, пробелы и дефисы';
//   }
//   if (username !== username.trimStart()) {
//     return 'Имя не должно начинаться с пробелов';
//   }
//   return '';
// };
export const validateUsername = (username: string): string => {
  return validateRequired(username, 'Имя пользователя') //Имя пользователя не может быть пустым
      || validateMinLength(username, 2, 'Имя пользователя') 
      || validateNoLeadingSpaces(username, 'Имя пользователя')
      // || (!/^[A-Za-zА-Яа-яЁё\s-]+$/.test(username.trim()) 
      //     ? 'Разрешены только буквы, пробелы и дефисы' 
      //     : '');
      || (!/^[A-Za-zА-Яа-яЁё\s-]+$/.test(username.trim()) 
        ? 'Разрешены только буквы, пробелы и дефисы' 
        : '')
      || (/[\\\/,?<>:*"|]/.test(username)
        ? 'Запрещены символы: \\ / , ? < > : * " |'
        : '');
};

//пароль
export const validatePassword = (password: string): string => {
  if (!password) {
    return 'Пароль обязателен';
  }
  if (password.length < 6) {
    return 'Минимальная длина пароля: 6 символов';
  }
  return '';
};

//заголовок
// export const validateTitle = (title: string): string => {
//   if (!title || title.trim().length === 0) {
//     return 'Заголовок обязателен';
//   }
//   if (title.trim().length < 3) {
//     return 'Минимальная длина заголовка: 3 символа';
//   }
//   if (title !== title.trimStart()) {
//     return 'Заголовок не должен начинаться с пробелов';
//   }
//   if (/\s{2,}/.test(title)) {
//     return 'Заголовок не должен содержать двойных пробелов';
//   }
//   return '';
// };
export const validateTitle = (title: string): string => {
  return validateRequired(title, 'Заголовок') 
      || validateMinLength(title, 3, 'Заголовок') 
      || validateNoLeadingSpaces(title, 'Заголовок')
      || (/[\\\/,?<>:*"|]/.test(title)
        ? 'Запрещены символы: \\ / , ? < > : * " |'
        : '')
      || dobleSpaces(title, 'Заголовок')
      || '';
};


//статья

export const validateContent = (content: string): string => {
  return validateRequired(content, 'Статья') 
      || validateMinLength(content, 2, 'Статья') 
      || validateNoLeadingSpaces(content, 'Статья')
      || '';
};

//коментарий
// export const validateCommentText = (text: string): string => {
//   if (!text || text.trim().length === 0) {
//     return 'Комментарий не может быть пустым';
//   }
//   if (text.trim().length < 2) {
//     return 'Минимальная длина комментария: 2 символа';
//   }
//   if (text !== text.trimStart()) {
//     return 'Комментарий не должен начинаться с пробелов';
//   }
//   return '';
// };
export const validateCommentText = (text: string): string => {
  return validateRequired(text, 'Комментарий') 
      || validateMinLength(text, 2, 'Комментарий') 
      || validateNoLeadingSpaces(text, 'Комментарий')
      || '';
};

//телефо
export const validatePhone = (phone: string): string => {
  if (!phone || phone.trim().length === 0) {
    return ''; // телефон опциональный
  }
  if (!/^\+?[\d\s\-()]{7,15}$/.test(phone.trim())) {
    return 'Неверный формат телефона';
  }
  return '';
};


//логин
export const validateLoginForm = (formData: Record<string, string>): FormErrors => {
  const errors: FormErrors = {};
  
  const emailError = validateRequired(formData.email, 'Email') || validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validateRequired(formData.password, 'Пароль') || validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

//регистрация
export const validateRegisterForm = (formData: Record<string, string>): FormErrors => {
  const errors: FormErrors = {};
  
  const usernameError = validateRequired(formData.username, 'Имя') || validateUsername(formData.username);
  if (usernameError) errors.username = usernameError;
  
  const emailError = validateRequired(formData.email, 'Email') || validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validateRequired(formData.password, 'Пароль') || validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

//пррир редактировании
export const validateArticleForm = (formData: Record<string, string>): FormErrors => {
  const errors: FormErrors = {};
  
  const titleError = validateRequired(formData.title, 'Заголовок') || validateTitle(formData.title);
  if (titleError) errors.title = titleError;
  
  const contentError = validateRequired(formData.content, 'Статья') || validateContent(formData.content);
  if (contentError) errors.content = contentError;
  
  return errors;
};

//коментарий
export const validateNoteForm = (formData: Record<string, string>): FormErrors => {
  const errors: FormErrors = {};
  
  const textError = validateRequired(formData.text, 'Комментарий') || validateCommentText(formData.text);
  if (textError) errors.text = textError;
  
  return errors;
};

//редактир проф
export const validateProfileForm = (formData: Record<string, string>): FormErrors => {
  const errors: FormErrors = {};
  
  const usernameError = validateRequired(formData.username, 'Имя') || validateUsername(formData.username);
  if (usernameError) errors.username = usernameError;
  
  const emailError = validateRequired(formData.email, 'Email') || validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  if (formData.phone) {
    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
  }
  
  return errors;
};