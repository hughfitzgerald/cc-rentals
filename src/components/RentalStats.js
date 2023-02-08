import React, { useContext } from "react";
import { Stack, Text, Group } from "@mantine/core";
import { mapContext } from "../context/mapContext";

export const RentalStats = () => {
  const { avgRent, minRent, maxRent, totalUnits } = useContext(mapContext);
  const ar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(avgRent);
  const mnr = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(minRent);
  const mxr = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(maxRent);
  const tu = new Intl.NumberFormat("en-US").format(totalUnits)
  return (
    <Stack>
      <Group position="center">
        <Stack align="center" spacing="xs">
          <Text fz="xl" fw={700}>
            {tu}
          </Text>
          <Text fz="sm">Rental Units</Text>
        </Stack>
        <Stack align="center" spacing="xs">
          <Text fz="xl" fw={700}>
            {ar}
          </Text>
          <Text fz="sm">Average Rent</Text>
        </Stack>
      </Group>
      <Group position="center">
        <Stack align="center" spacing="xs">
          <Text fz="lg" fw={500}>
            {mnr}
          </Text>
          <Text fz="xs">Lowest Rent</Text>
        </Stack>
        <Stack align="center" spacing="xs">
          <Text fz="lg" fw={500}>
            {mxr}
          </Text>
          <Text fz="xs">Highest Rent</Text>
        </Stack>
      </Group>
    </Stack>
  );
};

export default RentalStats;
