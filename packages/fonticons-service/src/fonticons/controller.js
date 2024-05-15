const { FonticonService } = require("./service");

const service = new FonticonService();

const findAll = async (req, res) => {
  const fonticons = await service.find();

  return res.json(fonticons);
};

const findOne = async (req, res) => {
  const { userId } = req;
  const { name } = req.params;

  const fonticons = await service.findOne(name, +userId);

  return res.json(fonticons);
};

const save = async (req, res, next) => {
  try {
    const body = req.body;
    const { userId } = req;

    const result = await service.save(body, userId);

    return res.json({ result });
  } catch (error) {
    next(error);
  }
};

const unsave = async (req, res, next) => {
  try {
    const body = req.body;
    const { userId } = req;

    await service.unsave(body.id, userId);

    return res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const body = req.body;
    const { id } = req.params;
    const { userId } = req;

    await service.update(id, userId, body);

    return res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const downloadFonts = async (req, res, next) => {
  try {
    const body = req.body;
    const { file, name } = await service.downloadFonts(body);

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=${name}.zip`,
      "Content-Length": file.length,
    });
    res.send(file);
  } catch (error) {
    next(error);
  }
};

const downloadFontsFromSaved = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { file, name } = await service.downloadFontsFromSaved(id);

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=${name}.zip`,
      "Content-Length": file.length,
    });
    res.send(file);
  } catch (error) {
    next(error);
  }
};

const downloadIcons = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { file, name } = await service.downloadIcons(id);

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=${name}.zip`,
      "Content-Length": file.length,
    });
    res.send(file);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findAll,
  findOne,
  save,
  unsave,
  update,
  downloadFonts,
  downloadFontsFromSaved,
  downloadIcons,
};
