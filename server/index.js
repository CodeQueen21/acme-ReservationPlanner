const { client, createTables } = require("./db");

const init = async () => {
  await client.connect();
  console.log("connected to database");
};

init();
