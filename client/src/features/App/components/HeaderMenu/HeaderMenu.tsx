import { Link } from "@/components/Link"
import { Group, createStyles } from "@mantine/core"
import { useRouter } from "next/router"

const LINKS: { label: string, href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Conference', href: '/conference' },
]

export const HeaderMenu = () => {
  const router = useRouter()
  const { classes, cx } = useStyles()

  const isActive = (href: string) => router.pathname === href

  return (
    <Group spacing={40}>
      {LINKS.map(({ label, href }) => (
        <Link key={href} href={href} className={cx(classes.link, isActive(href) && classes.active)}>{label}</Link>
      ))}
    </Group>
  )
}

const useStyles = createStyles((theme) => ({
  link: {
    fontSize: theme.fontSizes.sm,
    '&:hover': {
      textDecoration: 'none',
      fontWeight: 600
    },
  },
  active: {
    textDecoration: 'none',
    fontWeight: 600,
    color: theme.colors.teal[9]
  },
}))