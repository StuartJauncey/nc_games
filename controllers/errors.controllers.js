exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
}

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02" ) {
    res.status(400).send({ msg: "Invalid request" });
  }
  if (err.code === "42703" || err.code === "42P10" ) {
    res.status(400).send({ msg: "Invalid query" });
  }
  if (err.code === "23503") {
    res.status(400).send({ msg: "Invalid user" })
  }
  else {
    next(err);
  }
}

exports.handle500Errors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
}