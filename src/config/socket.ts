import { Server, Socket } from 'socket.io';

export const initSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    // Handle incoming chat messages
    socket.on('chatMessage', (msg: string) => {
      // Broadcast the message to all connected clients
      io.emit('chatMessage', msg);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
};
