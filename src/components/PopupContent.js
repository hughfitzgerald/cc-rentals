import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { Center, Text, Box } from "@mantine/core"
import sortBy from "lodash/sortBy";

export default function PopupContent({ address, units }) {
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "unit",
    direction: "asc",
  });
  const [records, setRecords] = useState(sortBy(units, "unit"));

  useEffect(() => {
    const data = sortBy(units, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
  }, [sortStatus, units]);

  return (
    <Center>
    <Box sx={{ height: 225, width: 1000 }}>
      <Text>{address}</Text>
      <DataTable
        withBorder
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
        idAccessor="unit"
        noRecordsText="No rent information available."
        shadow="sm"
        records={records}
        columns={[
          {
            accessor: "unit",
            sortable: true,
          },
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
          {
            accessor: "encumbered",
            title: "Affordable Unit",
            sortable: true,
          },
          {
            accessor: "status",
            title: "Vacancy Status",
            sortable: true,
          },
        ]}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
      />
    </Box>
    </Center>
  );
}
