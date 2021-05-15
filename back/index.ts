import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import { createMessage, formatUrl } from './utils';

const app = express();
app.use(cors());
app.use(express.json());

const server: http.Server = http.createServer(app);

const io: Server = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,
  },
});

const rooms: Record<string, { message: string; timestamp: string }> = {};
const connections: Record<string, string> = {};

io.on('connection', (socket) => {
  if (!socket.handshake.headers.origin) {
    // high chance it's a script kiddie
    socket.disconnect();
    return;
  }

  console.info(`Socket count: ${Object.keys(connections).length}`);

  socket.on('newConnection', (roomId: string) => {
    if (roomId in rooms) {
      if (socket.id in connections) {
        // remove from previous room
        socket.leave(connections[socket.id]);
      }
      socket.join(roomId);
      connections[socket.id] = roomId;

      // sync current message
      socket.emit('message', rooms[roomId]);
    } else {
      console.log(rooms, roomId, roomId in rooms);
      console.log('Invalid room code');
      socket.emit('message', createMessage('You seem to be lost. Re-check your pass code.'));
    }
  });

  socket.on('newMessage', ({ roomId, message }) => {
    if (roomId in rooms) {
      // Update latest message
      rooms[roomId] = createMessage(message);
      io.to(roomId).emit('message', message);
    } else {
      socket.emit('message', createMessage('You seem to be lost. Re-check your pass code.'));
      socket.disconnect();
    }
  });

  socket.once('disconnect', () => {
    if (socket.id in connections) {
      // remove from previous room
      socket.leave(connections[socket.id]);
    }
  });
});

setInterval(() => {
  Object.entries(rooms).forEach(([key, value]) => {
    const date = new Date(value.timestamp);

    // Delete rooms that have been idle for over 3 days
    if (Date.now() - date.getTime() > 1000 * 60 * 60 * 24 * 3) {
      delete rooms[key];
    }
  });
});

const PORT = Number(process.env.PORT) || 8000;

io.listen(PORT);

// ROUTES

app.get('/', (req, res) => res.send('Hello world!'));

app.post('/create', (req, res) => {
  if (req.body.roomId in rooms) {
    return res.status(400).json({ message: 'Chat name taken', code: 400 });
  }
  const roomId = req.body.roomId ? formatUrl(req.body.roomId) : uuidv4();
  rooms[roomId] = createMessage('Hello');

  console.log(`Created new chat: ${roomId}`);
  res.json({ roomId });
});

app.listen(PORT + 1, () => {
  console.info(`WebSocket is listening on port ${PORT}!`);
  console.info(`App is listening on port ${PORT + 1}!`);
});
