import { Chip, Stack, Text } from "@mantine/core";
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
        <Text fz="sm">
          Vacancy status{" "}
          <FilterInfo infoText="Is the unit vacant as of the reporting date?" />
        </Text>
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