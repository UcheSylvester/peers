import { io } from "socket.io-client";

const SOCKET_BASE_URL = process.env.NEXT_PUBLIC_SOCKET_IO_BASE_URL

const Socket = io(`${SOCKET_BASE_URL}/webRTCPeers`, {
  path: `/${process.env.NEXT_PUBLIC_SOCKET_IO_PATH}`
})

export default Socket;