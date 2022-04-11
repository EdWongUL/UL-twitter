
const getTweets = async (knex, req, res) => {
  console.log("In get request- for fetching tweets.");
  // array, first object is the tweets, then the subsequent ones are the ones that the user has interacted
  // with, null if it's a guest
  const sessionUserId = req.session.userId;

  try {
    let userInteractionsLikes = null;
    let userInteractionsRetweet = null;
    let userInteractionsComment = null;

    let totals;

    const countLikes = knex("tweets")
      .join("users", "users.id", "tweets.authorId")
      .select(
        "tweets.id",
        "authorId",
        "timestamp",
        "content",
        "userName",
        "handle",
        "verified",
        "dp",
        { tweetIdOG: "tweets.id" }
      )
      .leftJoin("likes", "tweets.id", "=", "likes.tweetId")
      .count("likes.id", { as: "totalLikes" })
      .groupBy("tweets.id")
      .as("countLikes");

    const countRetweets = knex("tweets")
      .join("users", "users.id", "tweets.authorId")
      .select({ tweetIdOG: "tweets.id" })
      .leftJoin("retweet", "tweets.id", "=", "retweet.tweetId")
      .count("retweet.id", { as: "totalRetweets" })
      .groupBy("tweets.id")
      .as("countRetweets");

    const countComments = knex("tweets")
      .join("users", "users.id", "tweets.authorId")
      .select({ tweetIdOG: "tweets.id" })
      .leftJoin("comments", "tweets.id", "=", "comments.tweetId")
      .count("comments.id", { as: "totalComments" })
      .groupBy("tweets.id")
      .as("countComments");

    if (sessionUserId !== undefined) {
      const userInteractionsLikesPlain = knex("likes")
        .select("*")
        .where("userID", sessionUserId)
        .as("userInteractionsLikesPlain");

      const userInteractionsLikes = knex
        .from(countLikes)
        .leftJoin(
          userInteractionsLikesPlain,
          "userInteractionsLikesPlain.tweetId",
          "countLikes.tweetIdOG"
        )
        .select(
          "tweetIdOG",
          "authorId",
          "timestamp",
          "content",
          "userName",
          "handle",
          "verified",
          "dp",
          "totalLikes",
          knex.raw(
            "CASE userInteractionsLikesPlain.userId WHEN (?) THEN 1 ELSE 0 END AS userLikeInteraction",
            [sessionUserId]
          )
        )
        .as("userInteractionsLikes");

      const userInteractionsRetweetPlain = knex("retweet")
        .select("*")
        .where("userID", sessionUserId)
        .as("userInteractionsRetweetPlain");

      const userInteractionsRetweet = knex
        .from(countRetweets)
        .leftJoin(
          userInteractionsRetweetPlain,
          "userInteractionsRetweetPlain.tweetId",
          "countRetweets.tweetIdOG"
        )
        .select(
          "tweetIdOG",
          "totalRetweets",
          knex.raw(
            "CASE userInteractionsRetweetPlain.userId WHEN (?) THEN 1 ELSE 0 END AS userRetweetInteraction",
            [sessionUserId]
          )
        )
        .as("userInteractionsRetweet");

      const userInteractionsCommentsPlain = knex("comments")
        .select("*")
        .where("userID", sessionUserId)
        .as("userInteractionsCommentsPlain");

      const userInteractionsComments = knex
        .from(countComments)
        .leftJoin(
          userInteractionsCommentsPlain,
          "userInteractionsCommentsPlain.tweetId",
          "countComments.tweetIdOG"
        )
        .select(
          "*",
          knex.raw(
            "CASE userInteractionsCommentsPlain.userId WHEN (?) THEN 1 ELSE 0 END AS userCommentsInteraction",
            [sessionUserId]
          )
        )
        .as("userInteractionsComments");

      totals = await knex
        .select(
          "userInteractionsLikes.tweetIdOG",
          "authorId",
          "timestamp",
          "content",
          "userName",
          "handle",
          "verified",
          "dp",
          "totalLikes",
          "totalRetweets",
          "totalComments",
          "userLikeInteraction",
          "userRetweetInteraction",
          "userCommentsInteraction"
        )
        .from(userInteractionsLikes)
        .join(
          userInteractionsRetweet,
          "userInteractionsLikes.tweetIdOG",
          "userInteractionsRetweet.tweetIdOG"
        )
        .join(
          userInteractionsComments,
          "userInteractionsComments.tweetIdOG",
          "userInteractionsRetweet.tweetIdOG"
        )
        .orderBy("timestamp", "desc")
        .offset(req.params.startingIdx)
        .limit(10);
    } else {
      // user undefined- guest, just send back as regular tweets

      totals = await knex
        .select("*")
        .from(countLikes)
        .join(countRetweets, "countLikes.tweetIdOG", "countRetweets.tweetIdOG")
        .join(
          countComments,
          "countComments.tweetIdOG",
          "countRetweets.tweetIdOG"
        )
        .orderBy("timestamp", "desc")
        .offset(req.params.startingIdx)
        .limit(10);
    }

    res.send(totals);
  } catch (e) {
    console.log(e);
  }
  
}

exports.getTweets = getTweets;

