import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import router from './routes';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api', router);

const server = app.listen(3003, () => {
  console.log('Server is running on port 3003');
});

// const io = new socket.Server(server, {
//   cors: {
//     origin: '*',
//     credentials: true,
//   },
// });

// io.on('connection', (socket) => {
//   console.log('A user connected');
//   const userChat = new UserChat(socket);
// });
