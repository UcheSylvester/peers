import { Option } from "@/types";
import { CopyButton, UnstyledButton } from "@mantine/core"
import { notifications } from "@mantine/notifications";


interface CopyToClipboardProps extends Option {
  children: (params: Option) => React.ReactNode;
}

export const CopyToClipboard = ({value, label, children}: CopyToClipboardProps) => {
  return (
    <CopyButton value={value}>
      {({  copy }) => (
        <UnstyledButton onClick={() => {
          copy()
          notifications.show({
            message: 'Copied to clipboard',
          })
        }}>
          {children({value, label})}
        </UnstyledButton>
      )}
    </CopyButton>
  )
}