import {
  MantineProvider,
  AppShell,
  Navbar,
  Header,
  Title,
  Group,
  Stack,
} from "@mantine/core";
import Map from "./components/Map";
import { MapProvider } from "./context/mapContext";
import RentalFilters from "./components/RentalFilters";
import RentalStats from "./components/RentalStats";

export default function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        fontFamily: "Open Sans, sans-serif",
        lineHeight: 1.2,
        primaryColor: "indigo",
      }}
    >
      <MapProvider>
        <AppShell
          padding="md"
          navbar={
            <Navbar width={{ base: 300 }} height={500} p="xs">
              {
                <Group>
                <RentalFilters />
                <RentalStats />
                </Group>
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
