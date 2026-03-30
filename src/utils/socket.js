import { Server } from "socket.io";

let io;
const userSocketMap = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://travel-ease-platform.netlify.app",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    const role = socket.handshake.query.role;

    console.log(`User connected: ${userId} | Role: ${role}`);

    if (userId) {
      userSocketMap.set(userId, socket.id);
    }

    socket.on(
      "sendLocation",
      ({ latitude, longitude, username, email, phoneNumber, location }) => {
        const normalizedRole = role?.toLowerCase();

        if (normalizedRole === "guide") {
          console.log(
            `📍 Location from guide ${userId} (${username}): ${latitude}, ${longitude}`,
          );

          // ✅ Forward ALL guide info so admin can display name/phone/email
          io.emit("receiveLocation", {
            userId,
            latitude,
            longitude,
            username,
            email,
            phoneNumber,
            location,
          });
        } else {
          console.warn(
            `⚠️ sendLocation ignored — role "${role}" is not a guide`,
          );
        }
      },
    );

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
      userSocketMap.delete(userId);
    });
  });
};

export { io, userSocketMap };
