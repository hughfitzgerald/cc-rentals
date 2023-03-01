import { Chip, Divider, Group, Stack } from "@mantine/core";
import { useContext } from "react";
import { mapContext } from "../../context/mapContext";
import FilterInfo from "./FilterInfo";

export const VacancySelect = () => {
    const { setVacancyValues, vacancyValues, unreg, setSearchParams } = useContext(mapContext);
    
    function updateVacancy(vacancyValues) {
      if (!vacancyValues.length) {
        setSearchParams({ vac: ["none"] });
      } else {
        setSearchParams({ vac: vacancyValues });
      }
      setVacancyValues(vacancyValues);
    }
  
    return (
      <Stack spacing="xs">
        <Group position="apart">
          Vacancy Status <FilterInfo infoText="Is the unit vacant as of the reporting date?" />
          </Group>
          <Divider />
        <Chip.Group
          position="center"
          multiple
          mt={15}
          value={vacancyValues}
          onChange={updateVacancy}
        >
          <Chip value="rented" variant="filled" disabled={unreg}>
            Rented
          </Chip>
          <Chip value="vacant" variant="filled" disabled={unreg}>
            Vacant
          </Chip>
        </Chip.Group>
      </Stack>
    );
  };

  export default VacancySelect;