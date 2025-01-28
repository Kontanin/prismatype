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
  let l = 1;
  console.log('USER CONNECTEDcout', l);
  io.on('connection', (socket: AuthenticatedSocket) => {
    l++;
    console.log('USER CONNECTED', l);
    // Listen for new messages
    // socket.on('setup', (userData) => {
    //   console.log('USER CONNECTED', userData);
    //   // socket.join(userData._id);
    //   socket.emit('connected');
    // });
    socket.on('joinRoom', (roomName) => {
      socket.join(roomName);
      console.log(`User ${socket.id} joined room: ${roomName}`);
    });

    // เมื่อผู้ใช้ส่งข้อความในห้อง
    socket.on('sendMessageToRoom', ({ roomName, message }) => {
      console.log(`Message from  in ${roomName}: ${message}`);
      io.to(roomName).emit('new-message', message);
    });

    // socket.off('setup', (userData) => {
    //   console.log('USER DISCONNECTED');
    //   socket.leave(userData._id);
    // });
  });
};
