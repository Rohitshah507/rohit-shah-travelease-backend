import { Server } from "socket.io";

let io;
const userSocketMap = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
    }

    socket.on("disconnect", () => {
      userSocketMap.delete(userId);
    });
  });
};

export { io, userSocketMap };