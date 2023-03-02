import { Chip, Divider, Group, Stack } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { mapContext, mapDispatchContext } from "../../context/mapContext";
import FilterInfo from "./FilterInfo";

export const VacancySelect = () => {
    const { defVacancy, searchParams, reactSearchParams } = useContext(mapContext);
    const { setSearchParams } = useContext(mapDispatchContext);
    const [vacancyValues, setVacancyValues] = useState(defVacancy);
    
    function updateVacancy(vacancyValues) {
      if (!vacancyValues.length) {
        setSearchParams({ vac: ["none"] });
      } else {
        setSearchParams({ vac: vacancyValues });
      }
      setVacancyValues(vacancyValues);
    }

    useEffect(() => {
      setVacancyValues(searchParams["vac"]);
      //eslint-disable-next-line
    }, [reactSearchParams]);
  
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
          <Chip value="rented" variant="filled">
            Rented
          </Chip>
          <Chip value="vacant" variant="filled">
            Vacant
          </Chip>
        </Chip.Group>
      </Stack>
    );
  };

  export default VacancySelect;