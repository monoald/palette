const express = require("express");
const cors = require("cors");

const { boomErrorHandler, errorHandler } = require("./_middlewares/error");
const {
  findAll,
  downloadFonts,
  save,
  findOne,
  unsave,
  update,
  downloadFontsFromSaved,
  downloadIcons,
} = require("./_fonticons/controller");
const { tokenDecoderHandler } = require("./_middlewares/tokenDecoder");

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", findAll);

app.get("/:name", tokenDecoderHandler, findOne);

app.post("/save", tokenDecoderHandler, save);

app.post("/unsave", tokenDecoderHandler, unsave);

app.patch("/:id", tokenDecoderHandler, update);

app.post("/download-fonts", downloadFonts);

app.get("/download-fonts-saved/:id", downloadFontsFromSaved);

app.get("/download-icons/:id", downloadIcons);

app.use(boomErrorHandler);
app.use(errorHandler);

module.exports = app;
