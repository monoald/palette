const express = require("express");
const cors = require("cors");

const { CLIENT_URI, PORT } = require("./config");
const { boomErrorHandler, errorHandler } = require("./middlewares/error");

const fonticonsRouter = require("./fonticons/router");

const app = express();

app.set("port", PORT);

const allowedOrigins = [CLIENT_URI];
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const router = express.Router();
app.use("/api/v1", router);
router.use("/", fonticonsRouter);

app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server on port: " + PORT);
});
