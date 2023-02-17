import React, { useContext, useEffect, useRef } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line
import "mapbox-gl/dist/mapbox-gl.css";
//import styled from "@emotion/styled";
import { mapContext } from "../context/mapContext";
import { Popup } from "./Popup";
import PopupContent from "./PopupContent";
import { Container } from "@mantine/core";
import { createSearchParams, Route, Routes, useNavigate, useSearchParams } from "react-router-dom";


const Map = ({ className }) => {
  const { map, mapFilter, popupAddress, forceStatsUpdate, popupFromClick, setStyleLoaded } =
    useContext(mapContext);
  const eventsSet = useRef(false);
  const mapContainer = useRef(null);
  const onClickSet = useRef(false);
  const navigate = useNavigate();
  const [reactSearchParams] = useSearchParams();
  const previousClick = useRef();

  function onPopupClose() {
    navigate({
      pathname:"",
      search:createSearchParams(reactSearchParams).toString()
    });
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
    if (onClickSet.current) {
        map.current.off("click", previousClick.current);
    }

    onClickSet.current = true;
    previousClick.current = (event) => popupFromClick(event);

    map.current.on("click", previousClick.current);
    // eslint-disable-next-line
  }, [mapFilter]);

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
        data: "https://hughfitzgerald.github.io/cc-rentals/ccrr-flat-20230215-201853.json",
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
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
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

      map.current.addControl(new mapboxgl.NavigationControl());
    });

    map.current.on("sourcedata", () => {
      if (
        "units" in map.current.getStyle().sources &&
        map.current.isSourceLoaded("units")
      ) {
        forceStatsUpdate();
        setStyleLoaded(true);
      }
    });
    map.current.on("zoomend", () => forceStatsUpdate());
    map.current.on("moveend", () => forceStatsUpdate());
  });
  

  return (
    <>
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/:slug" element={
      <Popup onClose={onPopupClose} opened={true}>
        <PopupContent />
      </Popup>
        } />
      </Routes>
      <Container
        fluid
        ref={(el) => (mapContainer.current = el)}
        className={className}
      />
    </>
  );
};

export default Map;
