const { createClient } = require("@libsql/client");
const { drizzle } = require("drizzle-orm/libsql");
const users = require("./users/schema");
const fonticons = require("./fonticons/schema");
const icons = require("./icons/schema");

const client = createClient({
  // url: c.env.TURSO_DATABASE_URL,
  // authToken: c.env.TURSO_AUTH_TOKEN,
  // encryptionKey: c.env.ENCRYPTION_KEY,
  url: "http://127.0.0.1:8080",
});

const db = drizzle(client, {
  schema: { ...users, ...fonticons, ...icons },
});

module.exports = { db };
