import {
  Anchor,
  AppShell,
  Box,
  Burger,
  Container,
  Drawer,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Link, Outlet, useLocation } from "react-router-dom";
import { experiments } from "../config/projects";
import classes from "./AppShellLayout.module.css";

const GITHUB_URL = import.meta.env.VITE_GITHUB_URL ?? "https://github.com";

export function AppShellLayout() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 48em)");
  const location = useLocation();

  const navItems = experiments.map((exp) => (
    <NavLink
      key={exp.id}
      component={Link}
      to={`/e/${exp.id}`}
      label={exp.title}
      description={exp.description}
      active={location.pathname === `/e/${exp.id}`}
      onClick={() => {
        closeDrawer();
      }}
      className={classes.navLink}
    />
  ));

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: 280,
        breakpoint: "sm",
        collapsed: { mobile: true },
      }}
      padding="md"
      className={classes.shell}
    >
      <AppShell.Header className={classes.header}>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="sm">
            {isMobile ? (
              <Burger opened={drawerOpened} onClick={toggleDrawer} size="sm" aria-label="Toggle navigation" />
            ) : null}
            <Box>
              <Title order={3} className={classes.title}>
                Experiments
              </Title>
              <Text size="xs" c="dimmed" visibleFrom="xs">
                Animation gallery
              </Text>
            </Box>
          </Group>
          <Anchor href={GITHUB_URL} target="_blank" rel="noopener noreferrer" size="sm" className={classes.githubLink}>
            GitHub
          </Anchor>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" className={classes.navbar} visibleFrom="sm">
        <AppShell.Section grow component={ScrollArea} type="scroll" scrollbarSize={6}>
          <Stack gap={4}>{navItems}</Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Experiments"
        hiddenFrom="sm"
        zIndex={400}
        classNames={{ content: classes.drawerContent }}
      >
        <Stack gap={4}>{navItems}</Stack>
      </Drawer>

      <AppShell.Main className={classes.main}>
        <Container size="xl" h="100%" py="md">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
