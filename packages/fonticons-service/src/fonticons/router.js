const { tokenDecoderHandler } = require("../middlewares/tokenDecoder");

const { Router } = require("express");
const {
  findAll,
  findOne,
  save,
  unsave,
  update,
  downloadFonts,
  downloadFontsFromSaved,
  downloadIcons,
} = require("./controller");

const router = Router();

router.get("/", findAll);

router.get("/:name", tokenDecoderHandler, findOne);

router.post("/save", tokenDecoderHandler, save);

router.post("/unsave", tokenDecoderHandler, unsave);

router.patch("/:id", tokenDecoderHandler, update);

router.post("/download-fonts", downloadFonts);

router.get("/download-fonts-saved/:id", downloadFontsFromSaved);

router.get("/download-icons/:id", downloadIcons);

module.exports = router;
