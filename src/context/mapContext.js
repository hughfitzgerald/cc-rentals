import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line

// Create two context:
// UserContext: to query the context state
// UserDispatchContext: to mutate the context state
const mapContext = createContext(undefined);

// A "provider" is used to encapsulate only the
// components that needs the state in this context
function MapProvider({ children }) {
  const [avgRent, setAvgRent] = useState(null);
  const [minRent, setMinRent] = useState(null);
  const [maxRent, setMaxRent] = useState(null);
  const [totalUnits, setTotalUnits] = useState(null);
  const [totalUnregUnits, setTotalUnregUnits] = useState(null);
  const [unreg, setUnreg] = useState(false);
  const map = useRef(null);
  //const [mapFilter, setFilter] = useState(["boolean", true]);
  const [mapFilter, setFilter] = useState([
    "all", 
    ['in',['to-string',['number',['get','beds'],-1]],['literal',['0', '1', '2', '3', '4', '5']]],
    ['all',['<=',['number',['get','rent'],-1],10000],['>=',['number',['get','rent'],-1],0]],
    ['boolean',true],
    ['==',['boolean',true],['get','registered']]
  ]);
  const popupAddress = useRef(null);
  const [popupUnits, setUnits] = useState(null);
  const [forceStats, setForceStats] = useState(0);

  const Provider = mapContext.Provider;

  function useStatsUpdate() {
    return () => setForceStats((forceStats) => forceStats + 1);
  }
  const forceStatsUpdate = useStatsUpdate();

  const filterPopup = useCallback(() => {
    if (!popupAddress.current) return;

    var seen_units = [];
    var unique_units = [];
    map.current
      .querySourceFeatures("units", {
        filter: [
          "all",
          ["in", ["literal", popupAddress.current], ["get", "address"]],
          mapFilter,
        ],
      })
      .map((f) => {
        var u = f["properties"];
        delete u["address"];
        if (!seen_units.includes(u["unit"])) {
          seen_units.push(u["unit"]);
          unique_units.push(u);
        }
        return u;
      });

    if (!unique_units.length || !unique_units[0]["registered"])
      unique_units = [];

    setUnits(unique_units);
  }, [map, popupAddress, mapFilter]);

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
    map.current.setFilter('selected-address',["in", ["literal", feature.properties.address], ["get", "address"]]);
    map.current.setLayoutProperty('selected-address','visibility','visible');
    return true;
  }

  function runFilters(vacancyValues, [minRent, maxRent], bedsValues, regValue) {
    var unitRentValue = ["number", ["get", "rent"], -1];
    var rentValueCondition = [
      "all",
      ["<=", unitRentValue, maxRent],
      [">=", unitRentValue, minRent],
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

    setFilter(filterCondition);
  }

  useEffect(() => {
    if (
      !(
        map.current &&
        map.current.isStyleLoaded() &&
        "units" in map.current.getStyle().sources &&
        map.current.isSourceLoaded("units")
      )
    )
      return;
    if (unreg) {
      const features = map.current
        .querySourceFeatures("units", {
          sourceLayer: "ccrr-units-geojson", // replace with your layer name
          filter: mapFilter,
        })
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex((t) => t.properties.address === value.properties.address)
        );
      setTotalUnregUnits(features.length);
    } else {
      var rentSum = 0.0;
      var rentCount = 0.0;
      var min = 10000.0;
      var max = 0.0;
      const features = map.current.queryRenderedFeatures({
        layers: ["ccrr-units-geojson"], // replace with your layer name
        filter: mapFilter,
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
  }, [mapFilter, unreg, forceStats]);

  useEffect(() => {
    if (
      map.current &&
      map.current.isStyleLoaded() &&
      "units" in map.current.getStyle().sources &&
      map.current.isSourceLoaded("units")
    )
      map.current.setFilter("ccrr-units-geojson", mapFilter);
  }, [mapFilter]);

  useEffect(() => {
    filterPopup();
  }, [mapFilter, filterPopup]);

  return (
    <Provider
      value={{
        map,
        avgRent,
        minRent,
        maxRent,
        totalUnits,
        totalUnregUnits,
        runFilters,
        mapFilter,
        setFilter,
        unreg,
        setUnreg,
        popupUnits,
        setUnits,
        newPopup,
        filterPopup,
        popupAddress,
        forceStatsUpdate
      }}
    >
      {children}
    </Provider>
  );
}

export { MapProvider, mapContext };
