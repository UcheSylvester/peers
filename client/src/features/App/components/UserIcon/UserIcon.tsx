import { Avatar, Group, Text } from "@mantine/core"

interface UserIconProps {
  name?: string
}
export const UserIcon = ({name}: UserIconProps) => {
  return (
    <Group>
      <Avatar color="teal" radius="xl">
        {(name?.split(' ').map((word) => word[0]).join('') || 'U')}
      </Avatar>

      {
        name && <Text>{name}</Text>
      }

      

    </Group>
  )
}