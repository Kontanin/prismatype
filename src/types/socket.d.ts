import { Socket } from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    user?: {
      id: string;
      name: string;
      // Add other properties as needed
    };
  }
}
