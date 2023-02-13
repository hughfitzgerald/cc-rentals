import { Drawer, Dialog, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  drawer: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  dialog: {
    height: 280,
    
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  }
}));

const PopupDrawer = ({ children, onClose, opened }) => {
  const { classes } = useStyles();
  return (
    <Drawer
      opened={opened}
      withCloseButton
      onClose={onClose}
      padding="xs"
      position="bottom"
      trapFocus={false}
      closeOnClickOutside={false}
      withOverlay={false}
      className={classes.drawer}
    >
      {children}
    </Drawer>
  );
};

const PopupDialog = ({ children, onClose, opened }) => {
  const { classes } = useStyles();
  return (
    <Dialog
      opened={opened}
      withCloseButton
      onClose={onClose}
      size={1000}
      className={classes.dialog}
    >
      {children}
    </Dialog>
  );
};

const Popup = ({ children, onClose, opened }) => {
  return (
    <>
        <PopupDialog
          children={children}
          onClose={onClose}
          opened={opened}
        />
        <PopupDrawer
          children={children}
          onClose={onClose}
          opened={opened}
        />
    </>
  );
};

export { Popup };
