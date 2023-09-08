import { AppLayout } from "@/features"
import { Group, createStyles } from "@mantine/core"
import { HomeLeftSide, HomeRightSide } from "../containers"

export const HomePage = () => {
  return (
    <AppLayout>
      <HomePageContent />
    </AppLayout>
  )
}

const HomePageContent = () => {
  const { classes } = useStyles()

  return (
    <Group spacing={50} className={classes.root}>
      <HomeLeftSide />
      <HomeRightSide />
    </Group>
  )
}

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 20,
    minHeight: '70vh',
    flexWrap: 'nowrap',
    
    [theme.fn.smallerThan('md')]: {
      flexDirection: 'column-reverse',
      justifyContent: 'center',
      flexWrap: 'wrap',
    }
  }
}))