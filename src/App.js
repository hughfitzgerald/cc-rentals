import {
  MantineProvider,
  AppShell,
  Navbar,
  Header,
  Title,
  Accordion
} from "@mantine/core";
import Map from "./components/Map";
import { MapProvider } from "./context/mapContext";
import RentalFilters from "./components/RentalFilters";
import RentalStats from "./components/RentalStats";

export default function App() {
  const app_id = 'parentRef'
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
    >
      <MapProvider>
        <AppShell          
          padding="md"
          id={app_id}
          navbar={
            <Navbar width={{ base: 300 }} p="xs">
              {
                <Accordion multiple defaultValue={["filters","stats"]}>
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
          header={
            <Header height={60} p="xs">
              {<Title order={1}>Culver City Rental Registry</Title>}
            </Header>
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
  );
}
