import React, { createContext, useState, useRef } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line

// Create two context:
// UserContext: to query the context state
// UserDispatchContext: to mutate the context state
const mapContext = createContext(undefined);

// A "provider" is used to encapsulate only the
// components that needs the state in this context
function MapProvider({ children }) {
  const [popupContent, setPopupContent] = useState([]);
  const [avgRent, setAvgRent] = useState(null);
  const [minRent, setMinRent] = useState(null);
  const [maxRent, setMaxRent] = useState(null);
  const map = useRef(null);
  const [lngLat, setLngLat] = useState({ lng: null, lat: null });
  const [mapFilter, setFilter] = useState(["==", ["boolean", true], ["get", "registered"]]);

  const Provider = mapContext.Provider;

  function calculateStats() {
    var rentSum = 0.0;
    var rentCount = 0.0;
    var min = 10000.0;
    var max = 0.0;
    const features = map.current.queryRenderedFeatures({
      layers: ["ccrr-units-geojson"], // replace with your layer name
      filter: mapFilter
    });
    if (!features.length) return;
    features.forEach((feature) => {
      var rent = feature["properties"]["rent"];
      if (rent != null && rent < 10000) {
        rentSum += rent;
        rentCount += 1.0;
        
        if (rent > max) max = rent;
        if (rent < min) min = rent;
      }
    });
    setAvgRent(rentSum / rentCount);
    setMinRent(min);
    setMaxRent(max);
  }

  function runFilters(vacancyValues, [minRent, maxRent], bedsValues, regValue) {
    var rentValue = ["number", ["get", "rent"], -1];
    var rentValueCondition = [
      "all",
      ["<=", rentValue, maxRent],
      [">=", rentValue, minRent],
    ];
  
    var bedsFeature = ["to-string", ["number", ["get", "beds"], -1]];
    var bedsValueCondition = ["in", bedsFeature, ["literal", bedsValues]];
  
    var statusCondition = ["boolean", true];
    var vacantCondition = ["in", ["literal", "Vacant"], ["get", "status"]];
    var rentedCondition = ["in", ["literal", "Rented"], ["get", "status"]];
    var neitherCondition = [
      "all",
      ["!", vacantCondition],
      ["!", rentedCondition],
    ];
    if (vacancyValues.includes("vacant") && vacancyValues.includes("rented")) {
      statusCondition = ["boolean", true];
    } else if (vacancyValues.includes("vacant")) {
      statusCondition = vacantCondition;
    } else if (vacancyValues.includes("rented")) {
      statusCondition = rentedCondition;
    } else {
      statusCondition = neitherCondition;
    }
  
    var regCondition = ["==", ["boolean", true], ["get", "registered"]];
  
    var filterCondition;
    if (regValue === "registered") {
      filterCondition = [
        "all",
        bedsValueCondition,
        rentValueCondition,
        statusCondition,
        regCondition
      ];
    } else {
      filterCondition = ["==", ["boolean", false], ["get", "registered"]];
    }
    
    setFilter(filterCondition)
    map.current.setFilter("ccrr-units-geojson", filterCondition);
  }

  return (
    <Provider
      value={{
        popupContent,
        setPopupContent,
        map,
        lngLat,
        setLngLat,
        calculateStats,
        avgRent,
        minRent,
        maxRent,
        runFilters,
        mapFilter
      }}
    >
      {children}
    </Provider>
  );
}

export { MapProvider, mapContext };
