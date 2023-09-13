const express = require("express");
const dns = require("dns");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// const limiter = rateLimit({
//   windowMs: 10 * 1000,
//   max: 1,
//   message: "Too many requests, please try again after 10 seconds.",
// });

// app.use("/cname", limiter);

const recursiveResolveCname = (domain, callback) => {
  dns.resolveCname(domain, (err, addresses) => {
    if (err) {
      if (err.code === "ENODATA") {
        return callback(null, domain);
      }
      return callback(err, null);
    }

    if (addresses && addresses.length > 0) {
      return recursiveResolveCname(addresses[0], callback);
    }

    callback(null, domain);
  });
};

app.get("/resolve", (req, res) => {
  const domain = req.query.domain;

  if (!domain) {
    return res
      .status(400)
      .send({ error: "Please provide a domain parameter." });
  }

  recursiveResolveCname(domain, (err, finalCname) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }

    if (finalCname) {
      res.send({ domain, cname: finalCname });
    } else {
      res.status(404).send({ error: "CNAME not found for the given domain." });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
