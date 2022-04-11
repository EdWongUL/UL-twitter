const getTrends = async (knex, req, res) => {
  console.log("In get request- for fetching trends when logging on.");

  try {
    const selectTrends = await knex("trends")
      .select("*")
      .limit(5)
      .orderBy("population", "desc");
    res.send(selectTrends);
  } catch (e) {
    console.log(e);
  }
};

exports.getTrends = getTrends;
