import { VideoPlayer } from "@/components/VideoPlayer"
import { StreamType } from "@/types"
import {  Group, Stack } from "@mantine/core"
import { ActionBar, PeerConnectionsProvider, usePeerConnectionsContext } from "../containers"
import { AppLayout } from "@/features/App"
import { useMemo } from "react"

export interface ConferencePageProps { }

export const ConferencePage = () => {
  return (
    <PeerConnectionsProvider>
      <AppLayout>
        <ConferencePageContent />
      </AppLayout>
    </PeerConnectionsProvider>
  )
}

const ConferencePageContent = () => {
  const {streams} = usePeerConnectionsContext()

  const VideoAspectRatio = useMemo(() => streams?.remote ? 16 / 14 : 16 / 7.5, [streams?.remote])

  return (
    <Stack mt={20} spacing={40}>

    <Group noWrap>
      <VideoPlayer ratio={VideoAspectRatio} stream={streams?.local} streamType={StreamType.LOCAL} />
      { streams?.remote && (
        <VideoPlayer ratio={VideoAspectRatio} stream={streams?.remote} streamType={StreamType.REMOTE} />
      )}
    </Group>

    <ActionBar />

  </Stack>
  )
}