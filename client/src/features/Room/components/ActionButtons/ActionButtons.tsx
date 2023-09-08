import { ActionIcon, Button, Group, createStyles } from "@mantine/core"
import { BsFillMicMuteFill, BsFillMicFill, BsFillCameraVideoFill, BsFillCameraVideoOffFill } from "react-icons/bs"
import { usePeerConnectionsContext } from "../../containers"

export const ActionButtons = () => {
  const {classes} = useStyles()

  const {createOffer, createAnswer, callVisible, answerVisible, endCall, localStreamFeatures, toggleLocalStreamFeatures} = usePeerConnectionsContext()

  const isVideoEnabled = localStreamFeatures.video.enabled
  const isAudioEnabled = localStreamFeatures.audio.enabled

  const getButtonProps = () => {
    if(callVisible) {
      return {
        onClick: createOffer,
        children: 'Start Call'
      }
    }

    if(answerVisible) {
      return {
        onClick: createAnswer,
        children: 'Answer'
      }
    }

    return {
      onClick: endCall,
      children: 'End Call'
    }

  }

  return (
    <Group align="center" position="center" spacing={25} className={classes.root}>
      <ActionIcon variant="light" size={'xl'} radius={'xl'} onClick={() => toggleLocalStreamFeatures('audio')}>
        {
          isAudioEnabled ? <BsFillMicFill size={20} /> : <BsFillMicMuteFill size={20} />
        }
      </ActionIcon>

      <Button className={classes.button} color={'teal'} size={'lg'} radius={60} {...getButtonProps()} />

      <ActionIcon variant="light" size='xl' radius={'xl'} onClick={() => toggleLocalStreamFeatures('video')}>
        {
          isVideoEnabled ? <BsFillCameraVideoFill size={20} /> : <BsFillCameraVideoOffFill size={20} />
        }
      </ActionIcon>
    </Group>
  )
}

const useStyles = createStyles((theme) => ({
  root: {
    border: `1px solid ${theme.colors.gray[2]}`,
    borderRadius: 10,
    width: '100%',
    padding: 20,
  },
  button: {
    fontSize: 15
  }
}))