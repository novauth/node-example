/* eslint-disable no-fallthrough */

import "./init.js";
/**
 * Module dependencies.
 */
import app from "./app.js";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";

/* Create HTTP server. */
const server = http.createServer(app);

const io = new Server(server);

io.on("connection", async (socket) => {
  // socket is connected
  socket.data = {};
  // join a private room identified by the username
  socket.on("join", async (username) => {
    console.log("user disconnected");
    await socket.join(username);
  });
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

/* Get port from environment and store in Express. */
const port = normalizePort(
  process.env.PORT ?? process.env.SERVER_PORT ?? "5000"
);
app.set("port", port);

/**
 * Server initialization function
 */
async function main(): Promise<void> {
  try {
    /* connect to mongo */
    console.log("Connecting to MongoDB...");
    await mongoose.connect(String(process.env.DB_URL));

    /* Listen on provided port, on all network interfaces. */
    console.log("Starting the web server...");
    server.on("error", onError);
    server.on("listening", onListening);
    server.listen(port, () => {
      console.log(`Web server started at ${port}`);
    });
  } catch (error) {
    console.error("An error occurred during initialization!");
    console.error(error);
  }
}

/*
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string): any {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return 0;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any): void {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind =
    typeof port === "string"
      ? `Pipe ${port}`
      : typeof port === "number"
      ? `Port ${port.toString()}`
      : "";

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  const addr = server.address();
  if (addr != null) {
    const bind =
      typeof addr === "string" ? `Pipe ${addr}` : `Port ${addr.port}`;
    console.log(`Listening on ${bind}`);
  }
}

/* just call the server init function and ignore the returned promise */
main().finally(() => {});

export { io };
