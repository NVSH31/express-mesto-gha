const OK = 200;
const CREATE = 201;
const NO_CONTENT = 204;

const BAD_REQUEST = {
  code: 400,
  message: 'переданы некорректные данные',
};

const NOT_FOUND = {
  code: 404,
  message: 'карточка, пользователь или эндпоинт не найдены',
};

const SERVER_ERROR = {
  code: 500,
  message: 'ошибка по-умолчанию',
};

module.exports = {
  OK,
  CREATE,
  NO_CONTENT,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
};
