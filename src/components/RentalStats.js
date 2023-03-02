import React, { useContext } from "react";
import { Stack, Text, Group } from "@mantine/core";
import { mapContext } from "../context/mapContext";

const BigRentalStatBlock = ({ label, value }) => {
  return (
    <Stack align="center" spacing="xs">
      <Text fz="xl" fw={700} align="center">
        {value}
      </Text>
      <Text fz="sm" align="center">
        {label}
      </Text>
    </Stack>
  );
};

const SmallRentalStatBlock = ({ label, value }) => {
  return (
    <Stack align="center" spacing="xs">
      <Text fz="lg" fw={500} align="center">
        {value}
      </Text>
      <Text fz="xs" align="center">
        {label}
      </Text>
    </Stack>
  );
};

const RentalStats = () => {
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
  const tu = new Intl.NumberFormat("en-US").format(totalUnits);

  return (
    <Stack>
      <Group position="center">
        <BigRentalStatBlock label="Rental Units" value={tu} />
        <BigRentalStatBlock label="Average Rent" value={ar} />
      </Group>
      <Group position="center">
        <SmallRentalStatBlock label="Lowest Rent" value={mnr} />
        <SmallRentalStatBlock label="Highest Rent" value={mxr} />
      </Group>
    </Stack>
  );
};

export default RentalStats;
