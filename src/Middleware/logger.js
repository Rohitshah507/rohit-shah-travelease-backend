const logger = (req, res, next) => {

    const method = req.method;
    const url = req.url;

  console.log(`Method: ${method} URL: ${url}`);
  next();
};

export default logger;