const http = require("http");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Assignment</title></head>");
    res.write("<body>");
    res.write("<h1>Welcome, Welcome, Welcome!</h1>");
    res.write(
      "<form action='/create-user' method='POST'><input type='text' name='username' /><button>Create New User</button></form>",
    );
    res.write("</body></html>");
    return res.end();
  }

  if (url === "/users") {
    res.setHeader("Content-Type", "text/html");
    res.write(
      "<html><body><ul><li>User 1</li><li>User 2</li></ul></body></html>",
    );
    return res.end();
  }

  if (url === "/create-user" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split("=")[1];
      console.log("New User Created: " + username);

      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }

  res.end();
});

server.listen(5000, () => {
  console.log("Listening on 5000...");
});
