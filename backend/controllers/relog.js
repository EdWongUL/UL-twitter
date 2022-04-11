const relog = (req, res) => {
  console.log("In GET REQUEST- checking if user has already logged in:");

  if (req.session.loggedIn) {
    console.log("session.loggedIn exists, allowing them to log in");
    res.send({
      login: true,
      message: "already logged in",
      dp: req.session.dp,
      guest: false,
      handle: req.session.handle,
    });
  } else if (req.session.guest) {
    console.log("session.guest exists, giving guest access");
    res.send({
      login: false,
      message: "already logged in as GUEST",
      dp: "",
      guest: true,
      handle: "",
    });
  } else {
    console.log("session.loggedIn does not exist, asking user to log in");
    res.send({ login: false, message: "Please log in" });
  }
};

exports.relog = relog;
