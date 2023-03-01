import { Burger, createStyles, Paper, Space, Title, Transition } from "@mantine/core";
import { IconBuildingEstate } from "@tabler/icons-react";


const useStyles = createStyles((theme) => ({
    dropdown: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 6,
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
      borderTopWidth: 0,
      overflow: "hidden",
  
      [theme.fn.largerThan("sm")]: {
        display: "none",
      },
    },
  
    burger: {
      position: "absolute",
      top: 10,
      left: 10,
      right: 0,
      zIndex: 7,
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
      borderTopWidth: 0,
      [theme.fn.largerThan("sm")]: {
        display: "none",
      },
      [theme.fn.smallerThan("sm")]: {
        display: "none",
      },
    },
  }));

export const MobileMenu = ({opened, toggle, filters}) => {
    const { classes } = useStyles();
  return (
    <>
      <Burger
        opened={opened}
        onClick={toggle}
        className={classes.burger}
        size="sm"
      />

      <Transition transition="pop-top-left" duration={200} mounted={opened}>
        {(styles) => (
          <div>
            <Paper className={classes.dropdown} withBorder style={styles}>
              <Space h="md" />
              <Title order={2} align="center">
                <IconBuildingEstate /> Culver City Rental Registry
              </Title>

              {filters}
            </Paper>
          </div>
        )}
      </Transition>
    </>
  );
};
