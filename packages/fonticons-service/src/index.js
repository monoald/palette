const express = require("express");

const { PORT } = require("./config");
const { boomErrorHandler, errorHandler } = require("./middlewares/error");

const fonticonsRouter = require("./fonticons/router");

const app = express();

app.set("port", PORT);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const router = express.Router();
app.use("/api/v1", router);
router.use("/", fonticonsRouter);

app.use(boomErrorHandler);
app.use(errorHandler);

module.exports = { app };
