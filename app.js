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

const limiter = rateLimit({
  windowMs: 10 * 1000,
  max: 1,
  message: "Too many requests, please try again after 10 seconds.",
});

app.use("/cname", limiter);

app.get("/cname", (req, res) => {
  const domain = req.query.domain;

  if (!domain) {
    return res.status(400).json({ error: "Domain parameter is required." });
  }

  dns.resolveCname(domain, (err, addresses) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ cname: addresses });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
