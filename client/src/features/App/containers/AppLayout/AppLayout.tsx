import { AppHeader } from "@/features/App"
import { AppShell, Box, createStyles } from "@mantine/core"

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout = ({children}: AppLayoutProps) => {
  const {classes} = useStyles()

  return (
    <AppShell
    // navbarOffsetBreakpoint="sm"
    // asideOffsetBreakpoint="sm"
    padding={0}
    // navbar={<DashboardSidebar />}
    header={<AppHeader />}
    classNames={classes}
    fixed
  >
    <Box className={classes.container}>
      <Box>{children}</Box>
    </Box>
  </AppShell>
  )
}

const useStyles = createStyles(() => ({
  body: {

  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: '1 0',
  },
}));