const bcrypt = require("bcryptjs");
const { getIdFromHandle } = require("./getIdFromHandle");

const login = async (knex, req, res) => {
  console.log("In post request- Logging in");
  try {
    if (req.body.guest) {
      console.log(
        "Client requested guest access, setting req.session.guest = true"
      );
      // save session
      req.session.guest = true;
      res.send({
        login: false,
        message: "Guest log in",
        dp: "",
        guest: true,
      });
    } else {
      console.log("Client tried to log in, checking password.");
      const getUserPWDP = await knex("users")
        .select("password", "dp", "handle")
        .where("username", req.body.username);
      console.log(getUserPWDP);
      if (getUserPWDP.length === 0) {
        res.send({
          login: false,
          message: "User not found",
          dp: "",
          guest: false,
        });
      } else {
        const match = bcrypt.compareSync(
          req.body.password,
          getUserPWDP[0].password
        );
        if (match) {
          // save session
          req.session.loggedIn = true;
          req.session.dp = getUserPWDP[0].dp;
          req.session.handle = getUserPWDP[0].handle;
          req.session.userId = (
            await getIdFromHandle(knex, getUserPWDP[0].handle)
          ).id;
        }
        res.send({
          login: match,
          message: "User match",
          dp: getUserPWDP[0].dp,
          guest: false,
          handle: getUserPWDP[0].handle,
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
}

exports.login = login;