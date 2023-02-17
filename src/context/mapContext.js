import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { createSearchParams, useNavigate, useNavigation, useSearchParams } from "react-router-dom";
import { createEnumArrayParam, createEnumParam, DelimitedNumericArrayParam, useQueryParams, withDefault } from "use-query-params";

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
  const popupAddress = useRef(null);
  const popupSlug = useState(null);
  const [popupUnits, setUnits] = useState(null);
  const [forceStats, setForceStats] = useState(0);
  const [styleLoaded, setStyleLoaded] = useState(false);
  const navigation = useNavigation();

  const VacancyEnumParam = createEnumArrayParam(['rented','vacant','none']);
  const RegisteredEnumParam = createEnumParam(['registered','unregistered']);
  const BedsEnumParam = createEnumArrayParam(["0", "1", "2", "3", "4", "5", "none"]);
  const EncumberedEnumParam = createEnumArrayParam(["affordable", "market", "none"]);

  const defVacancy = ['rented','vacant'];
  const defReg = "registered";
  const defRent = [0,10000];
  const defBeds = ["0", "1", "2", "3", "4", "5"];
  const defEnc = ["affordable", "market"];
  
  const [mapFilter, setFilter] = useState([
    "all",
    [
      "in",
      ["to-string", ["number", ["get", "beds"], -1]],
      ["literal", defBeds],
    ],
    [
      "all",
      ["<=", ["number", ["get", "rent"], -1], defRent[1]],
      [">=", ["number", ["get", "rent"], -1], defRent[0]],
    ],
    ["boolean", true],
    ["==", ["boolean", true], ["get", "registered"]],
  ]);

  const [searchParams, setSearchParams] = useQueryParams({
    vac: withDefault(VacancyEnumParam, defVacancy),
    reg: withDefault(RegisteredEnumParam, defReg),
    rent: withDefault(DelimitedNumericArrayParam, defRent),
    beds: withDefault(BedsEnumParam, defBeds),
    enc: withDefault(EncumberedEnumParam, defEnc)
  });

  const [vacancyValues, setVacancyValues] = useState(defVacancy);
  const [regValue, setRegValue] = useState(defReg);
  const [rentValue, setRentValue] = useState(defRent);
  const [bedsValues, setBedsValues] = useState(defBeds);
  const [encValues, setEncValues] = useState(defEnc);

  const [reactSearchParams] = useSearchParams();

  const Provider = mapContext.Provider;

  function useStatsUpdate() {
    return () => setForceStats((forceStats) => forceStats + 1);
  }
  const forceStatsUpdate = useStatsUpdate();
  const navigate = useNavigate();

  const filterPopup = useCallback(() => {
    if (!popupAddress.current) return;

    var seen_units = [];
    var unique_units = [];
    map.current
      .querySourceFeatures("units", {
        sourceLayer: "ccrr-units-geojson",
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
  }, [mapFilter]);

  const popupFromSlug = useCallback(
    (slug) => {
      var features = map.current.querySourceFeatures("units", {
        sourceLayer: "ccrr-units-geojson",
        filter: [
          "in",
          ["literal", slug],
          ["get", "slug"],
        ]
      });
      if (!features.length) return false;
      const feature = features[0];
      popupAddress.current = feature.properties.address;
      filterPopup();
      map.current.setFilter("selected-address", [
        "in",
        ["literal", feature.properties.address],
        ["get", "address"],
      ]);
      map.current.setLayoutProperty(
        "selected-address",
        "visibility",
        "visible"
      );
      return true;
    },
    [filterPopup]
  );

  const popupFromClick = useCallback(
    (event) => {
      if(navigation.state === "loading") return;
      var features = map.current.queryRenderedFeatures(event.point, {
        layers: ["ccrr-units-geojson"], // replace with your layer name
      });
      if (!features.length) {
        const bbox = [
          [event.point.x - 15, event.point.y - 15],
          [event.point.x + 15, event.point.y + 15],
        ];
        features = map.current.queryRenderedFeatures(bbox, {
          layers: ["ccrr-units-geojson"], // replace with your layer name
        });
        if (!features.length) {
          return false;
        }
      }
      const feature = features[0];
      popupAddress.current = feature.properties.address;
      navigate({
        pathname:feature.properties.slug,
        search:createSearchParams(reactSearchParams).toString()
      });
      return true;
    },
    [navigate, reactSearchParams, navigation]
  );

  useEffect(() => {
    const vacancyValues = searchParams["vac"].filter(e => e !== 'none');
    const regValue = searchParams["reg"];
    const [minRent, maxRent] = searchParams["rent"];
    const bedsValues = searchParams["beds"].filter(e => e !== 'none');
    const encValues = searchParams["enc"].filter(e => e !== 'none');

    setVacancyValues(vacancyValues);
    setRegValue(regValue);
    setRentValue([minRent, maxRent]);
    setBedsValues(bedsValues);
    setEncValues(encValues);

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
      if (
        vacancyValues.includes("vacant") &&
        vacancyValues.includes("rented")
      ) {
        statusCondition = ["boolean", true];
      } else if (vacancyValues.includes("vacant")) {
        statusCondition = vacantCondition;
      } else if (vacancyValues.includes("rented")) {
        statusCondition = rentedCondition;
      } else {
        statusCondition = neitherCondition;
      }

      var encCondition = ["boolean", true];
      var affordCondition = ["in", ["literal", "Yes"], ["get", "encumbered"]];
      var marketCondition = ["in", ["literal", "No"], ["get", "encumbered"]];
      var neitherEncCondition = [
        "all",
        ["!", affordCondition],
        ["!", marketCondition],
      ];
      if (encValues.includes("affordable") && encValues.includes("market")) {
        encCondition = ["boolean", true];
      } else if (encValues.includes("affordable")) {
        encCondition = affordCondition;
      } else if (encValues.includes("market")) {
        encCondition = marketCondition;
      } else {
        encCondition = neitherEncCondition;
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
          encCondition,
        ];
      } else {
        filterCondition = ["==", ["boolean", false], ["get", "registered"]];
      }

      setFilter(filterCondition);
    },
    // for some reason searchParams is changing constantly, causing this function to fuck up, but reactSearchParams is all good ;)
    // eslint-disable-next-line
    [reactSearchParams]
  );

  /*
  const runFilters = useCallback(
    (vacancyValues, [minRent, maxRent], bedsValues, regValue, encValues) => {
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
      if (
        vacancyValues.includes("vacant") &&
        vacancyValues.includes("rented")
      ) {
        statusCondition = ["boolean", true];
      } else if (vacancyValues.includes("vacant")) {
        statusCondition = vacantCondition;
      } else if (vacancyValues.includes("rented")) {
        statusCondition = rentedCondition;
      } else {
        statusCondition = neitherCondition;
      }

      var encCondition = ["boolean", true];
      var affordCondition = ["in", ["literal", "Yes"], ["get", "encumbered"]];
      var marketCondition = ["in", ["literal", "No"], ["get", "encumbered"]];
      var neitherEncCondition = [
        "all",
        ["!", affordCondition],
        ["!", marketCondition],
      ];
      if (encValues.includes("affordable") && encValues.includes("market")) {
        encCondition = ["boolean", true];
      } else if (encValues.includes("affordable")) {
        encCondition = affordCondition;
      } else if (encValues.includes("market")) {
        encCondition = marketCondition;
      } else {
        encCondition = neitherEncCondition;
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
          encCondition,
        ];
      } else {
        filterCondition = ["==", ["boolean", false], ["get", "registered"]];
      }

      setFilter(filterCondition);
    },
    []
  );
  */

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
            self.findIndex(
              (t) => t.properties.address === value.properties.address
            )
        );
      setTotalUnregUnits(features.length);
    } else {
      var rentSum = 0.0;
      var rentCount = 0.0;
      var min = 10000.0;
      var max = 0.0;
      const features = map.current
        .queryRenderedFeatures({
          layers: ["ccrr-units-geojson"], // replace with your layer name
          filter: mapFilter,
        })
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.properties.address === value.properties.address &&
                t.properties.unit === value.properties.unit
            )
        );
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

  /*
  useEffect(() => {
    if (!styleLoaded.current) {
      runFilters(vacancyValues, rentValue, bedsValues, regValue, encValues);
      styleLoaded.current = true;
    }
  }, [runFilters, vacancyValues, rentValue, bedsValues, regValue, encValues]);
  */

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
        mapFilter,
        setFilter,
        unreg,
        setUnreg,
        popupUnits,
        setUnits,
        popupFromClick,
        popupFromSlug,
        filterPopup,
        popupAddress,
        popupSlug,
        forceStatsUpdate,
        vacancyValues,
        setVacancyValues,
        regValue,
        setRegValue,
        rentValue,
        setRentValue,
        bedsValues,
        setBedsValues,
        encValues,
        setEncValues,
        styleLoaded, 
        setStyleLoaded,
        setSearchParams
      }}
    >
      {children}
    </Provider>
  );
}

export { MapProvider, mapContext };
