import { Server, Socket } from 'socket.io';
import { createMessage } from './Chat';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { SECRET_KEY } from '../index';

interface AuthenticatedSocket extends Socket {
  data: {
    user?: string;
  };
}

type User = {
  _id: string;
};

export const initializeSocket = (io: Server) => {
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log('USER CONNECTED');
    // Listen for new messages
    // socket.on('setup', (userData) => {
    //   console.log('USER CONNECTED', userData);
    //   // socket.join(userData._id);
    //   socket.emit('connected');
    // });
    socket.on('joinRoom', (roomName) => {
      socket.join(roomName);
      console.log(`User ${socket.id} joined room: ${roomName}`);

      // ส่งข้อความไปยังห้องที่ผู้ใช้อยู่
      io.to(roomName).emit(
        'new-message',
        `User ${socket.id} has joined the room: ${roomName}`
      );
    });

    // เมื่อผู้ใช้ส่งข้อความในห้อง
    socket.on('sendMessageToRoom', ({ roomName, userName, message }) => {
      console.log(`Message from ${userName} in ${roomName}: ${message}`);

      // ส่งข้อความถึงทุกคนในห้อง
      console.log(roomName, 'roomName');
      io.to(roomName).emit('new-message', 'testform tojoin');
      // socket.emit('new-message', 'back form server');
    });
    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('sent-message', (newMessageRecieved) => {
      console.log('newMessageRecieved', newMessageRecieved);
      socket.emit('new-message', 'back form server');
    });

    socket.off('setup', (userData) => {
      console.log('USER DISCONNECTED');
      socket.leave(userData._id);
    });
  });
};
