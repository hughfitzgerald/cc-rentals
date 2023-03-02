import { Chip, Divider, Group, Stack, } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { mapContext, mapDispatchContext } from "../../context/mapContext";
import FilterInfo from "./FilterInfo";

export const EncumberedSelect = () => {
    const { defEnc, searchParams, reactSearchParams } = useContext(mapContext);
    const { setSearchParams } = useContext(mapDispatchContext);
    const [encValues, setEncValues] = useState(defEnc);
  
    function updateEnc(encValues) {
      if (!encValues.length) {
        setSearchParams({ enc: ["none"] });
      } else {
        setSearchParams({ enc: encValues });
      }
  
      setEncValues(encValues);
    }

    useEffect(() => {
      setEncValues(searchParams["enc"]);
      //eslint-disable-next-line
    }, [reactSearchParams]);
  
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
            <Chip value="affordable" variant="filled">
              Restricted
            </Chip>
            <Chip value="market" variant="filled">
              Unrestricted
            </Chip>
          </Chip.Group>
        </Stack>
    )
  }

  export default EncumberedSelect;