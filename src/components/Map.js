import React, { useContext, useEffect, useRef, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line
import "mapbox-gl/dist/mapbox-gl.css";
//import styled from "@emotion/styled";
import { mapContext } from "../context/mapContext";
import { Popup } from "./Popup";
import PopupContent from "./PopupContent";
import { Container, Title } from "@mantine/core";
import { createSearchParams, Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import { useTimeout } from "@mantine/hooks";

const ClearPopup = ({ popupAddress, map }) => {
  const { styleLoaded } = useContext(mapContext);
  useEffect(() => {
    if(styleLoaded) {
      popupAddress.curent = null;
      map.current.setLayoutProperty("selected-address", "visibility", "none");
    }
    // eslint-disable-next-line
  }, []);
  return (<></>)
}

const Map = ({ className }) => {
  const { map, mapFilter, popupAddress, forceStatsUpdate, popupFromClick, setStyleLoaded } =
    useContext(mapContext);
  const eventsSet = useRef(false);
  const mapContainer = useRef(null);
  const onClickSet = useRef(false);
  const navigate = useNavigate();
  const [reactSearchParams] = useSearchParams();
  const previousClick = useRef();
  const [coords, setCoords] = useState("");
  const { start, clear } = useTimeout((event) => popupFromClick(event[0]), 500);

  function onPopupClose() {
    navigate({
      pathname:"",
      search:createSearchParams(reactSearchParams).toString()
    });
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
    previousClick.current = (event) => start(event);

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
        data: "https://hughfitzgerald.github.io/cc-rentals/ccrr-flat-20230222-105448.json",
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
      map.current.on('mousemove', (e) => {
        setCoords(e.point.x.toString() + ", " + e.point.y.toString());
      })

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
        <Route path="/" element={<ClearPopup popupAddress={popupAddress} map={map} />} />
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
      
      <Title sx = {{position:"absolute", top: 70, left: 310, display:"none"}}>{coords}</Title>
    </>
  );
};

export default Map;
