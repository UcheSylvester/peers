export interface User {
  id: string
  name: string
}

export enum StreamType {
  LOCAL = 'local',
  REMOTE = 'remote'
}

export interface Streams {
  local: MediaStream | undefined
  remote: MediaStream | undefined
}

export interface Option {
  label: string
  value: string
}