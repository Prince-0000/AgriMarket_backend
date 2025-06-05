const app = require("./app");
require("dotenv").config();
const http = require("http");
const { initSocket } = require("./utils/socket");

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

