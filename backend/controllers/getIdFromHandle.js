const getIdFromHandle = async (knex, handle) => {
  try {
    const selectHandle = await knex("users")
      .where({ handle: handle })
      .select("id");
    return selectHandle[0];
  } catch (e) {
    console.log(e);
  }
};

exports.getIdFromHandle = getIdFromHandle;
