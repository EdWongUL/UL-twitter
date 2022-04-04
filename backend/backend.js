// backend api for Twottor

const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const app = express();
const port = 4000;

app.use(
  express.json(),
  session({
    saveUninitialized: false, // don't create session until something stored
    secret: "shhhh, very secret",
    resave: true,
  })
);

// Setting up the database connection
const knex = require("knex")({
  client: "better-sqlite3",
  connection: {
    filename: "./ULtwitter.db",
  },
  useNullAsDefault: false,
});

// set up the db
const setUp = async () => {
  try {
    const checkUsers = await knex.schema.hasTable("users");
    if (!checkUsers) {
      await knex.schema.createTable("users", (table) => {
        table.increments("id");
        table.string("userName");
        table.string("handle");
        table.boolean("verified");
        table.string("dp");
        table.string("password");
      });

      const salt = bcrypt.genSaltSync(10);
      const hash1 = bcrypt.hashSync("password1", salt);
      const hash2 = bcrypt.hashSync("password2", salt);
      const hash3 = bcrypt.hashSync("password3", salt);

      const insertUsers = await knex("users").insert([
        {
          username: "somedude",
          handle: "thedude420",
          verified: 0,
          dp: "https://i.imgur.com/5mXfwr1.jpeg",
          password: hash1,
        },
        {
          username: "dankTweeter",
          handle: "tweetboi69",
          verified: 1,
          dp: "https://i.imgur.com/fhsxW9y.jpeg",
          password: hash2,
        },
        {
          username: "EdBoi",
          handle: "newUser6969",
          verified: 1,
          dp: "https://i.imgur.com/xOLdUTa.jpeg",
          password: hash3,
        },
      ]);
    }

    const checkTweets = await knex.schema.hasTable("tweets");
    if (!checkTweets) {
      await knex.schema.createTable("tweets", (table) => {
        table.increments("id");
        table.datetime("timestamp").defaultTo(knex.fn.now());
        table.string("content");
        table.integer("retweet").defaultTo(0);
        table.integer("heart").defaultTo(0);
        table.integer("comment").defaultTo(0);
        table.integer("userId").unsigned().references("users.id");
      });
      const insertTweets = await knex("tweets").insert([
        {
          content: "A succulent chinese meal",
          retweet: 4,
          heart: 20,
          comment: 69,
          userId: 1,
        },
        {
          content: "I see you know your judo well",
          retweet: 242,
          heart: 173,
          comment: 1,
          userId: 1,
        },
        {
          content: "I'm about to say something that will get me cancelled.",
          retweet: 244,
          heart: 1230,
          comment: 999,
          userId: 2,
        },
        {
          content: "I can't believe it's not butter",
          retweet: 1,
          heart: 2,
          comment: 2,
          userId: 1,
        },
        {
          content: "Never",
          retweet: 1,
          heart: 2,
          comment: 1,
          userId: 2,
        },
        {
          content: "gonna",
          retweet: 1,
          heart: 2,
          comment: 2,
          userId: 2,
        },
        {
          content: "give",
          retweet: 4,
          heart: 3,
          comment: 2,
          userId: 2,
        },
        {
          content: "you",
          retweet: 1,
          heart: 1,
          comment: 2,
          userId: 2,
        },
        {
          content: "up",
          retweet: 4,
          heart: 20,
          comment: 69,
          userId: 2,
        },
        {
          content: "chip shop boys are my favourite omg <3",
          retweet: 2,
          heart: 1000,
          comment: 38,
          userId: 1,
        },
        {
          content: "I just brought a brocolli",
          retweet: 9,
          heart: 9,
          comment: 8,
          userId: 2,
        },
      ]);
    }

    const checkTrends = await knex.schema.hasTable("trends");
    if (!checkTrends) {
      await knex.schema.createTable("trends", (table) => {
        table.increments("id");
        table.string("trendTitle");
        table.integer("population");
      });

      const insertTrends = await knex("trends").insert([
        {
          trendTitle: "WillSmith",
          population: 696969,
        },
        {
          trendTitle: "Eggs",
          population: 1337,
        },
        {
          trendTitle: "ChipShopBoys",
          population: 420,
        },
        {
          trendTitle: "succulent",
          population: 50000,
        },
        {
          trendTitle: "chinese",
          population: 49000,
        },
        {
          trendTitle: "meal",
          population: 48000,
        },
        {
          trendTitle: "ChipShopBoysPt2",
          population: 300,
        },
      ]);
    }

    // LIKES THING ---
    const checkLikes = await knex.schema.hasTable("likes");
    if (!checkLikes) {
      await knex.schema.createTable("likes", (table) => {
        table.integer("tweetId");
        table.foreign("tweetId").references("tweets.id");
        table.integer("userId");
        table.foreign("userId").references("users.id");
      });

      const insertLikes = await knex("likes").insert([
        {
          userId: 1,
          tweetId: 9,
        },
        {
          userId: 2,
          tweetId: 9,
        },
        {
          userId: 3,
          tweetId: 9,
        },
        {
          userId: 1,
          tweetId: 6,
        },
      ]);
    }
    // ----------------

    // const selectUsers = await knex("users").select("*");
    // console.log(selectUsers);
    // const selectTweets = await knex("tweets").select("*");
    // console.log(selectTweets);
    // const selectTrends = await knex("trends").select("*");
    // console.log(selectTrends);
    // const selectLikes = await knex("likes").select("*");
    // console.log(selectLikes);

    // TODO not sure if I'm doing this right or not
    const bookshelf = require("bookshelf")(knex);

    const User = bookshelf.model("User", {
      tableName: "users",
      tweets() {
        return this.hasMany(Tweets);
      },
    });

    const Tweet = bookshelf.model("Tweet", {
      tableName: "tweets",
      users() {
        return this.belongsTo("User");
      },
    });

    return;
  } catch (e) {
    console.log(e);
  }
};

const getTweets = async (startingIdx = 0) => {
  try {
    const selectTweets = await knex("tweets")
      .select("*")
      .orderBy("timestamp", "desc")
      .offset(startingIdx)
      .limit(10)
      .join("users", "tweets.userId", "=", "users.id");
    // COUNT HOW MANY LIKES EACH TWEET HAS AND RETURN THIS TOO
    console.log(selectTweets)
    return selectTweets;
  } catch (e) {
    console.log(e);
  }
};

const getTrends = async () => {
  try {
    const selectTrends = await knex("trends")
      .select("*")
      .limit(5)
      .orderBy("population", "desc");
    console.log(selectTrends);
    return selectTrends;
  } catch (e) {
    console.log(e);
  }
};

const getUserFromHandle = async (handle) => {
  try {
    const selectHandle = await knex("users")
      .where({ handle: handle })
      .select("id");
    return selectHandle[0];
  } catch (e) {
    console.log(e);
  }
};

app.get("/tweets/:startingIdx", async (req, res) => {
  console.log("In get request- for fetching tweets when logging on.");
  console.log(req.session);
  if (req.session.user) {
    console.log("Getting tweets-Session ok");
    const tweets = await getTweets(req.params.startingIdx);
    res.send(tweets);
  } else {
    console.log("Tweets denied, session invalid");
    res.send("ACCESS DENIED");
  }
});

app.get("/trends", async (req, res) => {
  if (req.session.user) {
    console.log("In get request- for fetching tweets when logging on.");
    const trends = await getTrends();
    res.send(trends);
  } else {
    console.log("Tweets denied, session invalid");
    res.send("ACCESS DENIED");
  }
});

app.post("/login", async (req, res) => {
  console.log("In post request- Logging in");

  try {
    const getUserPWDP = await knex("users")
      .select("password", "dp")
      .where("username", req.body.username);
    if (getUserPWDP.length === 0) {
      res.send({ login: false, message: "User not found" });
    } else {
      // To regenerate the session simply invoke the method. Once complete,
      // a new SID and Session instance will be initialized at req.session
      // and the callback will be invoked.
      const match = bcrypt.compareSync(
        req.body.password,
        getUserPWDP[0].password
      );
      console.log(getUserPWDP);
      if (match) {
        req.session.user = true;
        req.session.dp = getUserPWDP[0].dp;
      }
      // req.session.save();
      res.send({
        login: match,
        message: "User match",
        dp: getUserPWDP[0].dp,
      });
    }
  } catch (e) {
    console.log(e);
  }
});

app.post("/", async (req, res) => {
  console.log("In post request- for clients sending tweets to the server.");

  const id = await getUserFromHandle(req.body.handle);

  try {
    const insertTweets = await knex("tweets").insert({
      content: req.body.content,
      userId: id.id,
    });
    const tweets = await getTweets();
    console.log(tweets);
    res.send("SUCCESSFULLY POSTED TWEET");
  } catch (e) {
    console.log(e);
  }
});

// for
app.get("/relog", async (req, res) => {
  console.log("In GET REQUEST- checking if user has already logged in:");
  console.log(req.session.user);

  if (req.session.user) {
    res.send({ login: true, message: "already logged in", dp: req.session.dp });
  } else {
    res.send({ login: false, message: "Please log in" });
  }
});

app.listen(port, () => {
  setUp();
  console.log(`Example app listening on port ${port}!`);
});
