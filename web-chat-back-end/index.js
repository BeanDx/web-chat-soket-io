import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  // options
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware для обработки CORS (если вы все равно решите его использовать)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit('message', 'Hello, client!');

  // Обработчик для нового сообщения от клиента
  socket.on('sendMessage', (newMessage) => {
    console.log('Received message from client:', newMessage);

    io.emit('message', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

httpServer.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
