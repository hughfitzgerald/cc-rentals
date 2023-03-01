import { Chip, Stack, Group, Divider } from "@mantine/core";
import { useContext } from "react";
import { mapContext } from "../../context/mapContext";
import FilterInfo from "./FilterInfo";

export const BedsSelect = () => {
    const { setBedsValues, bedsValues, unreg, setSearchParams } = useContext(mapContext);
  
    function updateBeds(bedsValues) {
      if (!bedsValues.length) {
        setSearchParams({ beds: ["none"] });
      } else {
        setSearchParams({ beds: bedsValues });
      }
  
      setBedsValues(bedsValues);
    }

    return (
      <Stack spacing="xs">
          <Group position="apart">
            Bedrooms <FilterInfo infoText="How many bedrooms are included in the unit?" />
          </Group>
          <Divider />
          <Chip.Group
            position="center"
            multiple
            mt={15}
            value={bedsValues}
            onChange={updateBeds}
          >
            <Chip value="0" variant="filled" disabled={unreg}>
              Studio
            </Chip>
            <Chip value="1" variant="filled" disabled={unreg}>
              1 Bedroom
            </Chip>
            <Chip value="2" variant="filled" disabled={unreg}>
              2 Bedroom
            </Chip>
            <Chip value="3" variant="filled" disabled={unreg}>
              3 Bedroom
            </Chip>
            <Chip value="4" variant="filled" disabled={unreg}>
              4 Bedroom
            </Chip>
            <Chip value="5" variant="filled" disabled={unreg}>
              5 Bedroom
            </Chip>
          </Chip.Group>
          </Stack>
    )
  }

  export default BedsSelect;