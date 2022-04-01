// 1. Send images from server to clients (do not resend ones that have already been received)- send url instead!
// 2. New tweets should be pushed to the START, not the end- can we order the tweets table by datetime instead?
// 3. Set up request methods for trends.
// https://imgur.com/gallery/fDZJu
// https://i.imgur.com/oVq1gkv.jpeg

// set up server
// process.env.TZ = 'Europe/London'

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const app = express();
const port = 3500;

app.use(
  cors({credentials: true, origin: true}),
  express.json(),
  session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: "shhhh, very secret",
    //cookie: {maxAge: 10000} // 10seconds of maxage for testing- actually do this later
    cookie: { secure: false },
  })
);
// app.use(express.static("/public"));

// Setting up the database connection
const knex = require("knex")({
  client: "better-sqlite3",
  connection: {
    filename: "./ULtwitter.db",
  },
  useNullAsDefault: false,
});

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
    // const checkLikes = await knex.schema.hasTable("likes");
    // if (!checkLikes) {
    //   await knex.schema.createTable("likes", (table) => {
    //     table.increments("id");
    //     // table.key
    //     table.integer("population");
    //   });

    //   const insertLikes = await knex("likes").insert([
    //     {
    //       tweetId: 9
    //       userId: 1
    //     },
    //   ]);
    // }
    // ----------------

    const selectUsers = await knex("users").select("*");
    console.log(selectUsers);
    // const selectTweets = await knex("tweets").select("*");
    // const selectTrends = await knex("trends").select("*");

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

// if there are no more results, then we should return null so the client
// deals with it themselves
const getTweets = async (startingIdx = 0) => {
  try {
    const selectTweets = await knex("tweets")
      .select("*")
      .orderBy("timestamp", "desc")
      .offset(startingIdx)
      .limit(10)
      .join("users", "users.id", "=", "tweets.userId");
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
    const storedHash = await knex("users")
      .select("password")
      .where("username", req.body.username);
    if (storedHash.length === 0) {
      res.send({ login: false, message: "User not found" });
    } else {
      // To regenerate the session simply invoke the method. Once complete,
      // a new SID and Session instance will be initialized at req.session
      // and the callback will be invoked.
      const match = bcrypt.compareSync(
        req.body.password,
        storedHash[0].password
      );
      console.log(req.session);
      if (match) {
        req.session.user = true;
      }
      req.session.save();
      console.log(req.session);
      res.send({
        login: match,
        message: "User match",
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

app.listen(port, () => {
  setUp();
  console.log(`Example app listening on port ${port}!`);
});
