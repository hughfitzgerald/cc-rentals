import { createStyles, Divider, Group, NumberInput, RangeSlider, Stack } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { mapContext, mapDispatchContext } from "../../context/mapContext";
import FilterInfo from "./FilterInfo";

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
  
  export const RentSelect = () => {
    const { defRent, searchParams, reactSearchParams } = useContext(mapContext);
    const { setSearchParams } = useContext(mapDispatchContext);
    const [rentValue, setRentValue] = useState(defRent);
    const { classes } = useStyles();
  
    function updateRent(rentValue) {
      setSearchParams({ rent: rentValue });
      setRentValue(rentValue);
    }

    useEffect(() => {
      setRentValue(searchParams["rent"]);
      //eslint-disable-next-line
    }, [reactSearchParams]);
  
    return (
      <Stack spacing="xs">
          <Group position="apart">
            Monthly Rent <FilterInfo infoText="What is the most recent monthly rent reported by the landlord?" />
          </Group>
          <Divider />
          <Group noWrap>
            <NumberInput
              value={rentValue[0]}
              onChange={(e) => updateRent([e, rentValue[1]])}
              step={100}
              min={0}
              max={10000}
              hideControls
              classNames={{ input: classes.input, label: classes.label }}
              parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
              formatter={(v) =>
                !Number.isNaN(parseFloat(v))
                  ? `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
              parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
              formatter={(v) =>
                !Number.isNaN(parseFloat(v))
                  ? `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
            showLabelOnHover={false}
            label={null}
          />
        </Stack>
    )
  }

  export default RentSelect;