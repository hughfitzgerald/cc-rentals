import { Autocomplete, CloseButton, Group, Stack, Text } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { forwardRef, useContext, useEffect, useState } from "react";
import { mapContext, mapDispatchContext } from "../../context/mapContext";
import FilterInfo from "./FilterInfo";

export const OwnerSelect = ({ label }) => {
  const { defOwner, searchParams, reactSearchParams } = useContext(mapContext);
  const { setSearchParams } = useContext(mapDispatchContext);
  const [ownerValue, setOwnerValue] = useState(defOwner);

  const ownerURL = 'https://www.ccrentals.org/owner_counts.json'

  const AutocompleteItem = forwardRef(({ count, label, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap position="apart">
        <div style={{ width: 160 }}>
          <Text truncate>{label}</Text>
        </div>

        <Text>{count}</Text>
      </Group>
    </div>
  ));

  function AutocompleteFilter(value, item) {
    var array = value.toLowerCase().trim().split(' ');
    for (let e in array) {
      if (!item.value.toLowerCase().trim().includes(array[e])) {
        return false;
      }
    };
    return true;
  }

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

  function updateOwner(ownerValue) {
    ownerValue = ownerValue.value;
    setSearchParams({ owner: ownerValue });
    setOwnerValue(ownerValue);
  }

  useEffect(() => {
    setOwnerValue(searchParams["owner"]);
    //eslint-disable-next-line
  }, [reactSearchParams]);

  const ClearButton = () => {
    return (
      <CloseButton
        variant="transparent"
        onClick={() => updateOwner({ value: "" })}
      />
    );
  };

  useEffect(() => {
    async function loadOwners() {
      var response = await fetch(
        ownerURL
      ).then((res) => {
        return res.json();
      });

      setData(response);
    }
    loadOwners();
  }, []);

  return (
    <Stack spacing="xs">
      <Text fz="sm" sx={{ display: label ? "block" : "none" }}>
        Owner name{" "}
        <FilterInfo infoText="Who is registered with the city as the owner?" />
      </Text>
      <Autocomplete
        sx={{ width: 250 }}
        placeholder="Landlord name"
        onChange={setOwnerValue}
        onItemSubmit={updateOwner}
        value={ownerValue}
        data={data}
        nothingFound="Nothing found"
        limit={15}
        maxDropdownHeight={200}
        itemComponent={AutocompleteItem}
        icon={<IconUser />}
        rightSection={(ownerValue !== "") && <ClearButton />}
        filter={AutocompleteFilter}
      />
    </Stack>
  );
};

export default OwnerSelect;
