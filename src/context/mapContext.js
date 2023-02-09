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
  const [totalUnits, setTotalUnits] = useState(null);
  const [totalUnregUnits, setTotalUnregUnits] = useState(null);
  const [unreg, setUnreg] = useState(false);
  const map = useRef(null);
  const [lngLat, setLngLat] = useState({ lng: null, lat: null });
  //const [mapFilter, setFilter] = useState(["all",["==", ["boolean", true], ["get", "registered"]],["<=", ["number", ["get", "rent"], -1], 10000],[">=", ["number", ["get", "rent"], -1], 0]]);
  const mapFilter = useRef(["boolean", true]);
  const popupAddress = useRef(null);
  const [popupUnits, setUnits] = useState(null);

  const Provider = mapContext.Provider;

  function filterPopup() {
    if (!popupAddress.current) return;
    
    /*
    var units = map.current
      .queryRenderedFeatures({
        layers: ["ccrr-units-geojson"],
        filter: ["all",["in", ["literal", popupAddress.current], ["get", "address"]],mapFilter.current]
      })
      .map((f) => {
        var u = f["properties"];
        delete u["address"];
        return u;
      });
      */
    
    var seen_units = [];
    var unique_units = [];
    map.current
    .querySourceFeatures("units",{
      filter: ["all",["in", ["literal", popupAddress.current], ["get", "address"]],mapFilter.current]
    })
    .map((f) => {
      var u = f["properties"];
      delete u["address"];
      if(!seen_units.includes(u['unit'])) {
        seen_units.push(u['unit']);
        unique_units.push(u);
      }
      return u;
    });
    
    if (!unique_units.length || !unique_units[0]["registered"]) unique_units = [];

    setUnits(unique_units);
  }

  function newPopup(event) {
    const features = map.current.queryRenderedFeatures(event.point, {
      layers: ["ccrr-units-geojson"], // replace with your layer name
    });
    if (!features.length) {
      return false;
    }
    const feature = features[0];
    popupAddress.current = feature.properties.address;
    filterPopup();
    return true;
  }

  function calculateStats() {
    if (unreg) {
      const features = map.current.queryRenderedFeatures({
        layers: ["ccrr-units-geojson"], // replace with your layer name
        filter: mapFilter.current,
      });
      setTotalUnregUnits(features.length);
    } else {
      var rentSum = 0.0;
      var rentCount = 0.0;
      var min = 10000.0;
      var max = 0.0;
      const features = map.current.queryRenderedFeatures({
        layers: ["ccrr-units-geojson"], // replace with your layer name
        filter: mapFilter.current,
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
      setTotalUnits(rentCount);
    }
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
        regCondition,
      ];
    } else {
      filterCondition = ["==", ["boolean", false], ["get", "registered"]];
    }

    mapFilter.current = filterCondition;
    if (
      map.current &&
      map.current.isStyleLoaded() &&
      "units" in map.current.getStyle().sources &&
      map.current.isSourceLoaded("units")
    )
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
        totalUnits,
        totalUnregUnits,
        runFilters,
        mapFilter,
        unreg,
        setUnreg,
        popupUnits,
        setUnits,
        newPopup,
        filterPopup,
        popupAddress,
      }}
    >
      {children}
    </Provider>
  );
}

export { MapProvider, mapContext };