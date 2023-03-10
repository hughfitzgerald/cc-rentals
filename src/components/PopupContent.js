import React, { useState, useEffect, useContext, forwardRef } from "react";
import { DataTable } from "mantine-datatable";
import {
  Text,
  Box,
  useMantineTheme,
  Group,
  Button,
  Stack,
  createStyles,
  ThemeIcon,
  HoverCard,
  //Modal,
  //ActionIcon,
} from "@mantine/core";
import sortBy from "lodash/sortBy";
import { mapContext } from "../context/mapContext.js";
import { useMediaQuery } from "@mantine/hooks";
import { Link, useLocation } from "react-router-dom";
import {
  IconArrowBadgeDown,
  IconArrowBadgeUp,
  IconArrowNarrowLeft,
  IconInfoCircle,
} from "@tabler/icons-react";
//import styled from "@emotion/styled";

const MOBILE_WIDTH = "calc(100% - 23px)";

const useStyles = createStyles((theme) => ({
  popupBox: {
    [theme.fn.largerThan("sm")]: {
      //height: 270,
      //width: 1125,
      height: "calc(100% + 2px)",
      width: MOBILE_WIDTH,
    },
  },

  rcText: {
    color:
      theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.black,
  },
}));

const PopupOwner = ({ popupMultipleOwners, popupOwner }) => {
  const theme = useMantineTheme();
  const mediaQuery = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);

  if (popupMultipleOwners.current) {
    if (mediaQuery) {
      return (
        <Text>Multiple owners – See table for unit ownership details</Text>
      );
    } else {
      return <Text>Multiple owners</Text>;
    }
  } else {
    return (
      <Box sx={{maxWidth: MOBILE_WIDTH}}>
      <Text truncate>
        Owner: <b>{popupOwner.current}</b>
      </Text>
      </Box>
    );
  }
};

export default function PopupContent() {
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "unit",
    direction: "asc",
  });
  const { popupAddress, popupUnits, popupOwner, popupMultipleOwners } =
    useContext(mapContext);
  const [sortedRecords, setRecords] = useState(sortBy(popupUnits, "unit"));
  const theme = useMantineTheme();
  const mediaQuery = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);
  const { classes } = useStyles();
  const { search } = useLocation();

  useEffect(() => {
    const data = sortBy(popupUnits, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
  }, [sortStatus, popupUnits]);

  const essential_columns = [
    {
      accessor: "unit",
      sortable: true,
      render: ({ unit }) => {
        return <Link to={unit.toString().concat(search)}>{unit}</Link>;
      },
    },
    {
      accessor: "rent",
      render: ({ rent }) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(rent),
      sortable: true,
    },
    {
      accessor: "rentdate",
      title: "Rent Reported On",
      sortable: true,
    },
  ];
  const extra_columns = [
    {
      accessor: "beds",
      sortable: true,
    },
    {
      accessor: "baths",
      sortable: true,
    },
    {
      accessor: "built",
      title: "Year Built",
      sortable: true,
    },
    {
      accessor: "encumbered",
      title: "Restricted Unit",
      sortable: true,
    },
    {
      accessor: "status",
      title: "Vacancy Status",
      sortable: true,
    },
  ];

  const owner_columns = [
    {
      accessor: "owner",
      title: "Owner",
      sortable: true,
    },
  ];

  return (
    <Stack className={classes.popupBox}>
      <Group position="apart">
        <Text fw={700}>{popupAddress.current}</Text>
        <PopupOwner
          popupOwner={popupOwner}
          popupMultipleOwners={popupMultipleOwners}
        />
      </Group>
      <DataTable
        styles={(theme) => ({
          root: {
            height: mediaQuery ? "100%" : "calc(50vh - 150px)",
          },
        })}
        withBorder
        borderRadius="sm"
        withColumnBorders
        striped
        highlightOnHover
        idAccessor="unit"
        noRecordsText="No rent information available."
        shadow="sm"
        records={sortedRecords}
        columns={
          !mediaQuery
            ? essential_columns
            : !popupMultipleOwners.current
            ? essential_columns.concat(extra_columns)
            : essential_columns.concat(extra_columns).concat(owner_columns)
        }
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        rowStyle={({ unit_problem }) =>
          unit_problem ? { color: "#FA5639" } : undefined
        }
      />
    </Stack>
  );
}

export function Unit() {
  const { popupAddress, unitData, unitRents } = useContext(mapContext);
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "rentdate",
    direction: "desc",
  });
  const [sortedRecords, setRecords] = useState(sortBy(unitRents, "rentdate"));
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const mediaQuery = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);
  const { search } = useLocation();
  //const [opened, { open, close }] = useDisclosure(false);
  //const [infoModalText, setInfoModalText] = useState('');

  /*
  function openModal(infoText) {
    setInfoModalText(infoText);
    open();
  }
  */

  const RCInfo = ({ infoText }) => {
    const InfoIcon = forwardRef((props, ref) => (
      <ThemeIcon variant="outline" ref={ref} {...props}>
        <IconInfoCircle
          ref={ref}
          size={16} // set custom `width` and `height`
        />
      </ThemeIcon>
    ));

    return (
      <HoverCard shadow="md" width={300} withinPortal>
        <HoverCard.Target sx={{ cursor: "help" }}>
          <InfoIcon />
        </HoverCard.Target>
        <HoverCard.Dropdown>{infoText}</HoverCard.Dropdown>
      </HoverCard>
    );

    //return (<ActionIcon onClick={() => openModal(infoText)}><InfoIcon /></ActionIcon>)
  };

  useEffect(() => {
    const data = sortBy(unitRents, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
  }, [sortStatus, unitRents]);

  const hist_columns = [
    {
      accessor: "rentdate",
      title: "Date Reported",
      sortable: true,
    },
    {
      accessor: "rent",
      title: "Rent Amount",
      sortable: true,
      render: ({ rent }) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(rent),
    },
  ];

  const perc_columns = [
    {
      accessor: "perc_increase",
      title: "% Change",
      sortable: true,
      render: ({
        perc_increase,
        date_problem,
        PastRentReportDate_y,
        cumulative_increase,
        threshold,
        rentdate,
      }) => {
        if (perc_increase == null) return "";
        const number = Number(perc_increase).toLocaleString(undefined, {
          style: "percent",
          minimumFractionDigits: 2,
        });
        var numberArrow = <></>;
        const infoText = (
          <Stack className={classes.rcText}>
            <Text>
              This rent increase represents a cumulative increase of{" "}
              <b>
                {Number(cumulative_increase).toLocaleString(undefined, {
                  style: "percent",
                  minimumFractionDigits: 2,
                })}
              </b>{" "}
              from {PastRentReportDate_y} to {rentdate}.
            </Text>
            <Text>
              On {rentdate}, the maximum allowed rent increase was only{" "}
              <b>
                {Number(threshold).toLocaleString(undefined, {
                  style: "percent",
                  minimumFractionDigits: 2,
                })}
              </b>{" "}
              under Culver City Municipal Code.
            </Text>
          </Stack>
        );
        if (perc_increase > 0) {
          const arrow = <IconArrowBadgeUp size={16} />;
          numberArrow = (
            <>
              {number}
              <Text span color="red">
                {arrow}
              </Text>
            </>
          );
        } else if (perc_increase < 0) {
          const arrow = <IconArrowBadgeDown size={16} />;
          numberArrow = (
            <>
              {number}
              <Text span color="green">
                {arrow}
              </Text>
            </>
          );
        }

        return (
          <Group position="apart" spacing="xs">
            <Text>{numberArrow}</Text>
            {date_problem ? <RCInfo infoText={infoText} /> : <></>}
          </Group>
        );
      },
    },
  ];

  if (!unitData || !unitRents) return <></>;

  // const unit_problem = unitData.unit_problem;

  // if you go back to modal, put this down below
  // <Modal opened={opened} onClose={close} withCloseButton={false} size="auto" centered>{infoModalText}</Modal>

  return (
    <>
      <Stack className={classes.popupBox}>
        <Group position="apart">
          <Box>
            <Text fw={700}>{popupAddress.current}</Text>
            <Text fw={700}>Unit: {unitData.unit}</Text>
          </Box>
          <Button
            component={Link}
            to={"../" + unitData.slug + search}
            variant="outline"
            leftIcon={<IconArrowNarrowLeft />}
          >
            Back to {popupAddress.current}
          </Button>
        </Group>
        <DataTable
          styles={(theme) => ({
            root: {
              height: mediaQuery ? "100%" : "calc(50vh - 185px)",
            },
          })}
          withBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          noRecordsText="No historical rent information available."
          shadow="sm"
          columns={hist_columns.concat(perc_columns)}
          records={sortedRecords}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          rowStyle={({ date_problem }) =>
            date_problem ? { color: "#FA5639" } : undefined
          }
        />
      </Stack>
    </>
  );
}
