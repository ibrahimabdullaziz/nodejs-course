const net = require("net");
const hosts = [
  "ac-s4ktlf9-shard-00-00.iqqljmr.mongodb.net",
  "ac-s4ktlf9-shard-00-01.iqqljmr.mongodb.net",
  "ac-s4ktlf9-shard-00-02.iqqljmr.mongodb.net",
];

(async () => {
  for (const host of hosts) {
    await new Promise((resolve) => {
      const socket = net.createConnection(27017, host);
      let done = false;
      const finish = (ok, msg) => {
        if (done) return;
        done = true;
        console.log(host, ok ? "OK" : "FAIL", msg);
        socket.end();
        resolve();
      };
      socket.once("connect", () => finish(true, "connected"));
      socket.once("error", (err) => finish(false, err.message));
      socket.setTimeout(5000, () => finish(false, "timeout"));
    });
  }
})();
