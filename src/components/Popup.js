import { Drawer, Dialog } from "@mantine/core";

const PopupDrawer = ({ children, onClose, opened }) => {
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
      zIndex={5}
    >
      {children}
    </Drawer>
  );
};

const PopupDialog = ({ children, onClose, opened }) => {
  return (
    <Dialog
      opened={opened}
      withCloseButton
      onClose={onClose}
      size={1000}
      styles={{ root: { height: 280 } }}
    >
      {children}
    </Dialog>
  );
};

export { PopupDrawer, PopupDialog };
