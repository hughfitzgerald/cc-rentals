import React, { useState, useEffect, useContext } from "react";
import { DataTable } from "mantine-datatable";
import { Center, Text, Box, useMantineTheme } from "@mantine/core";
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
  },];
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

export default function PopupContent() {
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "unit",
    direction: "asc",
  });
  const { popupAddress, popupUnits } = useContext(mapContext);
  const [sortedRecords, setRecords] = useState(sortBy(popupUnits, "unit"));
  const theme = useMantineTheme();
  const mediaQuery = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);

  useEffect(() => {
    const data = sortBy(popupUnits, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
  }, [sortStatus, popupUnits]);

  return (
    <Center>
      <Box sx={{ height: 225, width: 1000 }}>
        <Text>{popupAddress.current}</Text>
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
          columns={mediaQuery ? essential_columns.concat(extra_columns) : essential_columns}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
        />
      </Box>
    </Center>
  );
}
