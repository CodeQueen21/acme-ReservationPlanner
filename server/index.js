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
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  destroyReservation,
} = require("./db");

app.get("/api/customers", async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (err) {
    next(err);
  }
});

app.get("/api/restaurants", async (req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch (err) {
    next(err);
  }
});

app.get("/api/reservations", async (req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch (err) {
    next(err);
  }
});

app.post("/api/customers/:id/reservations", async (req, res, next) => {
  try {
    res.status(201).send(await createReservation(req.body));
  } catch (err) {
    next(err);
  }
});

app.post(
  "/api/customers/:customer_id/reservations/:id ",
  async (req, res, next) => {
    try {
      await destroyReservation(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

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
  console.log(`Lisa's id is ${Lisa.id}`);

  await Promise.all([
    createReservation({
      date: "07/25/2024",
      customer_id: Lisa.id,
      restaurant_id: Chipotle.id,
      party_count: 5,
    }),
    createReservation({
      date: "10/11/2024",
      customer_id: Brad.id,
      restaurant_id: SteakHouse.id,
      party_count: 8,
    }),
    createReservation({
      date: "05/03/2024",
      customer_id: Carol.id,
      restaurant_id: Pizza_Hut.id,
      party_count: 2,
    }),
    createReservation({
      date: "05/01/2024",
      customer_id: James.id,
      restaurant_id: Olive_Garden.id,
      party_count: 4,
    }),
  ]);
  const reservations = await fetchReservations();
  console.log(reservations);
  await destroyReservation(reservations[0].id);
  console.log(await fetchReservations());
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
