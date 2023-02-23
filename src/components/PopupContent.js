import React, { useState, useEffect, useContext } from "react";
import { DataTable } from "mantine-datatable";
import { Text, Box, useMantineTheme, Group } from "@mantine/core";
import sortBy from "lodash/sortBy";
import { mapContext } from "../context/mapContext.js";
import { useMediaQuery } from "@mantine/hooks";

const essential_columns = [
  {
    accessor: "unit",
    sortable: true,
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
  if (popupMultipleOwners.current) {
    return (
      <Text>
        Multiple owners – See table for
        unit ownership details
      </Text>
    );
  } else {
    return <Text>Owner: <b>{popupOwner.current}</b></Text>;
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

  useEffect(() => {
    const data = sortBy(popupUnits, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
  }, [sortStatus, popupUnits]);

  return (
      <Box sx={{ height: 225, width: 1125 }}>
        <Group position="apart">
      <Text fw={700}>
        {popupAddress.current}
      </Text>
        <PopupOwner
          popupOwner={popupOwner}
          popupMultipleOwners={popupMultipleOwners}
        />
        </Group>
        <DataTable
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
            (!mediaQuery)
              ? essential_columns
              : (!popupMultipleOwners.current)
              ? essential_columns.concat(extra_columns)
              : essential_columns.concat(extra_columns).concat(owner_columns)
          }
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
        />
      </Box>
  );
}
