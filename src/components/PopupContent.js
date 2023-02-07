import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import sortBy from "lodash/sortBy";

export default function PopupContent({ address, units }) {
    const [sortStatus, setSortStatus] = useState({
      columnAccessor: "name",
      direction: "asc",
    });
    const [records, setRecords] = useState(sortBy(units, "unit"));
  
    useEffect(() => {
      const data = sortBy(units, sortStatus.columnAccessor);
      setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
    }, [sortStatus, units]);
  
    return (
      <div className="popup">
        <h3 className="address">{address}</h3>
        <div className="rentTable">
          <DataTable
            withBorder
            borderRadius="sm"
            withColumnBorders
            striped
            highlightOnHover
            idAccessor="unit"
            noRecordsText="No rent information available."
            minHeight={150}
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
        </div>
      </div>
    );
}
