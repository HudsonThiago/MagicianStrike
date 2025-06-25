import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import { userController } from './controllers/userController.js';
import { authController } from './controllers/authController.js';
import { gameController } from './controllers/gameController.js';

const app = express();
const server = createServer(app);
const PORT = 3000;

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

app.use('/api/user', userController);
app.use('/api/auth', authController);
app.use('/api/game', gameController);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server);

export default io;