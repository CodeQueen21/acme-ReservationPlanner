const express = require("express");
const app = express();
app.use(require("morgan")("dev"));
app.use(express.json());
const port = 3000;

const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
} = require("./db");

const init = async () => {
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");
  const [
    Lisa,
    Brad,
    James,
    Carol,
    Olive_Garden,
    Pizza_Hut,
    Chipotle,
    SteakHouse,
  ] = await Promise.all([
    createCustomer("Lisa"),
    createCustomer("Brad"),
    createCustomer("James"),
    createCustomer("Carol"),
    createRestaurant("Olive_Garden"),
    createRestaurant("Pizza_Hut"),
    createRestaurant("Chipotle"),
    createRestaurant("SteakHouse"),
  ]);
  console.log(await fetchCustomers());
  console.log(await fetchRestaurants());
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
