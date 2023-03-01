import React, { useState } from "react";
import {
  MantineProvider,
  ColorSchemeProvider,
  createStyles,
  Box,
} from "@mantine/core";
import { useColorScheme, useDisclosure } from "@mantine/hooks";
import Map from "./components/Map";
import { MapProvider } from "./context/mapContext";
import { NavbarContent, NavbarStatic } from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import HeaderMenu from "./components/Header";
import { MobileMenu } from "./components/MobileMenu";

const HEADER_HEIGHT = 60;
const NAVBAR_WIDTH = 300;
const FILTER_HEIGHT = 110;
const PADDING = 10;

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

    display: "none",
  },

  body: {
    display: "flex",
    boxSizing: "border-box",
  },

  main: {
    flex: 1,
    boxSizing: "border-box",
  },

  map: {
    //width: `calc(100vw - ${NAVBAR_WIDTH}px)`,
    width: `100vw`,
    height: `calc(100vh - ${HEADER_HEIGHT}px)`,

    [theme.fn.smallerThan("sm")]: {
      height: "100vh",
      width: "100vw",
    },
  },

  header: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  filters: {
    position: "absolute",
    left: 10,
    [theme.fn.largerThan("sm")]: {
      top: HEADER_HEIGHT + PADDING,
    },
    [theme.fn.smallerThan("sm")]: {
      top: 10,
    },
  },

  stats: {
    position: "absolute",
    top: HEADER_HEIGHT + PADDING + FILTER_HEIGHT,
    left: 10,
    [theme.fn.smallerThan("sm")]: {
      display: "none"
    }
  },
}));

export default function App() {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState(preferredColorScheme);
  const toggleColorScheme = () =>
    setColorScheme(colorScheme === "dark" ? "light" : "dark");

  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();

  const filters = <NavbarContent />;

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
            primaryColor: "grape",
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <Routes>
            <Route
              path="/*"
              element={
                <MapProvider>
                  <Box className={classes.root}>
                    <HeaderMenu
                      height={HEADER_HEIGHT}
                      className={classes.header}
                    />

                    <div className={classes.body}>
                      <NavbarStatic
                        className={classes.navbar}
                        width={NAVBAR_WIDTH}
                        filters={filters}
                      />
                      <main className={classes.main}>
                        <Map className={classes.map} classes={classes} />
                        <MobileMenu
                          opened={opened}
                          toggle={toggle}
                          filters={filters}
                        />
                      </main>
                    </div>
                  </Box>
                </MapProvider>
              }
            />
          </Routes>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryParamProvider>
  );
}
