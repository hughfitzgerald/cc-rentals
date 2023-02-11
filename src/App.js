import React, {
  useState,
} from "react";
import {
  MantineProvider,
  AppShell,
  Navbar,
  Header,
  Title,
  Accordion,
  ActionIcon,
  ColorSchemeProvider,
  Group,
} from "@mantine/core";
import { useColorScheme } from '@mantine/hooks';
import { IconSun, IconMoonStars, IconBuildingEstate } from "@tabler/icons-react";
import Map from "./components/Map";
import { MapProvider } from "./context/mapContext";
import RentalFilters from "./components/RentalFilters";
import RentalStats from "./components/RentalStats";

export default function App() {
  const app_id = "parentRef";

  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState(preferredColorScheme);
  const toggleColorScheme = () =>
    setColorScheme((colorScheme === 'dark' ? 'light' : 'dark'));
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme,
          headings: { fontFamily: 'Greycliff CF, sans-serif' },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <MapProvider>
          <AppShell
            padding="md"
            id={app_id}
            fixed={false}
            header={
              <Header height={60}>
                <Group sx={{ height: "100%" }} px={20} position="apart">
                  <Title order={2}><IconBuildingEstate /> Culver City Rental Registry</Title>
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
            }
            navbar={
              <Navbar width={{ base: 300 }} p="xs">
                {
                  <Accordion multiple defaultValue={["filters", "stats"]}>
                    <Accordion.Item value="filters">
                      <Accordion.Control>Rental Filters</Accordion.Control>
                      <Accordion.Panel>
                        <RentalFilters />
                      </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="stats">
                      <Accordion.Control>Rental Statistics</Accordion.Control>
                      <Accordion.Panel>
                        <RentalStats />
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                }
              </Navbar>
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
            <Map />
          </AppShell>
        </MapProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
