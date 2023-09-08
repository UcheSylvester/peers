export interface User {
  // id: string
  name: string
  socketId: string
}

export enum StreamType {
  LOCAL = 'local',
  REMOTE = 'remote'
}

export interface Streams {
  local: MediaStream | undefined
  remote: MediaStream | undefined
}