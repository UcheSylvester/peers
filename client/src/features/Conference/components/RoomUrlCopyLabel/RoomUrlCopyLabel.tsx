import { Option } from "@/types"
import { Group, Text, createStyles } from "@mantine/core"
import { BiSolidCopy } from "react-icons/bi"

interface RoomUrlCopyLabelProps extends Option {
}
export const RoomUrlCopyLabel = ({label}: RoomUrlCopyLabelProps) => {
  const {classes} = useStyles()
  return (
    <Group className={classes.roomUrl}>
      <BiSolidCopy />
      <Text className={classes.urlLabel}>{label}</Text>
    </Group>
  )
}

const useStyles = createStyles((theme) => ({
  roomUrl: {
    backgroundColor: theme.colors.gray[0],
    paddingLeft: 30,  
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 50,
  },

  urlLabel: {

  } 
}))