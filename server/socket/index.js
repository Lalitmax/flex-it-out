export const socketHandlers = (io) => {
    const roomsName = new Map(); // Map to store room -> list of connected socket IDs

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Handle joining a room
        socket.on("join_room", (room) => {
            socket.join(room);

            if (!roomsName.has(room)) {
                roomsName.set(room, []);
            }

            if (!roomsName.get(room).includes(socket.id)) {
                roomsName.get(room).push(socket.id);
            }

            console.log(`User ${socket.id} joined room: ${room}`);
        });

        // Handle leaving a room
        socket.on("leave_room", (room) => {
            socket.leave(room);

            if (roomsName.has(room)) {
                const updatedUsers = roomsName.get(room).filter(id => id !== socket.id);
                roomsName.set(room, updatedUsers);

                if (updatedUsers.length === 0) {
                    roomsName.delete(room); // Remove empty room
                }
            }

            console.log(`User ${socket.id} left room: ${room}`);
        });

        // Handle "doing" event - send reps update to users in the same room
        socket.on("doing", (data) => {
            const room = data.room;
            if (roomsName.has(room)) {
                roomsName.get(room).forEach(socketId => {
                    io.to(socketId).emit("doing", data);
                });
                console.log(`Reps updated for room ${room}:`, data);
            }
        });

        // Start Gym session - notify users in the room
        socket.on("startGym", (room) => {
            if (roomsName.has(room)) {
                roomsName.get(room).forEach(socketId => {
                    io.to(socketId).emit("startGym");
                });
                console.log(`Gym session started in room ${room}`);
            }
        });

        // End Gym session - notify users in the room
        socket.on("endGym", (room) => {
            if (roomsName.has(room)) {
                roomsName.get(room).forEach(socketId => {
                    io.to(socketId).emit("endGym");
                });
                console.log(`Gym session ended in room ${room}`);
            }
        });

        // Set reps limit for all users in the room
        socket.on("startTimer", (data) => {
            const room = data.room;
            if (roomsName.has(room)) {
                roomsName.get(room).forEach(socketId => {
                    io.to(socketId).emit("startTimer", data);
                });
                console.log(`Reps limit updated for room ${room}:`, data);
            }
        });

        // Declare winner in the room
        socket.on("winner", (data) => {
            const room = data.room;
            if (roomsName.has(room)) {
                roomsName.get(room).forEach(socketId => {
                    io.to(socketId).emit("winner", data);
                });
                console.log(`Winner declared in room ${room}:`, data);
            }
        });

        // Handle user disconnection
        socket.on("disconnect", () => {
            for (const [room, users] of roomsName.entries()) {
                if (users.includes(socket.id)) {
                    roomsName.set(room, users.filter(id => id !== socket.id));

                    if (roomsName.get(room).length === 0) {
                        roomsName.delete(room);
                    }

                    console.log(`User ${socket.id} disconnected from room: ${room}`);
                    break;
                }
            }
            console.log("User disconnected:", socket.id);
        });
    });

};
