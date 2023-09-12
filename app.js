const express = require("express");
const dns = require("dns");
const app = express();
const PORT = process.env.PORT || 3000;

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
