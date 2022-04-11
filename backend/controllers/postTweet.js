const { getIdFromHandle } = require("./getIdFromHandle");

const postTweet = async (knex, req, res) => {
  console.log("In post request- for clients sending tweets to the server.");
  const id = await getIdFromHandle(knex, req.body.handle);
  try {
    const insertTweets = await knex("tweets").insert({
      authorId: id.id,
      content: req.body.content,
    });
    res.send({ login: true, message: "Sucessfully posted tweet" });
  } catch (e) {
    console.log(e);
  }
};

exports.postTweet = postTweet;
