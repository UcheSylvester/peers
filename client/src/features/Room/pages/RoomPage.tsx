import { VideoPlayer } from "@/components/VideoPlayer"
import { StreamType } from "@/types"
import {  Group, Stack, Title } from "@mantine/core"
import { ActionBar, PeerConnectionsProvider, usePeerConnectionsContext } from "../containers"
import { AppLayout } from "@/features/App"
import { useMemo } from "react"

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

  const {streams, status} = usePeerConnectionsContext()

  const VideoAspectRatio = useMemo(() => streams?.remote ? 16 / 14 : 16 / 7.5, [streams?.remote])

  return (
    <Stack spacing={40}>

    <Group noWrap>
      <VideoPlayer ratio={VideoAspectRatio} stream={streams?.local} streamType={StreamType.LOCAL} />
      <VideoPlayer ratio={VideoAspectRatio} stream={streams?.remote} streamType={StreamType.REMOTE} />
    </Group>

    <ActionBar />

    {/* <Group>
      {renderButtons()}
    </Group> */}

    <Title order={4}>{status}</Title>

  </Stack>
  )
}