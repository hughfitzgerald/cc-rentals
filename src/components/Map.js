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
  const { map, calculateStats, mapFilter, newPopup, popupAddress } = useContext(mapContext);
  const eventsSet = useRef(false);
  const mapContainer = useRef(null);

  function onPopupClose() {
    setOpened(false);
    popupAddress.current = null;
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
        data: "https://hughfitzgerald.github.io/cc-rentals/ccrr-flat-20230207-162635.json",
      });

      // Add a new layer with dots for the units.
      map.current.addLayer({
        id: "ccrr-units-geojson",
        source: "units",
        filter: mapFilter.current,
        layout: {
          visibility: "visible",
        },
        type: "circle",
      });
    });

    map.current.on("sourcedata", () => {
      if (
        "units" in map.current.getStyle().sources &&
        map.current.isSourceLoaded("units")
      )
        calculateStats();
    });
    map.current.on("zoomend", () => calculateStats());
    map.current.on("moveend", () => calculateStats());

    map.current.on("click", "ccrr-units-geojson", (event) => {
      if (newPopup(event)) setOpened(true);
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
