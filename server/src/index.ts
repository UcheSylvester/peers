import express from 'express';
import {Server} from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

const app = express();
app.use(cors())
const port = 8080
const httpServer = createServer(app);

const io = new Server(httpServer, {
  path: '/webrtc',
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const webRTCNamespace = io.of('/webRTCPeers')
  
webRTCNamespace.on('connection', (socket) => {
  console.log('a user connected', {id: socket.id});

  socket.emit('connection-success', {
    status: 'connection-success',
    socketId: socket.id
  })

  socket.on('sdp', data => {
    console.log({data})
    socket.broadcast.emit('sdp', data)
  })

  socket.on('icecandidate', data => {
    console.log({data})
    socket.broadcast.emit('icecandidate', data)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected', {id: socket.id});
  });

});



httpServer.listen(port, () => console.log(`Example app listening on port ${port}!`))

