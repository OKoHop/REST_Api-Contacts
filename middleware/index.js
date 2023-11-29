const isValidId = require("./isValidId");
const validateBody = require("./validateBody");
const validateToken = require("./isTokenValid");
const upload = require("./uploadAvatar");

module.exports = {
  isValidId,
  validateBody,
  validateToken,
  upload,
};
