const { checkUserSession } = require("./checkUserSession");

const sessionCheckMiddleware = (req, res, next) => {
  if (!checkUserSession(req, res)) {
    res.send({ login: false, message: "Please log in" });
    console.log("Session invalid in middleware layer");
    return;
  }
  next();
};

exports.sessionCheckMiddleware = sessionCheckMiddleware;
