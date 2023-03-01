import React, { useContext, useEffect, useRef, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line
import "mapbox-gl/dist/mapbox-gl.css";
//import styled from "@emotion/styled";
import { mapContext } from "../context/mapContext";
import { Popup } from "./Popup";
import PopupContent, { Unit } from "./PopupContent";
import {
  Box,
  Card,
  Container,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import {
  createSearchParams,
  Route,
  Routes,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useTimeout } from "@mantine/hooks";
import { RentalFiltersGrid } from "./RentalFilters";
import RentalStats from "./RentalStats";

const ClearPopup = ({ popupAddress, map }) => {
  const { styleLoaded } = useContext(mapContext);
  useEffect(() => {
    if (styleLoaded) {
      popupAddress.curent = null;
      map.current.setLayoutProperty("selected-address", "visibility", "none");
    }
    // eslint-disable-next-line
  }, []);
  return <></>;
};

const Map = ({ className, classes }) => {
  const {
    map,
    mapFilter,
    popupAddress,
    //forceStatsUpdate,
    popupFromClick,
    setStyleLoaded,
    styleLoaded,
  } = useContext(mapContext);
  const eventsSet = useRef(false);
  const { colorScheme } = useMantineColorScheme();
  const mapContainer = useRef(null);
  const onClickSet = useRef(false);
  const navigate = useNavigate();
  const [reactSearchParams] = useSearchParams();
  const previousClick = useRef();
  const previousSourceLoad = useRef();
  const onSourceLoad = useRef(false);
  const previousImageLoad = useRef();
  const [coords, setCoords] = useState("");
  const { start, clear } = useTimeout((event) => popupFromClick(event[0]), 500);
  const darkStyle = "mapbox://styles/hughfitzgerald/clenh291g000401rq8lbzjzhu";
  const lightStyle = "mapbox://styles/hughfitzgerald/cldjdvxl7000001qqfr6kpnpv";
  const darkStyleID = "hughfitzgerald/clenh291g000401rq8lbzjzhu";
  const lightStyleID = "hughfitzgerald/cldjdvxl7000001qqfr6kpnpv";

  function onPopupClose() {
    navigate({
      pathname: "",
      search: createSearchParams(reactSearchParams).toString(),
    });
  }

  useEffect(() => {
    if (map.current) return;
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaHVnaGZpdHpnZXJhbGQiLCJhIjoiY2xkZGhjaG9wMDNqdTNvdDZ5bG80OXZ3YSJ9.6njmVnJyl0zAtMnM9d8duQ";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: colorScheme === "light" ? lightStyle : darkStyle, // stylesheet location
      //style: "mapbox://styles/hughfitzgerald/clenh291g000401rq8lbzjzhu", // stylesheet location
      center: [-118.404421, 34.003097], // starting position
      zoom: 12.5, // starting zoom
    });
  }, [map, colorScheme]);

  async function switchBaseMap(styleID) {
    if (!map.current.isStyleLoaded()) return;
    const response = await fetch(
      `https://api.mapbox.com/styles/v1/${styleID}?access_token=${mapboxgl.accessToken}`
    );
    const responseJson = await response.json();
    const newStyle = responseJson;

    const currentStyle = map.current.getStyle();
    // ensure any sources from the current style are copied across to the new style
    newStyle.sources = Object.assign(
      {},
      currentStyle.sources,
      newStyle.sources
    );

    // find the index of where to insert our layers to retain in the new style
    let labelIndex = newStyle.layers.findIndex((el) => {
      return el.id === "waterway-label";
    });

    // default to on top
    if (labelIndex === -1) {
      labelIndex = newStyle.layers.length;
    }
    const appLayers = currentStyle.layers.filter((el) => {
      // app layers are the layers to retain, and these are any layers which have a different source set
      return (
        el.source &&
        el.source !== "mapbox://mapbox.satellite" &&
        el.source !== "mapbox" &&
        el.source !== "composite"
      );
    });
    newStyle.layers = [
      ...newStyle.layers.slice(0, labelIndex),
      ...appLayers,
      ...newStyle.layers.slice(labelIndex, -1),
    ];
    map.current.setStyle(newStyle);
  }

  useEffect(() => {
    if (colorScheme === "light") {
      switchBaseMap(lightStyleID);
    } else {
      switchBaseMap(darkStyleID);
    }

    if (previousImageLoad.current) {
      map.current.off(previousImageLoad.current);
    }
    previousImageLoad.current = () => {
      map.current.loadImage(
        "https://hughfitzgerald.github.io/cc-rentals/building_blue.png",
        (error, image) => {
          if (error) throw error;

          if (map.current.hasImage("custom-marker")) {
            return;
          }
          map.current.addImage("custom-marker", image);
        }
      );
    };
    map.current.on("styleimagemissing", previousImageLoad.current);
    // eslint-disable-next-line
  }, [colorScheme]);

  useEffect(() => {
    if (!map.current) return;
    if (onClickSet.current) {
      map.current.off("click", previousClick.current);
    }

    onClickSet.current = true;
    previousClick.current = (event) => start(event);

    map.current.on("click", previousClick.current);
    // eslint-disable-next-line
  }, [mapFilter]);

  useEffect(() => {
    if (!map.current) return;
    if (onSourceLoad.current) {
      map.current.off("sourcedata", previousSourceLoad.current);
    }

    onSourceLoad.current = true;
    previousSourceLoad.current = () => {
      if (
        map.current.isStyleLoaded() &&
        "units" in map.current.getStyle().sources &&
        map.current.isSourceLoaded("units")
      ) {
        //forceStatsUpdate();
        setStyleLoaded(true);
      }
    };

    map.current.on("sourcedata", previousSourceLoad.current);
    // eslint-disable-next-line
  }, [styleLoaded]);

  useEffect(() => {
    if (!map.current) return;

    if (eventsSet.current) {
      return;
    } else {
      eventsSet.current = true;
    }

    map.current.on("load", () => {
      if (map.current.getSource("units")) return;

      // Add a data source containing GeoJSON data.
      map.current.addSource("units", {
        type: "geojson",
        data: "https://hughfitzgerald.github.io/cc-rentals/ccrr-geo-20230228-094102.json",
      });

      // Add a new layer with dots for the units.
      map.current.addLayer({
        id: "ccrr-units-geojson",
        source: "units",
        filter: mapFilter,
        layout: {
          visibility: "visible",
        },
        type: "circle",
        paint: {
          "circle-radius": 4,
          "circle-color": "rgba(0, 0, 0, .75)",
        },
      });

      map.current.loadImage(
        "https://hughfitzgerald.github.io/cc-rentals/building_blue.png",
        (error, image) => {
          if (error) throw error;
          map.current.addImage("custom-marker", image);
          // Add a GeoJSON source with 2 points

          // Add a symbol layer
          map.current.addLayer({
            id: "selected-address",
            type: "symbol",
            source: "units",
            layout: {
              visibility: "none",
              "icon-image": "custom-marker",
              // get the title name from the source's "title" property
              "text-field": ["get", "address"],
              //"text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-font": ["DIN Pro Medium", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
            paint: {
              "text-color": "#07748c",
              "text-halo-width": 2,
              "text-halo-color": "#ffffff",
              "text-halo-blur": 1,
            },
          });
        }
      );

      map.current.on("dblclick", (e) => clear());

      /*
      // TODO: Would love to add these back in if I could fix the mouse events... they're off by 16 pixels in the x direction!
      map.current.on('mouseenter', 'ccrr-units-geojson', () => {
        map.current.getCanvas().style.cursor = 'pointer'
      })
      map.current.on('mouseleave', 'ccrr-units-geojson', () => {
        map.current.getCanvas().style.cursor = ''
      })
      */
      map.current.on("mousemove", (e) => {
        setCoords(e.point.x.toString() + ", " + e.point.y.toString());
      });

      map.current.addControl(new mapboxgl.NavigationControl());

      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
        })
      );
    });
    //map.current.on("zoomend", () => forceStatsUpdate());
    //map.current.on("moveend", () => forceStatsUpdate());
  });

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<ClearPopup popupAddress={popupAddress} map={map} />}
        />
        <Route
          path="/:slug"
          element={
            <Popup onClose={onPopupClose} opened={true}>
              <PopupContent />
            </Popup>
          }
        />
        <Route
          path="/:slug/:unit"
          element={
            <Popup onClose={onPopupClose} opened={true}>
              <Unit />
            </Popup>
          }
        />
      </Routes>
      <Container
        fluid
        ref={(el) => (mapContainer.current = el)}
        className={className}
      />

      <Box className={classes.filters}>
        <RentalFiltersGrid />
      </Box>

      <Card className={classes.stats} p="md" withBorder shadow="sm">
        <RentalStats />
      </Card>

      <Title sx={{ position: "absolute", top: 70, left: 310, display: "none" }}>
        {coords}
      </Title>
    </>
  );
};

export default Map;
