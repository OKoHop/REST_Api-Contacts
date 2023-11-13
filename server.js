const app = require("./app");
const mongoose = require("mongoose");

const { DB_URI, PORT } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_URI)
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => {
    console.warn(err.message);
    process.exit(1);
  });
