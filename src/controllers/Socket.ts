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
    // Listen for new messages
    socket.on('setup', (userData) => {
      console.log('USER CONNECTED', userData);
      // socket.join(userData._id);
      socket.emit('connected',);
    });
    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));
    socket.on('new message', (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
      if (!chat.users) return console.log('chat.users not defined');
      chat.users.forEach((user: User) => {
        if (user._id == newMessageRecieved.sender._id) return;
        socket.in(user._id).emit('message recieved', newMessageRecieved);
      });
    });

    socket.off('setup', (userData) => {
      console.log('USER DISCONNECTED');
      socket.leave(userData._id);
    });
  });
};
