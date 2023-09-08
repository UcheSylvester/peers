import { Box, Title, createStyles } from "@mantine/core"
import { Link } from "../Link";

export const BrandLogo = () => {
  const { classes } = useStyles()
  return (
    <Box>
      <Link href={'/'}><Title className={classes.root}>Peers</Title></Link>
    </Box>
  )
}

const useStyles = createStyles((theme) => ({
  root: {
    background: `-webkit-linear-gradient(45deg, ${theme.colors.teal[6]}, ${theme.colors.teal[4]})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 900,
    fontSize: 35,
  }
}))