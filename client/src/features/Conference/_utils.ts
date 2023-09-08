import Socket from "@/lib/socket-io"
import { User } from "@/types"

export const processSDP = async (peerConnection: RTCPeerConnection | null, sdp?: RTCSessionDescriptionInit) => {
  if(!sdp) return
  console.log({sdp})
  await peerConnection?.setLocalDescription(sdp)

  // send sdp to server
  sendToPeer('sdp', { sdp })
}

export const sendToPeer = (eventType: string, payload: unknown) => {
  Socket.emit(eventType, payload)
}

export const addPeer = (incomingPeer: User, peers: User[]) => {

  const isPeerExisting = peers.some(peer => peer.id === incomingPeer.id)

  // if peer is already exist, then ignore
  if(isPeerExisting) return peers

  // add peer to peers array
  return [...peers, incomingPeer]
}