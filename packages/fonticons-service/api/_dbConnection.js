const { createClient } = require("@libsql/client");
const { drizzle } = require("drizzle-orm/libsql");
const users = require("./_users/schema");
const fonticons = require("./_fonticons/schema");
const icons = require("./_icons/schema");

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client, {
  schema: { ...users, ...fonticons, ...icons },
});

module.exports = { db };
