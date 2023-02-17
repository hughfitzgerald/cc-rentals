import React, { useContext, forwardRef } from "react";
import {
  createStyles,
  RangeSlider,
  Chip,
  NumberInput,
  Stack,
  Text,
  Group,
  SegmentedControl,
  HoverCard,
} from "@mantine/core";
import { mapContext } from "../context/mapContext";
import { IconInfoCircle } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
  },

  input: {
    height: "auto",
    //paddingTop: 22,
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

const InfoIcon = forwardRef((props, ref) => (
  <span ref={ref} {...props}>
    <Text span color="dimmed">
      <IconInfoCircle
        ref={ref}
        size={16} // set custom `width` and `height`
      />
    </Text>
  </span>
));

const FilterInfo = ({ infoText }) => {
  return (
    <HoverCard shadow="md" position="top-start">
      <HoverCard.Target>
        <InfoIcon />
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">{infoText}</Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export const RentalFilters = () => {
  const { classes } = useStyles();
  const {
    setUnreg,
    unreg,
    vacancyValues,
    setVacancyValues,
    regValue,
    setRegValue,
    rentValue,
    setRentValue,
    bedsValues,
    setBedsValues,
    encValues,
    setEncValues,
    setSearchParams
  } = useContext(mapContext);

  /*
  useEffect(() => {
    if (searchParams["reg"] === "unregistered") {
      setUnreg(true);
    } else {
      setUnreg(false);
    }
    setVacancyValues(searchParams["vac"].filter(e => e !== 'none'));
    setRegValue(searchParams["reg"]);
    setRentValue(searchParams["rent"]);
    setBedsValues(searchParams["beds"].filter(e => e !== 'none'));
    setEncValues(searchParams["enc"].filter(e => e !== 'none'));
    runFilters(vacancyValues, rentValue, bedsValues, regValue, encValues)
  }, [searchParams]);
  */

  /*
  useEffect(() => {
    if (searchParams["reg"] === "unregistered") {
      setUnreg(true);
    } else {
      setUnreg(false);
    }
    setUnreg(searchParams["reg"]);
    setVacancyValues(searchParams["vac"]);
    setRegValue(searchParams["reg"]);
    setRentValue(searchParams["rent"]);
    setBedsValues(searchParams["beds"]);
    setEncValues(searchParams["enc"]);
    runFilters(vacancyValues, rentValue, bedsValues, regValue, encValues);
  }, []); // figure out how to get this function to only run when you load the URL and not when changing the filters changes this 
  */

  function updateBeds(bedsValues) {
    if(!bedsValues.length) {
      setSearchParams({beds: ["none"]});
    } else {
      setSearchParams({beds: bedsValues});
    }
    
    setBedsValues(bedsValues);
    //runFilters(vacancyValues, rentValue, bedsValues, regValue, encValues);
  }

  function updateEnc(encValues) {
    if(!encValues.length) {
      setSearchParams({enc: ["none"]});
    } else {
      setSearchParams({enc: encValues});
    }
    
    setEncValues(encValues);
    //runFilters(vacancyValues, rentValue, bedsValues, regValue, encValues);
  }

  function updateRent(rentValue) {
    setSearchParams({ rent: rentValue });
    setRentValue(rentValue);
    //runFilters(vacancyValues, rentValue, bedsValues, regValue, encValues);
  }

  function updateVacancy(vacancyValues) {
    if(!vacancyValues.length) {
      setSearchParams({vac: ["none"]});
    } else {
      setSearchParams({vac: vacancyValues});
    }
    setVacancyValues(vacancyValues);
    //runFilters(vacancyValues, rentValue, bedsValues, regValue, encValues);
  }

  function updateReg(regValue) {
    if (regValue === "unregistered") {
      setUnreg(true);
    } else {
      setUnreg(false);
    }
    setSearchParams({ reg: regValue });
    setRegValue(regValue);
    //runFilters(vacancyValues, rentValue, bedsValues, regValue, encValues);
  }
  return (
    <Stack>
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
      <Stack spacing="xs">
        <Text fz="sm">
          Affordability restrictions{" "}
          <FilterInfo infoText="Is the unit encumbered by an income and affordable unit restriction?" />
        </Text>
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
      <Stack spacing="xs">
        <Text fz="sm">
          Number of bedrooms{" "}
          <FilterInfo infoText="How many bedrooms are included in the unit?" />
        </Text>
        <Chip.Group
          position="center"
          multiple
          mt={15}
          value={bedsValues}
          onChange={updateBeds}
        >
          <Chip value="0" variant="filled" disabled={unreg}>
            Studio
          </Chip>
          <Chip value="1" variant="filled" disabled={unreg}>
            1 Bedroom
          </Chip>
          <Chip value="2" variant="filled" disabled={unreg}>
            2 Bedroom
          </Chip>
          <Chip value="3" variant="filled" disabled={unreg}>
            3 Bedroom
          </Chip>
          <Chip value="4" variant="filled" disabled={unreg}>
            4 Bedroom
          </Chip>
          <Chip value="5" variant="filled" disabled={unreg}>
            5 Bedroom
          </Chip>
        </Chip.Group>
      </Stack>
      <Stack spacing="xs">
        <Text fz="sm">
          Rent{" "}
          <FilterInfo infoText="What is the most recent monthly rent reported by the landlord?" />
        </Text>
        <Group noWrap>
          <NumberInput
            value={rentValue[0]}
            onChange={(e) => updateRent([e, rentValue[1]])}
            step={100}
            min={0}
            max={10000}
            hideControls
            classNames={{ input: classes.input, label: classes.label }}
            disabled={unreg}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : "$ "
            }
          />
          <NumberInput
            value={rentValue[1]}
            onChange={(e) => updateRent([rentValue[0], e])}
            step={100}
            min={0}
            max={10000}
            hideControls
            classNames={{ input: classes.input, label: classes.label }}
            disabled={unreg}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : "$ "
            }
          />
        </Group>
        <RangeSlider
          value={rentValue}
          onChange={setRentValue}
          onChangeEnd={updateRent}
          min={0}
          max={10000}
          step={100}
          size={2}
          radius={0}
          className={classes.slider}
          classNames={{ thumb: classes.thumb, track: classes.track }}
          disabled={unreg}
          showLabelOnHover={false}
          label={null}
        />
      </Stack>
    </Stack>
  );
};

export default RentalFilters;
