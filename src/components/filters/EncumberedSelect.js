import { Chip, Divider, Group, Stack, } from "@mantine/core";
import { useContext } from "react";
import { mapContext } from "../../context/mapContext";
import FilterInfo from "./FilterInfo";

export const EncumberedSelect = () => {
    const { setEncValues, encValues, unreg, setSearchParams } = useContext(mapContext);
  
    function updateEnc(encValues) {
      if (!encValues.length) {
        setSearchParams({ enc: ["none"] });
      } else {
        setSearchParams({ enc: encValues });
      }
  
      setEncValues(encValues);
    }
  
    return (
      <Stack spacing="xs">
          <Group position="apart">
            Affordability Restrictions <FilterInfo infoText="Is the unit encumbered by an income and affordable unit restriction?" />
          </Group>
          <Divider />
          <Chip.Group
            position="center"
            multiple
            mt={15}
            value={encValues}
            onChange={updateEnc}
          >
            <Chip value="affordable" variant="filled" disabled={unreg}>
              Restricted
            </Chip>
            <Chip value="market" variant="filled" disabled={unreg}>
              Unrestricted
            </Chip>
          </Chip.Group>
        </Stack>
    )
  }

  export default EncumberedSelect;