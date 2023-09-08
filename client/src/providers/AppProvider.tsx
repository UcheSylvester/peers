import { themeOverride } from "@/themes"
import { MantineProvider } from "@mantine/core"

interface AppProviderProps {
  children: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <MantineProvider theme={themeOverride} withGlobalStyles  withNormalizeCSS>
      {children}
    </MantineProvider>
  )
}