const OK = {
    CODE: 200,
    MESSAGE: 'OK'
};

const Created = {
    CODE: 201,
    MESSAGE: 'Created'
};

const NoContent = {
    CODE: 204,
    MESSAGE: 'No Content'
};

const BadRequest = {
    CODE: 400,
    MESSAGE: 'Bad Request'
};

const Unauthorized = {
    CODE: 401,
    MESSAGE: 'Unauthorized'
};

const Forbidden = {
    CODE: 403,
    MESSAGE: 'Forbidden'
};

const NotFound = {
    CODE: 404,
    MESSAGE: 'Not Found'
};

const MethodNotAllowed = {
    CODE: 405,
    MESSAGE: 'Method Not Allowed'
};

const InternalServerError = {
    CODE: 500,
    MESSAGE: 'Internal Server Error'
};

const HTTP = {
    STATUS_200: OK,
    STATUS_201: Created,
    STATUS_204: NoContent,
    STATUS_400: BadRequest,
    STATUS_401: Unauthorized,
    STATUS_403: Forbidden,
    STATUS_404: NotFound,
    STATUS_405: MethodNotAllowed,
    STATUS_500: InternalServerError
};
  
export default HTTP;