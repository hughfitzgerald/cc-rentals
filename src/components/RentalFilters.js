import {
  Button,
  Card,
  Container,
  createStyles,
  Group,
  Indicator,
  Modal,
  Popover,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import VacancySelect from "./filters/VacancySelect";
import EncumberedSelect from "./filters/EncumberedSelect";
import OwnerSelect from "./filters/OwnerSelect";
import BedsSelect from "./filters/BedsSelect";
import RentSelect from "./filters/RentSelect";
import {
  IconBed,
  IconDoorEnter,
  IconFilter,
  IconFilterOff,
  IconHomeDollar,
  IconHomeStats,
  IconTag,
} from "@tabler/icons-react";
import { useContext, useState } from "react";
import { mapContext } from "../context/mapContext";
import { AddressSelect } from "./filters/AddressSelect";
import { useMediaQuery } from "@mantine/hooks";
import RentalStats from "./RentalStats";

export const RentalFiltersStack = () => {
  return (
    <Stack>
      <Card withBorder shadow="sm" sx={{overflow:"visible"}}>
        <VacancySelect />
      </Card>
      <Card withBorder shadow="sm" sx={{overflow:"visible"}}>
        <EncumberedSelect />
      </Card>
      <Card withBorder shadow="sm" sx={{overflow:"visible"}}>
        <BedsSelect />
      </Card>
      <Card withBorder shadow="sm" sx={{overflow:"visible"}}>
        <RentSelect />
      </Card>
    </Stack>
  );
};

const useStyles = createStyles((theme) => ({
  filterButton: {
    color: 
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.white,

    borderColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.grape[9],
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.grape[6],
  },
  resetButton: {
    color: 
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.white,
    borderColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.grape[9],
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[9]
        : theme.colors.grape[9],
    '&[disabled]': {
      color: 
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[5],
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2],
    },
  },
}));

const FilterPopover = ({ label, filter, icon, filterString }) => {
  const { classes } = useStyles();
  const { thisFilterSet } = useContext(mapContext);
  const disabled = !thisFilterSet(filterString);
  return (
    <Popover trapFocus width={300}>
      <Popover.Target>
        <Indicator disabled={disabled} color="blue">
          <Button
            leftIcon={icon}
            variant={"filled"}
            className={classes.filterButton}
          >
            {label}
          </Button>
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown>{filter}</Popover.Dropdown>
    </Popover>
  );
};

const StatsPopover = () => {
  const { classes } = useStyles();
  return (
    <Popover trapFocus>
      <Popover.Target>
        <Button
          className={classes.filterButton}
          compact
          leftIcon={<IconHomeStats />}
        >
          Stats
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <RentalStats />
      </Popover.Dropdown>
    </Popover>
  );
};

const ResetFilters = ({ compact }) => {
  const { resetFilters, filtersSet } = useContext(mapContext);
  const disabled = !filtersSet();
  const { classes } = useStyles();
  return (
    <Button
      leftIcon={<IconFilterOff />}
      disabled={disabled}
      onClick={resetFilters}
      className={classes.resetButton}
      compact={compact}
    >
      Clear Filters
    </Button>
  );
};

export const RentalFiltersGroup = () => {
  return (
    <Group position="apart">
      <AddressSelect />
      <OwnerSelect label={false} />
      <FilterPopover
        label={"Price"}
        filter={<RentSelect />}
        icon={<IconTag />}
        filterString={"rent"}
      />
      <FilterPopover
        label={"Affordability"}
        filter={<EncumberedSelect />}
        icon={<IconHomeDollar />}
        filterString={"enc"}
      />
      <FilterPopover
        label={"Beds"}
        filter={<BedsSelect />}
        icon={<IconBed />}
        filterString={"beds"}
      />
      <FilterPopover
        label={"Vacancy"}
        filter={<VacancySelect />}
        icon={<IconDoorEnter />}
        filterString={"vac"}
      />
      <ResetFilters />
    </Group>
  );
};

export const RentalFiltersGrid = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const mediaQuery = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);
  const [opened, setOpened] = useState(false);
  if (mediaQuery) {
    return (
      <Group>
        <Stack>
          <AddressSelect />
          <OwnerSelect label={false} />
        </Stack>
        <Stack>
          <Container>
            <Group>
              <FilterPopover
                label={"Price"}
                filter={<RentSelect />}
                icon={<IconTag />}
                filterString={"rent"}
              />
              <FilterPopover
                label={"Affordability"}
                filter={<EncumberedSelect />}
                icon={<IconHomeDollar />}
                filterString={"enc"}
              />
              <FilterPopover
                label={"Beds"}
                filter={<BedsSelect />}
                icon={<IconBed />}
                filterString={"beds"}
              />
            </Group>
          </Container>
          <Container>
            <Group>
              <FilterPopover
                label={"Vacancy"}
                filter={<VacancySelect />}
                icon={<IconDoorEnter />}
                filterString={"vac"}
              />
              <ResetFilters />
            </Group>
          </Container>
        </Stack>
      </Group>
    );
  } else {
    return (
      <>
        <Modal
          title="Rental Filters"
          opened={opened}
          onClose={() => setOpened(false)}
          size="auto"
        >
          <RentalFiltersStack />
        </Modal>
        <Group>
          <Stack align="flex-start">
            <AddressSelect />
            <OwnerSelect label={false} />
            <StatsPopover />
            <Button
              className={classes.filterButton}
              compact
              leftIcon={<IconFilter />}
              onClick={() => setOpened(true)}
            >
              Filters
            </Button>
            <ResetFilters compact />
          </Stack>
        </Group>
      </>
    );
  }
};
