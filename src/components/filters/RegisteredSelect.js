import { SegmentedControl, Stack, Text } from "@mantine/core";
import { useContext } from "react";
import { mapContext } from "../../context/mapContext";
import FilterInfo from "./FilterInfo";

export const RegisteredSelect = () => {
  const { setRegValue, regValue, setUnreg, setSearchParams } = useContext(mapContext);
  
  function updateReg(regValue) {
    if (regValue === "unregistered") {
      setUnreg(true);
    } else {
      setUnreg(false);
    }
    setSearchParams({ reg: regValue });
    setRegValue(regValue);
  }

  return (
    <Stack spacing="xs">
      <Text span fz="sm">
        Registration status{" "}
        <FilterInfo infoText="Does the address have units registered with the City of Culver City?" />
      </Text>
      <SegmentedControl
        value={regValue}
        onChange={updateReg}
        data={[
          { label: "Registered", value: "registered" },
          { label: "Unregistered", value: "unregistered" },
        ]}
      />
    </Stack>
  );
};

export default RegisteredSelect;