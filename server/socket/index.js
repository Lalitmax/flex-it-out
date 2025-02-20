export const socketHandlers = (io) => {
  io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("disconnect", () => {
          console.log("User disconnected:", socket.id);
      });

      // Handle chat messages
      socket.on("message", (data) => {
          io.to(data.room).emit("message", data);
      });

      // Handle joining rooms
      socket.on("join_room", (room) => {
          socket.join(room);
          console.log(`User ${socket.id} joined room: ${room}`);
      });

      // Handle leaving rooms
      socket.on("leave_room", (room) => {
          socket.leave(room);
          console.log(`User ${socket.id} left room: ${room}`);
      });

      // Sync reps count across users
      socket.on("doing", (data) => {
          io.to(data.room).emit("update_reps", data);
      });

      // Start Gym session
      socket.on("startGym", (room) => {
          io.to(room).emit("session_started");
      });

      // End Gym session
      socket.on("endGym", (room) => {
          io.to(room).emit("session_ended");
      });

      // Set reps limit for all users in the room
      socket.on("setLimit", (data) => {
          io.to(data.room).emit("limit_updated", data);
      });

      // Declare winner
      socket.on("winner", (data) => {
          io.to(data.room).emit("winner_declared", data);
      });
  });
};
