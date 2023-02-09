import React, { useContext, useEffect, useRef, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line
import "mapbox-gl/dist/mapbox-gl.css";
import styled from "@emotion/styled";
import { mapContext } from "../context/mapContext";
import { PopupDialog } from "./Popup";
import PopupContent from "./PopupContent";

const StyledContainer = styled.div`
  width: 100%;
  min-width: 600px;
  height: calc(100vh - 100px);
`;

const Map = () => {
  const [opened, setOpened] = useState(false);
  const { map, mapFilter, newPopup, popupAddress, forceStatsUpdate } =
    useContext(mapContext);
  const eventsSet = useRef(false);
  const mapContainer = useRef(null);

  function onPopupClose() {
    setOpened(false);
    popupAddress.current = null;
    map.current.setLayoutProperty("selected-address", "visibility", "none");
  }

  useEffect(() => {
    if (map.current) return;
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaHVnaGZpdHpnZXJhbGQiLCJhIjoiY2xkZGhjaG9wMDNqdTNvdDZ5bG80OXZ3YSJ9.6njmVnJyl0zAtMnM9d8duQ";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/hughfitzgerald/cldjdvxl7000001qqfr6kpnpv", // stylesheet location
      center: [-118.404421, 34.003097], // starting position
      zoom: 12.5, // starting zoom
    });
  }, [map]);

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
        data: "https://hughfitzgerald.github.io/cc-rentals/ccrr-flat-20230209-135513.json",
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
      });

      map.current.addLayer({
        id: "selected-address",
        source: "units",
        layout: {
          visibility: "none",
        },
        type: "circle",
        paint: {
          "circle-radius": 2,
          "circle-color": "#fbb03b",
        },
      });

      map.current.loadImage(
        "https://hughfitzgerald.github.io/cc-rentals/building.png",
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
              "icon-image": "custom-marker",
              // get the title name from the source's "title" property
              "text-field": ["get", "address"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });
        }
      );

      /*
      map.current.addLayer({
        id: "selected-address",
        source: "units",
        layout: {
          visibility: "none",
        },
        type: "circle",
        paint: {
          "circle-radius": 2,
          "circle-color": "#fbb03b"
        }
      });
      */
    });

    map.current.on("sourcedata", () => {
      if (
        "units" in map.current.getStyle().sources &&
        map.current.isSourceLoaded("units")
      )
        forceStatsUpdate();
    });
    map.current.on("zoomend", () => forceStatsUpdate());
    map.current.on("moveend", () => forceStatsUpdate());

    map.current.on("click", "ccrr-units-geojson", (event) => {
      if (newPopup(event)) {
        setOpened(true);
      }
    });
  });

  return (
    <>
      <PopupDialog onClose={onPopupClose} opened={opened}>
        <PopupContent />
      </PopupDialog>
      <StyledContainer ref={(el) => (mapContainer.current = el)} />
    </>
  );
};

export default Map;
