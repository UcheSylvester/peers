import { io } from "socket.io-client";

const Socket = io('http://localhost:8080/webRTCPeers', {
  path: '/webrtc'
})

export default Socket;