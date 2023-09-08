import express from 'express';
import {Server} from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()

const app = express();
app.use(cors())
const port = process.env.PORT || 8080;
const httpServer = createServer(app);

const io = new Server(httpServer, {
  path: '/webrtc',
  cors: {
    origin: process.env.FRONTEND_BASE_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const webRTCNamespace = io.of('/webRTCPeers')
  
webRTCNamespace.on('connection', (socket) => {
  console.log(`a user connected ${socket.id}`, {X: process.env.FRONTEND_BASE_URL});
  // TODO: save this socket id to the user in a database

  socket.emit('connection-success', {
    status: 'connection-success',
    socketId: socket.id
  })

  socket.on('sdp', data => {
    socket.broadcast.emit('sdp', data)
  })

  socket.on('icecandidate', data => {
    socket.broadcast.emit('icecandidate', data)
  })

  socket.on('end-call', data => {
    socket.broadcast.emit('end-call', data)
  })

  socket.on('disconnect', () => {
    console.log(`user disconnected ${socket.id}`);
    socket.broadcast.emit('user-disconnected', {socketId: socket.id})
  });
});



httpServer.listen(port, () => console.log(`Example app listening on port ${port}!`))

