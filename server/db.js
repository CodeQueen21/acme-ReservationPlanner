const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_reservations_db"
);

const createTables = async () => {
  const SQL = `
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS restaurants;

CREATE TABLE customers(
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE restaurants(
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE reservations(
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) NOT NULL,
    restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
    date DATE NOT NULL,
    party_count INTEGER NOT NULL
    
);
`;
  await client.query(SQL);
};

const createCustomer = async (name) => {
  const SQL = `
    INSERT INTO customers(id, name) Values($1, $2) RETURNING *
    `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const createRestaurant = async (name) => {
  const SQL = `
    INSERT INTO restaurants(id, name) VALUES($1, $2) RETURNING *
    `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const createReservation = async ({
  date,
  customer_id,
  restaurant_id,
  party_count,
}) => {
  const SQL = `
    INSERT INTO reservations(id, date, customer_id, restaurant_id, party_count) VALUES($1, $2, $3, $4, $5) RETURNING *
    `;
  const response = await client.query(SQL, [
    uuid.v4(),
    date,
    customer_id,
    restaurant_id,
    party_count,
  ]);
  return response.rows[0];
};

const fetchCustomers = async () => {
  const SQL = `
    SELECT * FROM customers
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchRestaurants = async () => {
  const SQL = `
      SELECT * FROM restaurants
      `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchReservations = async () => {
  const SQL = `
    SELECT * FROM reservations;
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const destroyReservation = async (id) => {
  const SQL = `
DELETE FROM reservations WHERE id = $1;
`;
  const response = await client.query(SQL, [id]);
  return response.rows;
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  destroyReservation,
};
