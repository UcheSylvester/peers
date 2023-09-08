import { Box, Button, Stack, Text, Title, createStyles } from "@mantine/core"

export const HomeLeftSide = () => {
  const { classes } = useStyles()
  return (
    <Stack spacing={50} className={classes.root}>
      <Title size={50}>
        {`Let's`} Connect 
        <Box component='br' /> 
        You with Your Peers 
        <Box component='br' /> 
        in Real Time
      </Title>

      <Text>
        Peers is a video conferencing app that allows you 
        <Box component='br' /> 
        to connect with your peers in real time.
      </Text>

      <Button size={'xl'} className={classes.button}>Peer Up!</Button>
    </Stack>
  )
}

const useStyles = createStyles((theme) => ({
  root: {
  },
  button: {
    width: '100%',
    borderRadius: 60,
    fontSize: 20,
    fontWeight: 900,
    padding: '15px 0px',
    background: `linear-gradient(45deg, ${theme.colors.teal[6]}, ${theme.colors.teal[4]})`,
    color: theme.white,
    maxWidth: 300,

    
    '&:hover': {
      background: `linear-gradient(45deg, ${theme.colors.teal[6]}, ${theme.colors.teal[4]})`,
      color: theme.white
    }
  }
}))