import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import { userController } from './controllers/userController.js';
import { authController } from './controllers/authController.js';

const app = express();
const server = createServer(app);
const PORT = 3000;

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST']
}));

app.use('/api/user', userController);
app.use('/api/auth', authController);

const io = new Server(server);


export default io;

// app.get('/api/user', (req, res)=>{
//   const result = listUser()
//   result.then((data)=>{
//     res.json(data)
//   })
// })
// app.get('/api/user/:id', (req, res)=>{
//   const result = listUserById(req.params.id)
//   result.then((data)=>{
//     res.json(data)
//   })
// })

// app.post('/api/user', (req, res)=>{
//   const result = saveUser(req.body)
//   result.then((data)=>{
//     console.log(data)
//     const user = listUserById(data.lastID)
//     user.then((data)=>{
//     res.status(201).json(data)
//     })
//   })
// })

// app.put('/api/user/:id', (req, res)=>{
//   const result = updateUser(req.params.id, req.body)
//   result.then((data)=>{
//     console.log(data)
//     const user = listUserById(req.params.id)
//     user.then((data)=>{
//     res.status(200).json(data)
//     })
//   })
// })

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});