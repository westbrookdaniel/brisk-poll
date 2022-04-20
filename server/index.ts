import path from "path";
import express from "express";
import { createServer } from "http";
import type { Socket } from "socket.io";
import { Server } from "socket.io";
import compression from "compression";
import morgan from "morgan";
import fs from "fs";
import { createRequestHandler } from "@remix-run/express";

// Socket.io handlers
import onVote from "./onVote";

const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "../");

if (!fs.existsSync(BUILD_DIR)) {
  console.warn(
    "Build directory doesn't exist. You can use `npm run dev` to start the server, or run `npm run build` and try again."
  );
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

export type SocketHandler = (socket: Socket, io: Server) => void;

io.on("connection", (socket) => {
  // Log when a client connects
  console.log(socket.id, "connected");

  // Used to check that the client has connected
  socket.emit("confirmation", "connected!");

  // Call other handlers
  onVote(socket, io);
});

app.use(compression());

// You may want to be more aggressive with this caching
app.use(express.static("public", { maxAge: "1h" }));

// Remix fingerprints its assets so we can cache forever
app.use(express.static("public/build", { immutable: true, maxAge: "1y" }));

app.use(morgan("tiny"));
app.all(
  "*",
  MODE === "production"
    ? createRequestHandler({ build: require("../") })
    : (req, res, next) => {
        purgeRequireCache();
        const build = require("../");
        return createRequestHandler({ build, mode: MODE })(req, res, next);
      }
);

const port = process.env.PORT || 3000;

// We need to listen on the HTTP server instead of the Express app
httpServer.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

function purgeRequireCache() {
  // Purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
