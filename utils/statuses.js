const OK = 200;
const CREATE = 201;
const NO_CONTENT = 204;

const BAD_REQUEST = {
  code: 400,
  message: 'переданы некорректные данные',
};

const UNAUTHORIZED = {
  code: 401,
  message: 'ошибка доступа',
};

const FORBIDDEN = {
  code: 403,
  message: 'недостаточно прав',
};

const NOT_FOUND = {
  code: 404,
  message: 'карточка, пользователь или эндпоинт не найдены',
};

const UNIQUE_FIELD = {
  code: 409,
  message: 'значение уже используется',
};

const SERVER_ERROR = {
  code: 500,
  message: 'ошибка по-умолчанию',
};

module.exports = {
  OK,
  CREATE,
  NO_CONTENT,
  UNAUTHORIZED,
  FORBIDDEN,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  UNIQUE_FIELD,
};
