import { StreamType } from "@/types";
import { Box, BoxProps, createStyles } from "@mantine/core"
import { useEffect, useRef } from "react"




interface VideoPlayerProps extends BoxProps {
  stream: MediaStream | undefined;
  streamType: StreamType
}

export const VideoPlayer = ({stream, streamType, className,...otherProps}: VideoPlayerProps) => {
  const ref = useRef<HTMLVideoElement>(null)
  const {classes, cx} = useStyles()

  useEffect(() => {
    if(ref.current && stream) {
      ref.current.srcObject = stream 
    }
  }, [stream])
  return (

    <Box className={cx(classes.video, streamType === StreamType.LOCAL ? classes.local : classes.remote,  className)} ref={ref} component="video" autoPlay {...otherProps}  />
  )
}

const useStyles = createStyles(() => ({
  video: {
    border: '1px solid red',
    height: 300,
    width: 500,
    objectFit: 'cover',
    transform: 'rotateY(180deg)'
  },
  local: {
    border: '1px solid green'
  },
  remote: {
    border: '1px solid blue'
  }
}))