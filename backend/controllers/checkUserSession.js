const checkUserSession = (req, res) => {
  console.log(req.session.loggedIn);
  return req.session.loggedIn;
};

exports.checkUserSession = checkUserSession;
