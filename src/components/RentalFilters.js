import {
  Stack,
} from "@mantine/core";
import VacancySelect from "./filters/VacancySelect";
import EncumberedSelect from "./filters/EncumberedSelect";
import OwnerSelect from "./filters/OwnerSelect";
import BedsSelect from "./filters/BedsSelect";
import RentSelect from "./filters/RentSelect";

export const RentalFilters = () => {
  return (
    <Stack>
      <VacancySelect />
      <EncumberedSelect />
      <BedsSelect />
      <RentSelect />
      <OwnerSelect />
    </Stack>
  );
};

export default RentalFilters;
