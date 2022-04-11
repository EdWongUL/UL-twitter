
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
        table.integer("authorId").unsigned().references("users.id");
        table.datetime("timestamp").defaultTo(knex.fn.now());
        table.string("content");
      });
      const insertTweets = await knex("tweets").insert([
        {
          authorId: 1,
          content: "A succulent chinese meal",
        },
        {
          authorId: 1,
          content: "I see you know your judo well",
        },
        {
          authorId: 2,
          content: "I'm about to say something that will get me cancelled.",
        },
        {
          authorId: 1,
          content: "I can't believe it's not butter",
        },
        {
          authorId: 2,
          content: "Never",
        },
        {
          authorId: 2,
          content: "gonna",
        },
        {
          authorId: 2,
          content: "give",
        },
        {
          authorId: 2,
          content: "you",
        },
        {
          authorId: 2,
          content: "up",
        },
        {
          authorId: 1,
          content: "chip shop boys are my favourite omg <3",
        },
        {
          authorId: 2,
          content: "I just brought a brocolli",
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

    // LIKES ---
    const checkLikes = await knex.schema.hasTable("likes");
    if (!checkLikes) {
      await knex.schema.createTable("likes", (table) => {
        table.increments("id");
        table.integer("tweetId");
        table.foreign("tweetId").references("tweets.id");
        table.integer("userId");
        table.foreign("userId").references("users.id");
      });

      const insertLikes = await knex("likes").insert([
        {
          tweetId: 9,
          userId: 1,
        },
        {
          tweetId: 9,
          userId: 2,
        },
        {
          tweetId: 9,
          userId: 3,
        },
        {
          tweetId: 6,
          userId: 3,
        },
        {
          tweetId: 5,
          userId: 1,
        },
        {
          tweetId: 4,
          userId: 1,
        },
        {
          tweetId: 4,
          userId: 2,
        },
        {
          tweetId: 3,
          userId: 3,
        },
        {
          tweetId: 3,
          userId: 2,
        },
        {
          tweetId: 3,
          userId: 1,
        },
        {
          tweetId: 1,
          userId: 1,
        },
        {
          tweetId: 1,
          userId: 2,
        },
      ]);
    }

    // RETWEETS ---
    const checkRetweet = await knex.schema.hasTable("retweet");
    if (!checkRetweet) {
      await knex.schema.createTable("retweet", (table) => {
        table.increments("id");
        table.integer("tweetId");
        table.foreign("tweetId").references("tweets.id");
        table.integer("userId");
        table.foreign("userId").references("users.id");
      });

      const insertRetweet = await knex("retweet").insert([
        {
          tweetId: 11,
          userId: 1,
        },
        {
          tweetId: 9,
          userId: 1,
        },
        {
          tweetId: 9,
          userId: 3,
        },
        {
          tweetId: 6,
          userId: 3,
        },
        {
          tweetId: 5,
          userId: 1,
        },
        {
          tweetId: 4,
          userId: 1,
        },
        {
          tweetId: 4,
          userId: 2,
        },
        {
          tweetId: 3,
          userId: 3,
        },
        {
          tweetId: 3,
          userId: 2,
        },
        {
          tweetId: 3,
          userId: 1,
        },
        {
          tweetId: 1,
          userId: 1,
        },
        {
          tweetId: 1,
          userId: 2,
        },
      ]);
    }

    // COMMENTS THING ---
    const checkComments = await knex.schema.hasTable("comments");
    if (!checkComments) {
      await knex.schema.createTable("comments", (table) => {
        table.increments("id");
        table.integer("tweetId");
        table.foreign("tweetId").references("tweets.id");
        table.integer("userId");
        table.foreign("userId").references("users.id");
        table.string("comment");
      });

      const insertComments = await knex("comments").insert([
        {
          tweetId: 11,
          userId: 1,
          comment: "commenting",
        },
        {
          tweetId: 9,
          userId: 1,
          comment: "commenting",
        },
        {
          tweetId: 9,
          userId: 2,
          comment: "commenting",
        },
        {
          tweetId: 9,
          userId: 3,
          comment: "commenting",
        },
        {
          tweetId: 6,
          userId: 3,
          comment: "commenting",
        },
        {
          tweetId: 5,
          userId: 1,
          comment: "commenting",
        },
        {
          tweetId: 4,
          userId: 1,
          comment: "commenting",
        },
        {
          tweetId: 4,
          userId: 2,
          comment: "commenting",
        },
        {
          tweetId: 3,
          userId: 3,
          comment: "commenting",
        },
        {
          tweetId: 3,
          userId: 2,
          comment: "commenting",
        },
        {
          tweetId: 3,
          userId: 1,
          comment: "commenting",
        },
        {
          tweetId: 1,
          userId: 1,
          comment: "commenting",
        },
        {
          tweetId: 1,
          userId: 2,
          comment: "commenting",
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

exports.setUp = setUp;
exports.knex = knex;
