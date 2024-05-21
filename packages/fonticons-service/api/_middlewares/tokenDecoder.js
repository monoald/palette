const jwt = require("jsonwebtoken");
const boom = require("@hapi/boom");

const { JWT_SECRET } = require("../_config");

async function tokenDecoderHandler(req, res, next) {
  const authorization = req.get("authorization");
  let token = null;

  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    token = authorization.split(" ")[1];
  }

  jwt.verify(token, JWT_SECRET, async function (error, decoded) {
    if (error) {
      next(boom.unauthorized("Missing or invalid token."));
      return;
    }

    const { id } = decoded;

    req.userId = id;
    next();
  });
}

module.exports = { tokenDecoderHandler };
