import { IconMapPin } from "@tabler/icons-react";
import { Autocomplete, Group, Stack, Text } from "@mantine/core";
import { forwardRef, useContext, useEffect, useState } from "react";
import { mapContext } from "../../context/mapContext";
import FilterInfo from "./FilterInfo";

export const AddressSelect = ({ label }) => {
  const { setAddressValue, addressValue, unreg, setSearchParams } =
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

  const [data, setData] = useState([]);

  function updateAddress(addressValue) {
    setSearchParams({ address: addressValue });
    setAddressValue(addressValue);
  }

  useEffect(() => {
    async function loadAddress() {
      var response = await fetch(
        "https://hughfitzgerald.github.io/cc-rentals/address_counts.json"
      ).then((res) => {
        return res.json();
      });

      setData(response);
    }
    loadAddress();
  }, []);

  return (
    <Stack spacing="xs">
      <Text fz="sm" sx={{ display: (label) ? "block" : "none" }}>
        Address{" "}
        <FilterInfo infoText="Which address is registered with the city?" />
      </Text>
    <Autocomplete
      sx={{ width: 250 }}
      placeholder="Address"
      onChange={updateAddress}
      value={addressValue}
      nothingFound="Nothing found"
      limit={15}
      data={data}
      maxDropdownHeight={200}
      itemComponent={AutoCompleteItem}
      disabled={unreg}
      icon={<IconMapPin />}
    />
    </Stack>
  );
};

export default AddressSelect;
