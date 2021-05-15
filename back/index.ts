import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server: http.Server = http.createServer(app);

const io: Server = require("socket.io")(server, {
  cors: {
    origin: "*:*",
    methods: ["GET", "POST"],
    credentials: false
  }
});

const rooms: Record<string, { message: string, timestamp: string }> = {}

let connections = 0;
const addConnections = () => connections += 1;
const removeConnections = () => connections -= 1;

io.on('connection', (socket) => {
  if (!socket.handshake.headers.origin) {
    // high chance it's a script kiddie
    socket.disconnect();
    return;
  }

  addConnections();
  console.info(`Socket count: ${connections}`);

  socket.on('newConnection', (roomId: string) => {
    if (roomId in rooms) {
      socket.join(roomId);
      socket.emit('message', rooms[roomId])
    } else {
      socket.emit('error', "No room found");
      socket.disconnect();
    }
  })
  
  socket.on('newMessage', ({ roomId, message }) => {
    if (roomId in rooms) {
      // Update latest message
      rooms[roomId] = { message, timestamp: new Date().toISOString() };
      io.to(roomId).emit('message', message)
    } else {
      socket.emit('error', "No room found");
      socket.disconnect();
    }
  })

  socket.once('disconnect', () => {
    removeConnections();
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
})

const PORT = Number(process.env.PORT) || 8000;

io.listen(PORT);

// ROUTES
  
app.get('/', (req, res) => res.send('Hello world!'));

app.post('/create', (req, res) => {
  const roomId = req.body.roomId || uuidv4();
  rooms[roomId] = { message: "Hello", timestamp: new Date().toISOString() };

  res.redirect(`/admin/${roomId}`)
});

app.listen(PORT + 1, () => {
  console.info(`WebSocket is listening on port ${PORT}!`);
  console.info(`App is listening on port ${PORT + 1}!`);
});