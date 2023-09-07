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

  socket.on('disconnect', () => {
    console.log('user disconnected', {id: socket.id});
  });
});

// io.on('connection', (socket) => {
//   console.log('a user connected', {id: socket.id});
  

//   // socket.on('disconnect', () => {
//   //   console.log('user disconnected', {socket});
//   // });
// });


httpServer.listen(port, () => console.log(`Example app listening on port ${port}!`))

