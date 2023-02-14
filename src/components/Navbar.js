import { Accordion, Navbar } from "@mantine/core";
import RentalFilters from "./RentalFilters";
import RentalStats from "./RentalStats";

const NavbarContent = () => {
  return (
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
  );
};

const NavbarStatic = ({className, width, filters}) => {
  return (
    <Navbar width={{ base: width }} p="xs" hiddenBreakpoint="sm" hidden fixed={false} className={className}>
      {filters}
    </Navbar>
  );
};

export { NavbarContent, NavbarStatic };
