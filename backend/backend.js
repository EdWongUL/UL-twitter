// backend api for Twottor

const express = require("express");
const session = require("express-session");
const { getTweets } = require("./controllers/getTweets");
const { getTrends } = require("./controllers/getTrends");
const {
  sessionCheckMiddleware,
} = require("./controllers/sessionCheckMiddleware");
const { login } = require("./controllers/login");
const { link } = require("./controllers/link");
const { relog } = require("./controllers/relog");
const { postTweet } = require("./controllers/postTweet");
const { knex, setUp } = require("./knexDB");

const app = express();
const privateRouter = express.Router();
privateRouter.use(sessionCheckMiddleware);
app.use(
  express.json(),
  session({
    saveUninitialized: false, // don't create session until something stored
    secret: "shhhh, very secret",
    resave: true,
  })
);
// anything requested through this needs to check if the user is actually logged in, not just a guest.
app.use("/private", privateRouter);

const port = 4000;

// public request
app.get("/tweets/:startingIdx", (req, res) => {
  getTweets(knex, req, res);
});

// public request
app.get("/trends", (req, res) => {
  getTrends(knex, req, res);
});

// public request
app.post("/login", (req, res) => {
  login(knex, req, res);
});

// public request
app.get("/relog", (req, res) => {
  relog(req, res);
});

// private request
privateRouter.post("/link", (req, res) => {
  link(knex, req, res);
});

// private request
privateRouter.post("/", (req, res) => {
  postTweet(knex, req, res);
});

app.listen(port, () => {
  setUp();
  console.log(`Example app listening on port ${port}!`);
});
