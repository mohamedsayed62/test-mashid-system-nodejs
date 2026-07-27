const dns = require("node:dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

dns.resolveSrv(
  "_mongodb._tcp.cluster0.wkdtgsn.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.error("DNS Error:", err);
      return;
    }

    console.log("MongoDB SRV records:");
    console.log(addresses);
  }
);