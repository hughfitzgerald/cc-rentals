import React, { useState } from "react";
import {
  MantineProvider,
  Header,
  Title,
  ActionIcon,
  ColorSchemeProvider,
  Group,
  createStyles,
  Burger,
  Transition,
  Paper,
  Box,
  Space,
} from "@mantine/core";
import { useColorScheme, useDisclosure } from "@mantine/hooks";
import {
  IconSun,
  IconMoonStars,
  IconBuildingEstate,
} from "@tabler/icons-react";
import Map from "./components/Map";
import { MapProvider } from "./context/mapContext";
import { NavbarContent, NavbarStatic } from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";

const HEADER_HEIGHT = 60;
const NAVBAR_WIDTH = 300;

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box",
  },

  navbar: {
    minWidth: `${NAVBAR_WIDTH}px`,

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  body: {
    display: "flex",
    boxSizing: "border-box",
  },

  main: {
    flex: 1,
    //width: "calc(100vw - 300px)",
    boxSizing: "border-box",
  },

  map: {
    //width: "100vw",
    //height: "100vh",
    //minWidth: "600px",
    width: `calc(100vw - ${NAVBAR_WIDTH}px)`,
    height: `calc(100vh - ${HEADER_HEIGHT}px)`,

    [theme.fn.smallerThan("sm")]: {
      height: "100vh",
      width: "100vw",
    },
  },

  dropdown: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 6,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    //display: "flex",
    //justifyContet: "space-between",
    //alignItems: "center",
    //height: "100%",

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  mobileHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
  },

  burger: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 0,
    zIndex: 7,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

export default function App() {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState(preferredColorScheme);
  const toggleColorScheme = () =>
    setColorScheme(colorScheme === "dark" ? "light" : "dark");

  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();

  const filters = (<NavbarContent />);

  return (
    <QueryParamProvider adapter={ReactRouter6Adapter}>
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme,
          headings: { fontFamily: "Greycliff CF, sans-serif" },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Routes>
        <Route path="/*" element={
        <MapProvider>
          <Box className={classes.root}>
            <Header height={HEADER_HEIGHT} className={classes.header}>
              <Group sx={{ height: "100%" }} px={20} position="apart">
                <Title order={2}>
                  <IconBuildingEstate /> Culver City Rental Registry
                </Title>
                <ActionIcon
                  variant="default"
                  onClick={() => toggleColorScheme()}
                  size={30}
                >
                  {colorScheme === "dark" ? (
                    <IconSun size={16} />
                  ) : (
                    <IconMoonStars size={16} />
                  )}
                </ActionIcon>
              </Group>
            </Header>

            <div className={classes.body}>
              <NavbarStatic className={classes.navbar} width={NAVBAR_WIDTH} filters={filters} />
              <main className={classes.main}>
                <Map className={classes.map} />
                <Burger
                      opened={opened}
                      onClick={toggle}
                      className={classes.burger}
                      size="sm"
                    />
              
              <Transition
                transition="pop-top-left"
                duration={200}
                mounted={opened}
              >
                {(styles) => (
                  <div>
                  <Paper className={classes.dropdown} withBorder style={styles}>
                    <Space h="md" />
                  <Title order={2} align="center">
                    <IconBuildingEstate /> Culver City Rental Registry
                  </Title>
                  
                    {filters}
                  </Paper>
                  </div>
                )}
              </Transition>
              </main>
            </div>
          </Box>
        </MapProvider>
        } />
        </Routes>
      </MantineProvider>
    </ColorSchemeProvider>
    </QueryParamProvider>
  );

  /*
  const app_id = "parentRef";
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme,
          headings: { fontFamily: "Greycliff CF, sans-serif" },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <MapProvider>
          <AppShell
            className={classes.root}
            padding="md"
            id={app_id}
            fixed={false}
            hidden={mediaQuery}
            header={
              <Header height={HEADER_HEIGHT} className={classes.header}>
                <Group sx={{ height: "100%" }} px={20} position="apart">
                  <Title order={2}>
                    <Burger
                      opened={opened}
                      onClick={toggle}
                      className={classes.burger}
                      size="sm"
                    />
                    <IconBuildingEstate /> Culver City Rental Registry
                  </Title>
                  <ActionIcon
                    variant="default"
                    onClick={() => toggleColorScheme()}
                    size={30}
                  >
                    {colorScheme === "dark" ? (
                      <IconSun size={16} />
                    ) : (
                      <IconMoonStars size={16} />
                    )}
                  </ActionIcon>
                </Group>
                <Transition
                  transition="pop-top-left"
                  duration={200}
                  mounted={opened}
                >
                  {(styles) => (
                    <Paper
                      className={classes.dropdown}
                      withBorder
                      style={styles}
                    >
                      <NavbarContent />
                    </Paper>
                  )}
                </Transition>
              </Header>
            }
            navbarOffsetBreakpoint="sm"
            navbar={
                <NavbarStatic />
            }
            styles={(theme) => ({
              main: {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              },
            })}
          >
            <Map className={classes.map} />
          </AppShell>
        </MapProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
  */
}
