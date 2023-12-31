import { Box, createStyles } from "@mantine/core"
import { UserIcon } from "../UserIcon"
import { BrandLogo } from "@/components/BrandLogo"

export const AppHeader = () => {
  const { classes } = useStyles()
  return (
    <Box component="header" className={classes.root}>

      {/* LOGO */}
      <BrandLogo />


      {/* NAVIGATION */}
      {/* <HeaderMenu /> */}


      {/* USER */}
      <UserIcon />
    </Box>
  )
}

const useStyles = createStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 30,
    paddingRight: 30,
  }
}))

