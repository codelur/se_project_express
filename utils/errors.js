//  ERRORS

const BAD_REQUEST_ERROR_STATUS_CODE = 400;
const UNAUTHORIZED_ACCESS_ERROR_STATUS_CODE = 401;
const FORBIDDEN_ACCESS_ERROR_STATUS_CODE = 403;
const RESOURCE_NOT_FOUND_ERROR_STATUS_CODE = 404;
const CONFLICT_ERROR_STATUS_CODE = 409;

const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;

const MONGODB_DUPLICATE_ERROR_STATUS_CODE = 11000;

//  SUCCES

const OK_STATUS_CODE = 200;
const RESOURCE_CREATED_STATUS_CODE = 201;

// MESSAGES
const RESOURCE_NOT_FOUND_MESSAGE =
  "Resource not found. The requested resource could not be found on this server.";

const UNAUTHORIZED_ACCESS_MESSAGE = "Unauthorized access to this resource.";
const BAD_REQUEST_MESSAGE = "The request parameters are incorrect.";
const FORBIDDEN_ACCESS_MESSAGE =
  "The user doesnt have access to this resource.";

// ERROR NAMES

const DOCUMENT_NOT_FOUND_ERROR = "DocumentNotFoundError";
const VALIDATION_ERROR = "ValidationError";
const CAST_ERROR = "CastError";

const errorHandling = (res, err, elem) => {
  if (err.name === DOCUMENT_NOT_FOUND_ERROR) {
    // Send a 404 Not Found response
    return res
      .status(RESOURCE_NOT_FOUND_ERROR_STATUS_CODE)
      .send({ message: RESOURCE_NOT_FOUND_MESSAGE });
  }

  if (err.name === VALIDATION_ERROR)
    return res
      .status(BAD_REQUEST_ERROR_STATUS_CODE)
      .send({ message: err.message });

  if (err.name === CAST_ERROR)
    return res
      .status(BAD_REQUEST_ERROR_STATUS_CODE)
      .send({ message: `${elem} is not in a valid format` });

  if (err.status === UNAUTHORIZED_ACCESS_ERROR_STATUS_CODE)
    return res
      .status(err.status)
      .send({ message: UNAUTHORIZED_ACCESS_MESSAGE });

  if (err.status === BAD_REQUEST_ERROR_STATUS_CODE)
    return res.status(err.status).send({ message: BAD_REQUEST_MESSAGE });

  if (err.status === FORBIDDEN_ACCESS_ERROR_STATUS_CODE)
    return res.status(err.status).send({ message: FORBIDDEN_ACCESS_MESSAGE });

  return res
    .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
    .send({ message: err.message });
};
module.exports = {
  RESOURCE_NOT_FOUND_ERROR_STATUS_CODE,
  RESOURCE_NOT_FOUND_MESSAGE,
  RESOURCE_CREATED_STATUS_CODE,
  FORBIDDEN_ACCESS_ERROR_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  UNAUTHORIZED_ACCESS_ERROR_STATUS_CODE,
  BAD_REQUEST_ERROR_STATUS_CODE,
  CONFLICT_ERROR_STATUS_CODE,
  MONGODB_DUPLICATE_ERROR_STATUS_CODE,
  OK_STATUS_CODE,
  DOCUMENT_NOT_FOUND_ERROR,
  errorHandling,
};
