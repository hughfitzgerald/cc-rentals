import { Chip, Stack, Group, Divider } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { mapContext, mapDispatchContext } from "../../context/mapContext";
import FilterInfo from "./FilterInfo";

export const BedsSelect = () => {
  const { defBeds, searchParams, reactSearchParams } =
    useContext(mapContext);
  const { setSearchParams } = useContext(mapDispatchContext);
  const [bedsValues, setBedsValues] = useState(defBeds);

  function updateBeds(bedsValues) {
    if (!bedsValues.length) {
      setSearchParams({ beds: ["none"] });
    } else {
      setSearchParams({ beds: bedsValues });
    }

    setBedsValues(bedsValues);
  }

  useEffect(() => {
    setBedsValues(searchParams["beds"]);
    //eslint-disable-next-line
  }, [reactSearchParams]);

  return (
    <Stack spacing="xs">
      <Group position="apart">
        Bedrooms{" "}
        <FilterInfo infoText="How many bedrooms are included in the unit?" />
      </Group>
      <Divider />
      <Chip.Group
        position="center"
        multiple
        mt={15}
        value={bedsValues}
        onChange={updateBeds}
      >
        <Chip value="0" variant="filled">
          Studio
        </Chip>
        <Chip value="1" variant="filled">
          1 Bedroom
        </Chip>
        <Chip value="2" variant="filled">
          2 Bedroom
        </Chip>
        <Chip value="3" variant="filled">
          3 Bedroom
        </Chip>
        <Chip value="4" variant="filled">
          4 Bedroom
        </Chip>
        <Chip value="5" variant="filled">
          5 Bedroom
        </Chip>
      </Chip.Group>
    </Stack>
  );
};

export default BedsSelect;
