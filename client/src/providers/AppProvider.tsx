import { themeOverride } from "@/themes"
import { MantineProvider } from "@mantine/core"
import { Notifications } from "@mantine/notifications";


interface AppProviderProps {
  children: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <MantineProvider theme={themeOverride} withGlobalStyles  withNormalizeCSS>
      <Notifications />
      {children}
    </MantineProvider>
  )
}