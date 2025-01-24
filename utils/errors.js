//  ERRORS

const BAD_REQUEST_ERROR_STATUS_CODE = 400;
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;
const RESOURCE_NOT_FOUND_ERROR_STATUS_CODE = 404;
const UNAUTHORIZED_ACCESS_ERROR_STATUS_CODE = 401;
const CONFLICT_ERROR_STATUS_CODE = 409;
const MONGODB_DUPLICATE_ERROR_STATUS_CODE = 11000;

//  SUCCES

const OK_STATUS_CODE = 200;
const RESOURCE_CREATED_STATUS_CODE = 201;

const RESOURCE_NOT_FOUND_MESSAGE =
  "Resource not found. The requested resource could not be found on this server.";

const errorHandling = (res, err, elem) => {
  console.log(err);
  if (err.name === "DocumentNotFoundError") {
    // Send a 404 Not Found response
    return res
      .status(RESOURCE_NOT_FOUND_ERROR_STATUS_CODE)
      .send({ message: RESOURCE_NOT_FOUND_MESSAGE });
  }

  if (err.name === "ValidationError")
    return res
      .status(BAD_REQUEST_ERROR_STATUS_CODE)
      .send({ message: err.message });

  if (err.name === "CastError")
    return res
      .status(BAD_REQUEST_ERROR_STATUS_CODE)
      .send({ message: `${elem} is not in a valid format` });

  if (err.status === UNAUTHORIZED_ACCESS_ERROR_STATUS_CODE)
    return res
      .status(UNAUTHORIZED_ACCESS_ERROR_STATUS_CODE)
      .send({ message: err.message });

  return res
    .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
    .send({ message: err.message });
};
module.exports = {
  RESOURCE_NOT_FOUND_ERROR_STATUS_CODE,
  RESOURCE_NOT_FOUND_MESSAGE,
  RESOURCE_CREATED_STATUS_CODE,
  UNAUTHORIZED_ACCESS_ERROR_STATUS_CODE,
  CONFLICT_ERROR_STATUS_CODE,
  MONGODB_DUPLICATE_ERROR_STATUS_CODE,
  OK_STATUS_CODE,
  errorHandling,
};
