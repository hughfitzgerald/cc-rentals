import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  forwardRef,
} from "react";
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
import { IconInfoSquare } from "@tabler/icons-react";

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
    <IconInfoSquare
      ref={ref}
      size={16} // set custom `width` and `height`
      color="black" // set `stroke` color
      stroke={2} // set `stroke-width`
    />
  </span>
));

const FilterInfo = ({infoText}) => {
  return (
    <HoverCard shadow="md" position="top-start">
      <HoverCard.Target>
        <InfoIcon />
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">
          {infoText}
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export const RentalFilters = () => {
  const { classes } = useStyles();
  const { runFilters, setUnreg, unreg } = useContext(mapContext);
  const [vacancyValues, setVacancyValues] = useState(["rented", "vacant"]);
  const [regValue, setRegValue] = useState("registered");
  const [rentValue, setRentValue] = useState([0, 10000]);
  const [bedsValues, setBedsValues] = useState(["0", "1", "2", "3", "4", "5"]);
  const [encValues, setEncValues] = useState(["affordable", "market"]);
  const styleLoaded = useRef(false);

  useEffect(() => {
    if (!styleLoaded.current) {
      runFilters(vacancyValues, rentValue, bedsValues, regValue, encValues);
      styleLoaded.current = true;
    }
  }, [runFilters, vacancyValues, rentValue, bedsValues, regValue, encValues]);

  function updateBeds(bedsValues) {
    setBedsValues(bedsValues);
    runFilters(vacancyValues, rentValue, bedsValues, regValue, encValues);
  }

  function updateEnc(encValues) {
    setEncValues(encValues);
    runFilters(vacancyValues, rentValue, bedsValues, regValue, encValues);
  }

  function updateRent(rentValue) {
    setRentValue(rentValue);
    runFilters(vacancyValues, rentValue, bedsValues, regValue, encValues);
  }

  function updateVacancy(vacancyValues) {
    setVacancyValues(vacancyValues);
    runFilters(vacancyValues, rentValue, bedsValues, regValue, encValues);
  }

  function updateReg(regValue) {
    setRegValue(regValue);
    if (regValue === "unregistered") {
      setUnreg(true);
    } else {
      setUnreg(false);
    }
    runFilters(vacancyValues, rentValue, bedsValues, regValue, encValues);
  }
  return (
    <Stack>
      <Stack spacing="xs">
        <Text fz="sm">Registration status{" "}
          <FilterInfo infoText="Does the address have units registered with the City of Culver City?" /></Text>
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
        <Text fz="sm">Vacancy status{" "}
          <FilterInfo infoText="Is the unit vacant as of the reporting date?" /></Text>
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
        <Text fz="sm">Number of bedrooms{" "}
          <FilterInfo infoText="How many bedrooms are included in the unit?" /></Text>
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
        <Text fz="sm">Rent{" "}
          <FilterInfo infoText="What is the most recent monthly rent reported by the landlord?" /></Text>
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
