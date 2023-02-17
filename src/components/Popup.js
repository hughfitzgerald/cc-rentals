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
      size={1000}
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
    if(slugReady) popupFromSlug(slug);
  }, [slug, popupFromSlug, slugReady]);

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
