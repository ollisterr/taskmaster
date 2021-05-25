import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import util from 'util';

import { createMessage, formatUrl } from './utils';
import { speak } from './utils/textToSpeech';
import { FILES_PATH } from './utils/config';
import { initFileSystem } from './utils/fileSystem';

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

type Message = { message: string; timestamp: string; file?: string; mute: boolean };

const rooms: Record<string, Message> = {};
const connections: Record<string, string> = {};

io.on('connection', (socket) => {
  if (!socket.handshake.headers.origin) {
    // high chance it's a script kiddie
    socket.disconnect();
    return;
  }

  console.info(`Socket count: ${Object.keys(connections).length + 1}`);

  socket.on('newConnection', async (roomId: string) => {
    if (roomId in rooms) {
      if (socket.id in connections) {
        // remove from previous room
        socket.leave(connections[socket.id]);
      }

      socket.join(roomId);
      connections[socket.id] = roomId;

      const readFile = util.promisify(fs.readFile);

      const file =
        !rooms[roomId].mute && rooms[roomId].file
          ? await readFile(rooms[roomId].file as string)
          : undefined;

      // sync current message
      socket.emit('message', {
        ...rooms[roomId],
        file,
      });
    } else {
      console.log('Invalid Room Code');
      socket.emit('message', createMessage('You seem to be lost. Re-check your pass code.'));
    }
  });

  socket.on('newMessage', async ({ roomId, message }) => {
    if (roomId in rooms) {
      // Update latest message
      const newMessage = createMessage(message);

      let filePath, fileBuffer;
      if (!rooms[roomId].mute) {
        [filePath, fileBuffer] = await speak(message, roomId);
      }

      rooms[roomId] = { ...rooms[roomId], ...newMessage, file: filePath };
      io.to(roomId).emit('message', { ...newMessage, file: fileBuffer });
    }
  });

  socket.on('toggleMute', async ({ roomId, mute }) => {
    if (roomId in rooms) {
      rooms[roomId].mute = mute;
    }
  });

  socket.once('disconnect', () => {
    if (socket.id in connections) {
      // remove from previous room
      socket.leave(connections[socket.id]);
      delete connections[socket.id];
    }
  });
});

// FILE SYSTEM
initFileSystem();

// clean files every 12h
setInterval(() => {
  Object.entries(rooms).forEach(async ([key, value]) => {
    const date = new Date(value.timestamp);

    // Delete rooms that have been idle for over 3 days
    if (Date.now() - date.getTime() > 1000 * 60 * 60 * 24 * 3) {
      delete rooms[key];

      if (rooms[key].file) {
        await fs.unlink(rooms[key].file as string, (err) =>
          console.log('Error deleting file:', err),
        );
      }
    }
  });
}, 1000 * 60 * 60 * 12);

// WEB SOCKET

const PORT = Number(process.env.PORT) || 8000;

io.listen(PORT);

// ROUTES

app.get('/', (_, res) => res.send('Hello world!'));

app.post('/create', (req, res) => {
  if (req.body.roomId in rooms) {
    return res.status(400).json({ message: 'Chat name taken', code: 400 });
  }
  const roomId = req.body.roomId ? formatUrl(req.body.roomId) : uuidv4();
  rooms[roomId] = { ...createMessage('Hello'), mute: false };

  console.log(`Created new chat: ${roomId}`);
  res.json({ roomId });
});

app.listen(PORT + 1, () => {
  console.info(`WebSocket is listening on port ${PORT}!`);
  console.info(`App is listening on port ${PORT + 1}!`);
});
