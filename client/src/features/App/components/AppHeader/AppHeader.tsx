import { Box, createStyles } from "@mantine/core"
import { HeaderMenu } from "../HeaderMenu"
import { UserIcon } from "../UserIcon"

export const AppHeader = () => {
  const { classes } = useStyles()
  return (
    <Box component="header" className={classes.root}>

      {/* LOGO */}
      <Box>LOGO</Box>


      {/* NAVIGATION */}
      <HeaderMenu />


      {/* USER */}
      <UserIcon  name={'User'} />
    </Box>
  )
}

const useStyles = createStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `20px`
  }
}))

