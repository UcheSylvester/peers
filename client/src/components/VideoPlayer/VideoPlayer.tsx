import { StreamType } from "@/types";
import { AspectRatio, Box, BoxProps, Stack, createStyles } from "@mantine/core"
import { useEffect, useRef } from "react"

interface VideoPlayerProps extends BoxProps {
  stream: MediaStream | undefined;
  streamType: StreamType,
  ratio: number,
}


export const VideoPlayer = ({ stream, streamType, ratio, className,...otherProps }: VideoPlayerProps) => {
  const ref = useRef<HTMLVideoElement>(null)
  const {classes, cx} = useStyles()

  useEffect(() => {
    if(ref.current && stream) {
      ref.current.srcObject = stream 
    }
  }, [stream])

  return (
    <Stack className={classes.root}>
      {/* <Text className={classes.name}>{streamType}</Text> */}
      <AspectRatio ratio={ratio}>
        <Box 
          className={cx(classes.video, streamType === StreamType.LOCAL ? classes.local : classes.remote,  className)} 
          ref={ref} 
          component="video" 
          autoPlay 
          muted 
          {...otherProps}
        />
      </AspectRatio>
    </Stack>
  )
}

const useStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    borderRadius: 10,
    position: 'relative',
  },
  name: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    padding: 10,
    color: 'white',
    background: 'rgba(0,0,0,0.5)',
    borderRadius: '10px 0 10px 0',
  },
  video: {
    // objectFit: 'cover',
    transform: 'rotateY(180deg)',
    borderRadius: 10,
    boxShadow: theme.shadows.sm,
    // height: '80vh'
  },
  local: {
  },
  remote: {
  }
}))