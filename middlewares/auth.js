const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../utils/config");
const { UNAUTHORIZED_ACCESS_ERROR_STATUS_CODE, errorHandling } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
     const err = new Error();
     err.status = UNAUTHORIZED_ACCESS_ERROR_STATUS_CODE;
     errorHandling(res, err, "Authorization", next);
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
     err.status = UNAUTHORIZED_ACCESS_ERROR_STATUS_CODE;
     errorHandling(res, err, "Authorization", next);
  }

  req.user = payload;

  return next();
};
