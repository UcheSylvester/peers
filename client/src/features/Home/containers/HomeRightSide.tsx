import { Stack, createStyles } from "@mantine/core"

export const HomeRightSide = () => {
  const { classes } = useStyles()
  return (
    <Stack className={classes.root}>
      <img
        alt='banner image' 
        src={`/images/banner.png`} 
        className={classes.image}
      />
    </Stack>
  )
}

const useStyles = createStyles((theme) => ({
  root: {
  },
  image: {
    maxWidth: 600,
    width: '100%',
    height: 'auto',
    objectFit: 'cover',

    [theme.fn.smallerThan('md')]: {
      maxWidth: 500,
    }
  }
}))