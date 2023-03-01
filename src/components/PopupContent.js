import React, { useState, useEffect, useContext } from "react";
import { DataTable } from "mantine-datatable";
import {
  Text,
  Box,
  useMantineTheme,
  Group,
  Button,
  Stack,
  createStyles,
} from "@mantine/core";
import sortBy from "lodash/sortBy";
import { mapContext } from "../context/mapContext.js";
import { useMediaQuery } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { IconArrowNarrowLeft } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  popupBox: {
    [theme.fn.largerThan("sm")]: {
      height: 270,
      width: 1125,
    },    
  },

  /*
  dataTableBox: {
    [theme.fn.largerThan("sm")]: {
      height: 210,
      width: 1125,
    },
    
    [!theme.fn.largerThan("sm")]: {
      height: 10,
      width: "calc(100vw - 20px)",
    },
  },

  histTableBox: {
    [theme.fn.largerThan("sm")]: {
      height: 185,
      width: 1125,
    },
    
    [!theme.fn.largerThan("sm")]: {
      height: "calc(50% - 100px)",
      width: "calc(100vw - 20px)",
    },
    
  },*/
}));

const essential_columns = [
  {
    accessor: "unit",
    sortable: true,
    render: ({ unit }) => {
      return <Link to={unit.toString()}>{unit}</Link>;
    },
  },
  {
    accessor: "rent",
    render: ({ rent }) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(rent),
    sortable: true,
  },
  {
    accessor: "rentdate",
    title: "Rent Reported On",
    sortable: true,
  },
];
const extra_columns = [
  {
    accessor: "beds",
    sortable: true,
  },
  {
    accessor: "baths",
    sortable: true,
  },
  {
    accessor: "built",
    title: "Year Built",
    sortable: true,
  },
  {
    accessor: "encumbered",
    title: "Restricted Unit",
    sortable: true,
  },
  {
    accessor: "status",
    title: "Vacancy Status",
    sortable: true,
  },
];

const owner_columns = [
  {
    accessor: "owner",
    title: "Owner",
    sortable: true,
  },
];

const PopupOwner = ({ popupMultipleOwners, popupOwner }) => {
  const theme = useMantineTheme();
  const mediaQuery = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);
  if (popupMultipleOwners.current) {
    if (mediaQuery) {
      return (
        <Text>Multiple owners – See table for unit ownership details</Text>
      );
    } else {
      return <Text>Multiple owners</Text>;
    }
  } else {
    return (
      <Text>
        Owner: <b>{popupOwner.current}</b>
      </Text>
    );
  }
};

export default function PopupContent() {
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "unit",
    direction: "asc",
  });
  const { popupAddress, popupUnits, popupOwner, popupMultipleOwners } =
    useContext(mapContext);
  const [sortedRecords, setRecords] = useState(sortBy(popupUnits, "unit"));
  const theme = useMantineTheme();
  const mediaQuery = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);
  const { classes } = useStyles();

  useEffect(() => {
    const data = sortBy(popupUnits, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
  }, [sortStatus, popupUnits]);

  return (
    <Stack className={classes.popupBox}>
      <Group position="apart">
        <Text fw={700}>{popupAddress.current}</Text>
        <PopupOwner
          popupOwner={popupOwner}
          popupMultipleOwners={popupMultipleOwners}
        />
      </Group>
      <DataTable
        styles={(theme) => ({
          root: {
              height: mediaQuery ? "100%" : "calc(50vh - 110px)",
          }
        })}
        withBorder
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
        idAccessor="unit"
        noRecordsText="No rent information available."
        shadow="sm"
        records={sortedRecords}
        columns={
          !mediaQuery
            ? essential_columns
            : !popupMultipleOwners.current
            ? essential_columns.concat(extra_columns)
            : essential_columns.concat(extra_columns).concat(owner_columns)
        }
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
      />
    </Stack>
  );
}

const hist_columns = [
  {
    accessor: "rentdate",
    title: "Date Reported",
    sortable: true,
  },
  {
    accessor: "rent",
    title: "Rent Amount",
    sortable: true,
    render: ({ rent }) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(rent),
  },
];

export function Unit() {
  const { popupAddress, unitData, unitRents } = useContext(mapContext);
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "rentdate",
    direction: "desc",
  });
  const [sortedRecords, setRecords] = useState(sortBy(unitRents, "rentdate"));
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const mediaQuery = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);

  useEffect(() => {
    const data = sortBy(unitRents, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
  }, [sortStatus, unitRents]);

  if (!unitData || !unitRents) return <></>;

  return (
    <Stack className={classes.popupBox}>
      <Group position="apart">
        <Box>
          <Text fw={700}>{popupAddress.current}</Text>
          <Text fw={700}>Unit: {unitData.unit}</Text>
        </Box>
        <Link to={"../" + unitData.slug}>
          <Button variant="outline" leftIcon={<IconArrowNarrowLeft />}>
            Back to {popupAddress.current}
          </Button>
        </Link>
      </Group>
      <DataTable
        styles={(theme) => ({
          root: {
              height: mediaQuery ? "100%" : "calc(50vh - 185px)",
          }
        })}
        withBorder
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
        noRecordsText="No historical rent information available."
        shadow="sm"
        columns={hist_columns}
        records={sortedRecords}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
      />
    </Stack>
  );
}
