import { IconMapPin } from "@tabler/icons-react";
import { Autocomplete, CloseButton, Group, Stack, Text } from "@mantine/core";
import { forwardRef, useContext, useEffect, useState } from "react";
import { mapContext, mapDispatchContext } from "../../context/mapContext";
import FilterInfo from "./FilterInfo";

export const AddressSelect = ({ label }) => {
  const {
    defAddress,
    searchParams,
    reactSearchParams,
  } = useContext(mapContext);
  const { setSearchParams } = useContext(mapDispatchContext);
  const [addressValue, setAddressValue] = useState(defAddress);

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
    addressValue = addressValue.value;
    setSearchParams({ address: addressValue });
    setAddressValue(addressValue);
  }

  useEffect(() => {
    setAddressValue(searchParams["address"]);
    //eslint-disable-next-line
  }, [reactSearchParams]);

  const ClearButton = () => {
    return (
      <CloseButton
        variant="transparent"
        onClick={() => updateAddress({ value: "" })}
      />
    );
  };

  useEffect(() => {
    async function loadAddress() {
      var response = await fetch(
        "https://www.ccrentals.org/address_counts.json"
      ).then((res) => {
        return res.json();
      });

      setData(response);
    }
    loadAddress();
  }, []);

  return (
    <Stack spacing="xs">
      <Text fz="sm" sx={{ display: label ? "block" : "none" }}>
        Address{" "}
        <FilterInfo infoText="Which address is registered with the city?" />
      </Text>
      <Autocomplete
        sx={{ width: 250 }}
        placeholder="Address"
        onChange={setAddressValue}
        onItemSubmit={updateAddress}
        value={addressValue}
        nothingFound="Nothing found"
        limit={15}
        data={data}
        maxDropdownHeight={200}
        itemComponent={AutoCompleteItem}
        icon={<IconMapPin />}
        rightSection={<ClearButton />}
      />
    </Stack>
  );
};

export default AddressSelect;
