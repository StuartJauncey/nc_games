const express = require("express");
const apiRouter = require("./routes/api.router");
const { handlePSQLErrors, handle500Errors, handleCustomErrors } = require("./controllers/errors.controllers");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
});

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500Errors);

module.exports = app;
