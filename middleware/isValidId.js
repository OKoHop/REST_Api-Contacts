const { isValidObjectId } = require("mongoose");

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    res.status(404).send({
      message: `${contactId} is not valid Id`,
    });
  }
  next();
};

module.exports = isValidId;
