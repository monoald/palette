import type { Config } from "drizzle-kit"

export default {
  schema: "./src/db/schemas",
  driver: "turso",
  dbCredentials: {
//    url: process.env.DATABASE_URL!,
    url: "http://127.0.0.1:8080",
//    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  out: "./drizzle",
} satisfies Config
