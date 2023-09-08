
import { Box, Group } from "@mantine/core"
import { ActionButtons } from "../../components/ActionButtons"


export const ActionBar = () => {

  return (
    <Group position="center">

      {/* copy component */}
      {/* <CopyToClipboard value={'dljsfljsdf'} label={'dslsldfjds'}>
        {(props) => <RoomUrlCopyLabel {...props} />}
      </CopyToClipboard> */}

      {/* action buttons */}
      <ActionButtons />

      {/* timer */}
      <Box />

    </Group>
  )
}



