import { Autocomplete, Group, Stack, Text } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { forwardRef, useContext, useEffect, useState } from "react";
import { mapContext } from "../../context/mapContext";
import FilterInfo from "./FilterInfo";

export const OwnerSelect = ({ label }) => {
  const { setOwnerValues, ownerValues, unreg, setSearchParams } =
    useContext(mapContext);

  const AutoCompleteItem = forwardRef(({ count, label, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap position="apart">
        <div style={{ width: 160 }}>
          <Text truncate>{label}</Text>
        </div>

        <Text>{count}</Text>
      </Group>
    </div>
  ));

  const [data, setData] = useState([
    {
      value: "FOX HILLS CANTERBURY CO LP",
      label: "FOX HILLS CANTERBURY CO LP",
      count: 1102,
    },
    { value: "LLC, IVY STATION", label: "LLC, IVY STATION", count: 800 },
    { value: "PARKWAY PLAZA 94", label: "PARKWAY PLAZA 94", count: 265 },
    { value: "LP, MEADOWS SOUTH II", label: "", count: 234 },
    { value: "WISSNER, PETER A", label: "WISSNER, PETER A", count: 224 },
  ]);

  function updateOwner(ownerValues) {
    setSearchParams({ owner: ownerValues });
    setOwnerValues(ownerValues);
  }

  useEffect(() => {
    async function loadOwners() {
      var response = await fetch(
        "https://www.ccrentals.org/owner_counts.json"
      ).then((res) => {
        return res.json();
      });

      setData(response);
    }
    loadOwners();
  }, []);

  return (
    <Stack spacing="xs">
      <Text fz="sm" sx={{ display: (label) ? "block" : "none" }}>
        Owner name{" "}
        <FilterInfo infoText="Who is registered with the city as the owner?" />
      </Text>
      <Autocomplete
        sx={{width:250}}
        placeholder="Landlord name"
        onChange={updateOwner}
        value={ownerValues}
        data={data}
        nothingFound="Nothing found"
        limit={15}
        maxDropdownHeight={200}
        itemComponent={AutoCompleteItem}
        disabled={unreg}
        icon={<IconUser />}
      />
    </Stack>
  );
};

export default OwnerSelect;
