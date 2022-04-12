const findUsers = async (knex, req, res) => {
  console.log("In post request- looking for user");

  console.log(req.body.handles);

  //check if the user liked it already
  const selectHandles = await knex("users")
    .select("handle")
    .whereLike('handle', `%${req.body.handles}%`)
    .limit(5);

  console.log(selectHandles);

  res.send({
    handles: selectHandles,
  });
};

exports.findUsers = findUsers;
