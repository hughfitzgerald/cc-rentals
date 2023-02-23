import { Drawer, Dialog, createStyles, LoadingOverlay } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { mapContext } from "../context/mapContext";

const useStyles = createStyles((theme) => ({
  drawer: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  dialog: {
    height: 280,
    width: 1180,
    
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  }
}));

const PopupDrawer = ({ children, onClose, loading }) => {
  const { classes } = useStyles();
  return (
    <Drawer
      opened
      withCloseButton
      onClose={onClose}
      padding="xs"
      position="bottom"
      trapFocus={false}
      closeOnClickOutside={false}
      withOverlay={false}
      className={classes.drawer}
    >
      <LoadingOverlay visible={loading}/>
      {children}
    </Drawer>
  );
};

const PopupDialog = ({ children, onClose, loading }) => {
  const { classes } = useStyles();
  return (
    <Dialog
      opened
      withCloseButton
      onClose={onClose}
      className={classes.dialog}
    >
      <LoadingOverlay visible={loading}/>
      {children}
    </Dialog>
  );
};

const Popup = ({ children, onClose }) => {
  const { slug } = useParams();
  const { popupFromSlug, map, styleLoaded } = useContext(mapContext);
  const [ slugReady, setSlugReady ] = useState(false);

  // eslint-disable-next-line
  useEffect(() => {
    if (styleLoaded && !slugReady) {
      var features = map.current.querySourceFeatures("units", {
        sourceLayer: "ccrr-units-geojson",
        filter: [
          "in",
          ["literal", slug],
          ["get", "slug"],
        ]
      });
      if (features.length) setSlugReady(true);
    } 
  });

  useEffect(() => {
    if(slugReady) {
      popupFromSlug(slug);
    }
    // TODO:
    // if popupFromSlug is in dependency array, the function gets called 1 billion times while a popup is showing (fuck that!)
    // if popupFromSlug is NOT in the dependency array, when you load a URL that has a slug in it, the address doesn't get selected in the map...
    // possible FIX: figure out what is causing popupFromSlug to update 1 billion times!!!!
    // mapFilter is the problem!!! mapFilter is being constantly updated!!! why?!?!?!
  }, [slug, slugReady, popupFromSlug]);

  return (
    <>
        <PopupDialog
          children={children}
          onClose={onClose}
          loading={!slugReady}
        />
        <PopupDrawer
          children={children}
          onClose={onClose}
          loading={!slugReady}
        />
    </>
  );
};

export { Popup };
