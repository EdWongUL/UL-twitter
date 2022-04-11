const link = async (knex, req, res) => {
  console.log("In post request- user clicked a link button");
  // console.log(req.body.tweetId);
  console.log(req.body);
  //check if the user liked it already
  const selectLike = await knex(req.body.content)
    .select("*")
    .where({ tweetId: req.body.tweetId, userId: req.session.userId });

  // if this is 0, user has not liked it before.
  // if this is 1, user HAS liked it before.
  if (selectLike.length === 0) {
    console.log("adding interaction to db");
    const insertLikes = await knex(req.body.content).insert([
      { tweetId: req.body.tweetId, userId: req.session.userId },
    ]);
  } else {
    console.log("user already interacted with this tweet, deleting");
    const deleteLike = await knex(req.body.content)
      .where({ tweetId: req.body.tweetId, userId: req.session.userId })
      .del();
  }

  const newCount = await knex(req.body.content)
    .select("*")
    .where({ tweetId: req.body.tweetId })
    .count("id", { as: "totalCount" });
  // Do the opposite and then confirm by sending that response back to the
  // user (AFTER we have inserted the new interaction)
  // Send info back of updated value of each thingy
  console.log(newCount[0].totalCount);
  res.send({
    inserted: selectLike.length === 0,
    newTotal: newCount[0].totalCount,
  });
  // res.send("clicked link thing");
};

exports.link = link;
