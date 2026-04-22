module.exports = errorMessage500 = () => {
  const error = new Error();
  error.httpStatusCode = 500;
  return next(error);
};
