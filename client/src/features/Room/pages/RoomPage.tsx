import { VideoPlayer } from "@/components/VideoPlayer"
import { StreamType } from "@/types"
import {  Button, Group, Stack, Textarea, Title } from "@mantine/core"
import { PeerConnectionsProvider, usePeerConnectionsContext } from "../containers"
import { AppLayout } from "@/App/containers"

export interface RoomPageProps { }

export const RoomPage = () => {
  return (
    <PeerConnectionsProvider>
      <AppLayout>
        <RoomPageContent />
      </AppLayout>
    </PeerConnectionsProvider>
  )
}

const RoomPageContent = () => {

  const {callVisible, createAnswer, createOffer, answerVisible, streams, textRef, status} = usePeerConnectionsContext()

  const renderButtons = ()=> {
    if(callVisible) {
      return (
        <Button fullWidth={false} onClick={createOffer}>
          Call
        </Button>
      )
    }

    if(answerVisible) {
      return (
        <Button fullWidth={false} onClick={createAnswer}>
          Answer
        </Button>
      )
    }
    return null
  }


  return (
    <Stack>
    <Title>Home</Title>

    <Group>
      <Stack spacing={5}>
        <Title order={3}>Local</Title>
        {/* <Box className={cx(classes.video, classes.caller)} ref={localVideoRef} component="video" autoPlay  /> */}
        <VideoPlayer stream={streams?.local} streamType={StreamType.LOCAL} />
      </Stack>

      <Stack spacing={5}>
        <Title order={3}>Remote</Title>
        {/* <Box className={classes.video} ref={remoteVideoRef} component="video" autoPlay /> */}
        <VideoPlayer stream={streams?.remote} streamType={StreamType.REMOTE} />
      </Stack>

    </Group>

    <Group>
      {renderButtons()}
    </Group>

    <Title order={4}>{status}</Title>

    <Textarea ref={textRef} />
  </Stack>
  )
}