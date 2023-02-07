import React, { useState, useContext } from "react";
import {
  createStyles,
  Navbar,
  RangeSlider,
  Checkbox,
  Chip,
  NumberInput,
  Group,
  Text,
  Title
} from "@mantine/core";
import { mapContext } from "../context/mapContext";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
  },

  input: {
    height: "auto",
    paddingTop: 22,
    paddingBottom: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },

  label: {
    position: "absolute",
    pointerEvents: "none",
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1,
  },

  slider: {},

  thumb: {
    width: 16,
    height: 16,
  },

  track: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },
}));

function runFilters(map, vacancyValues, [minRent, maxRent], bedsValues) {
  var rentValue = ["number", ["get", "rent"], -1];
  var rentValueCondition = [
    "all",
    ["<=", rentValue, maxRent],
    [">=", rentValue, minRent],
  ];

  var bedsFeature = ["to-string", ["number", ["get", "beds"], -1]];
  var bedsValueCondition = ["in", bedsFeature, ["literal", bedsValues]];

  var statusCondition = ["boolean", true];
  var vacantCondition = ["in", ["literal", "Vacant"], ["get", "status"]];
  var rentedCondition = ["in", ["literal", "Rented"], ["get", "status"]];
  var neitherCondition = [
    "all",
    ["!", vacantCondition],
    ["!", rentedCondition],
  ];
  if (vacancyValues.includes("vacant") && vacancyValues.includes("rented")) {
    statusCondition = ["boolean", true];
  } else if (vacancyValues.includes("vacant")) {
    statusCondition = vacantCondition;
  } else if (vacancyValues.includes("rented")) {
    statusCondition = rentedCondition;
  } else {
    statusCondition = neitherCondition;
  }

  var filterCondition = [
    "all",
    bedsValueCondition,
    rentValueCondition,
    statusCondition,
  ];

  map.current.setFilter("ccrr-units-geojson", filterCondition);
}

export const RentalFilters = () => {
  const { classes } = useStyles();
  const { map } = useContext(mapContext);
  const [vacancyValues, setVacancyValues] = useState(["rented", "vacant"]);
  const [rentValue, setRentValue] = useState([0, 10000]);
  const [bedsValues, setBedsValues] = useState(["0", "1", "2", "3", "4", "5"]);

  function updateBeds(bedsValues) {
    setBedsValues(bedsValues);
    runFilters(map, vacancyValues, rentValue, bedsValues);
  }

  function updateRent(rentValue) {
    setRentValue(rentValue);
    runFilters(map, vacancyValues, rentValue, bedsValues);
  }

  function updateVacancy(vacancyValues) {
    setVacancyValues(vacancyValues);
    runFilters(map, vacancyValues, rentValue, bedsValues);
  }
  return (
    <div>
      <Title order={2}>Rental Filters</Title>
      <Navbar.Section mt="xs">
        <Text fz="sm">Rental status:</Text>
        <Checkbox.Group value={vacancyValues} onChange={updateVacancy}>
          <Checkbox value="rented" label="Rented" />
          <Checkbox value="vacant" label="Vacant" />
        </Checkbox.Group>
      </Navbar.Section>
      <Navbar.Section mt="xs">
        <Text fz="sm">Number of Bedrooms:</Text>
        <Chip.Group
          position="center"
          multiple
          mt={15}
          value={bedsValues}
          onChange={updateBeds}
        >
          <Chip value="0" variant="filled">
            Studio
          </Chip>
          <Chip value="1" variant="filled">
            1 Bedroom
          </Chip>
          <Chip value="2" variant="filled">
            2 Bedroom
          </Chip>
          <Chip value="3" variant="filled">
            3 Bedroom
          </Chip>
          <Chip value="4" variant="filled">
            4 Bedroom
          </Chip>
          <Chip value="5" variant="filled">
            5 Bedroom
          </Chip>
        </Chip.Group>
      </Navbar.Section>
      <Navbar.Section mt="xs">
        <Text fz="sm">Rent:</Text>
        <Group noWrap>
          <NumberInput
            value={rentValue[0]}
            onChange={(e) => updateRent([e, rentValue[1]])}
            step={100}
            min={0}
            max={10000}
            hideControls
            classNames={{ input: classes.input, label: classes.label }}
          />
          <NumberInput
            value={rentValue[1]}
            onChange={(e) => updateRent([rentValue[0], e])}
            step={100}
            min={0}
            max={10000}
            hideControls
            classNames={{ input: classes.input, label: classes.label }}
          />
        </Group>
        <RangeSlider
          value={rentValue}
          onChange={updateRent}
          min={0}
          max={10000}
          step={100}
          marks={[
            { value: 0, label: "$0" },
            { value: 10000, label: "$10,000" },
          ]}
          size={2}
          radius={0}
          className={classes.slider}
          classNames={{ thumb: classes.thumb, track: classes.track }}
        />
      </Navbar.Section>
    </div>
  );
};

export default RentalFilters;
