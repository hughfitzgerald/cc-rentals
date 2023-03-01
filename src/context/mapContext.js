import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  createSearchParams,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import {
  createEnumArrayParam,
  createEnumParam,
  DelimitedNumericArrayParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";

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
  const popupOwner = useRef(null);
  const popupMultipleOwners = useRef(null);
  const popupSlug = useRef(null);
  const [popupUnits, setUnits] = useState(null);

  const [unit, setUnit] = useState(null);
  const [unitData, setUnitData] = useState([]);

  //const [forceStats, setForceStats] = useState(0);
  const [styleLoaded, setStyleLoaded] = useState(false);
  const navigation = useNavigation();

  const VacancyEnumParam = createEnumArrayParam(["rented", "vacant", "none"]);
  const RegisteredEnumParam = createEnumParam(["registered", "unregistered"]);
  const BedsEnumParam = createEnumArrayParam([
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "none",
  ]);
  const EncumberedEnumParam = createEnumArrayParam([
    "affordable",
    "market",
    "none",
  ]);

  const defVacancy = ["rented", "vacant"];
  const defReg = "registered";
  const defRent = [0, 10000];
  const defBeds = ["0", "1", "2", "3", "4", "5"];
  const defEnc = ["affordable", "market"];
  const defOwner = "";
  const defAddress = "";
  const defaultFilters = {
    "vac":defVacancy,
    "reg":defReg,
    "rent":defRent,
    "beds":defBeds,
    "enc":defEnc,
    "owner":defOwner,
    "address":defAddress};

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
    enc: withDefault(EncumberedEnumParam, defEnc),
    owner: withDefault(StringParam, defOwner),
    address: withDefault(StringParam, defAddress),
  });

  const [vacancyValues, setVacancyValues] = useState(defVacancy);
  const [regValue, setRegValue] = useState(defReg);
  const [rentValue, setRentValue] = useState(defRent);
  const [bedsValues, setBedsValues] = useState(defBeds);
  const [encValues, setEncValues] = useState(defEnc);
  const [ownerValues, setOwnerValues] = useState(defOwner);
  const [addressValue, setAddressValue] = useState(defAddress);

  const [reactSearchParams] = useSearchParams();

  const Provider = mapContext.Provider;

  const [statsData, setStatsData] = useState([]);
  const [histData, setHistData] = useState([]);
  const [unitRents, setUnitRents] = useState([]);

  useEffect(() => {
    async function loadHistData() {
      var response = await fetch(
        "https://www.ccrentals.org/ccrr-hist-20230228-122637.json"
      ).then((res) => {
        return res.json();
      })

      setHistData(response);
    }
    loadHistData();
  }, []);

  useEffect(() => {
    async function loadStatsData() {
      var response = await fetch(
        "https://www.ccrentals.org/ccrr-data-20230228-094223.json"
      ).then((res) => {
        return res.json();
      })

      setStatsData(response);
    }
    loadStatsData();
  }, []);

  const thisFilterSet = useCallback((filterString) => {
    return !(searchParams[filterString] === defaultFilters[filterString]);
    // eslint-disable-next-line
  }, [reactSearchParams]);

  const filtersSet = useCallback(() => {
    return !(
      searchParams["vac"] === defVacancy &&
      searchParams["reg"] === defReg &&
      searchParams["rent"] === defRent &&
      searchParams["beds"] === defBeds &&
      searchParams["enc"] === defEnc &&
      searchParams["owner"] === defOwner &&
      searchParams["address"] === defAddress
    );
    // eslint-disable-next-line
  }, [reactSearchParams]);

  function resetFilters() {
    setSearchParams({}, "push");
  }

  /*
  function useStatsUpdate() {
    return () => setForceStats((forceStats) => forceStats + 1);
  }
  const forceStatsUpdate = useStatsUpdate();
  */

  const navigate = useNavigate();

  // filter statsData
  const filterStatistics = useCallback((o) => {
    var _ = require("lodash")

    const vacancyValues = searchParams["vac"].filter((e) => e !== "none");
    const regValue = searchParams["reg"];
    const [minRent, maxRent] = searchParams["rent"];
    const bedsValues = searchParams["beds"].filter((e) => e !== "none");
    const encValues = searchParams["enc"].filter((e) => e !== "none");
    const ownerValues = searchParams["owner"];
    const addressValue = searchParams["address"];

    const ownerCondition = o.owner.includes(ownerValues);
    
    const addressCondition = o.address.includes(addressValue);

    const rentCondition = o.rent <= maxRent && o.rent >= minRent;

    const bedsValueCondition = _.includes(bedsValues, o.beds.toString());

    var vacantCondition = false;
    var rentedCondition = false;

    if (vacancyValues.includes("vacant")) {
      vacantCondition = o.status.includes("Vacant");
    }
    if (vacancyValues.includes("rented")) {
      rentedCondition = o.status.includes("Rented");
    }
    var statusCondition = vacantCondition || rentedCondition;

    var encCondition = true;
    var affordCondition = o.encumbered.includes("Yes");
    var marketCondition = o.encumbered.includes("No");
    var neitherEncCondition = !affordCondition && !marketCondition;

    if (encValues.includes("affordable") && encValues.includes("market")) {
      encCondition = true;
    } else if (encValues.includes("affordable")) {
      encCondition = affordCondition;
    } else if (encValues.includes("market")) {
      encCondition = marketCondition;
    } else {
      encCondition = neitherEncCondition;
    }

    var regCondition = o.registered;

    if (regValue) {
      return ownerCondition && addressCondition && rentCondition && bedsValueCondition && statusCondition && encCondition && regCondition;
    } else {
      return !regCondition;
    }

    //eslint-disable-next-line
  }, [reactSearchParams]);

  // new filterPopup
  const filterPopup = useCallback(() => {
    if (!popupAddress.current) return;

    var _ = require("lodash");

    var unique_units = _.filter(statsData, (o) => o.address === popupAddress.current);
    unique_units = _.filter(unique_units, filterStatistics);

    setUnits(unique_units);
  }, [filterStatistics, statsData]);

  /*
  // old filterPopup
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
  }, [mapFilter]);*/

  // new popupFromSlug
  const popupFromSlug = useCallback(
    (slug) => {
      var _ = require("lodash");
      var features = _.filter(statsData,(o) => o.slug === slug);
      if (!features.length) return false;
      const feature = features[0];
      popupAddress.current = feature.address;
      popupOwner.current = feature.owner;
      popupMultipleOwners.current = feature.multiple_owners;
      popupSlug.current = feature.slug;
      filterPopup();
      map.current.setFilter("selected-address", [
        "in",
        ["literal", feature.address],
        ["get", "address"],
      ]);
      map.current.setLayoutProperty(
        "selected-address",
        "visibility",
        "visible"
      );
      return true;
    },
    [filterPopup, statsData]
  );

  // old popupFromSlug
  /*
  const popupFromSlug = useCallback(
    (slug) => {
      var features = map.current.querySourceFeatures("units", {
        sourceLayer: "ccrr-units-geojson",
        filter: ["in", ["literal", slug], ["get", "slug"]],
      });
      if (!features.length) return false;
      const feature = features[0];
      popupAddress.current = feature.properties.address;
      popupOwner.current = feature.properties.owner;
      popupMultipleOwners.current = feature.properties.multiple_owners;
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
  );*/

  const popupFromClick = useCallback(
    (event) => {
      const bboxLimits = 15;
      const bboxIncrement = 1;
      const xOffset = 16; // bug somewhere makes mouse events off by 16 pixels --- TO FIX!!!
      if (navigation.state === "loading") return;
      var features = map.current.queryRenderedFeatures(
        [event.point.x + xOffset, event.point.y],
        {
          layers: ["ccrr-units-geojson"], // replace with your layer name
        }
      );
      for (
        var i = bboxIncrement;
        !features.length && i <= bboxLimits;
        i += bboxIncrement
      ) {
        const bbox = [
          [event.point.x + xOffset - i, event.point.y - i],
          [event.point.x + xOffset + i, event.point.y + i],
        ];
        features = map.current.queryRenderedFeatures(bbox, {
          layers: ["ccrr-units-geojson"], // replace with your layer name
        });
      }
      if (!features.length) {
        return false;
      }
      const feature = features[0];
      popupAddress.current = feature.properties.address;
      popupOwner.current = feature.properties.owner;
      popupSlug.current = feature.properties.slug;
      popupMultipleOwners.current = feature.properties.multiple_owners;
      navigate({
        pathname: feature.properties.slug,
        search: createSearchParams(reactSearchParams).toString(),
      });
      return true;
    },
    [navigate, reactSearchParams, navigation]
  );

  useEffect(
    () => {
      const vacancyValues = searchParams["vac"].filter((e) => e !== "none");
      const regValue = searchParams["reg"];
      const [minRent, maxRent] = searchParams["rent"];
      const bedsValues = searchParams["beds"].filter((e) => e !== "none");
      const encValues = searchParams["enc"].filter((e) => e !== "none");
      const ownerValues = searchParams["owner"];
      const addressValue = searchParams["address"];

      setVacancyValues(vacancyValues);
      setRegValue(regValue);
      setRentValue([minRent, maxRent]);
      setBedsValues(bedsValues);
      setEncValues(encValues);
      setOwnerValues(ownerValues);
      setAddressValue(addressValue);

      var ownerCondition = ["boolean", true];
      if (ownerValues) {
        ownerCondition = [
          "in",
          ["literal", ownerValues],
          ["to-string", ["get", "owner"]],
        ];
      }

      var addressCondition = ["boolean", true];
      if (addressValue) {
        addressCondition = [
          "in",
          ["literal", addressValue],
          ["to-string", ["get", "address"]],
        ];
      }

      var unitRentValue = ["number", ["get", "rent"], -1];
      var rentValueCondition = [
        "all",
        ["<=", unitRentValue, maxRent],
        [">=", unitRentValue, minRent],
      ];

      var bedsFeature = ["to-string", ["number", ["get", "beds"], -1]];
      var bedsValueCondition = ["in", bedsFeature, ["literal", bedsValues]];

      var vacantCondition = ["boolean", false];
      var rentedCondition = ["boolean", false];
      //var sectionCondition = ["boolean", false];
      if (vacancyValues.includes("vacant")) {
        vacantCondition = ["in", ["literal", "Vacant"], ["get", "status"]];
      }
      if (vacancyValues.includes("rented")) {
        rentedCondition = ["in", ["literal", "Rented"], ["get", "status"]];
      }
      //if (vacancyValues.includes("section")) {
      //  sectionCondition = ["in", ["literal", "Section 8"], ["get", "status"]];
      //}
      var statusCondition = ["any", vacantCondition, rentedCondition];

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
          ownerCondition,
          addressCondition,
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

  // new stats function
  useEffect(() => {
    var _ = require('lodash');
    var filteredData = _.filter(statsData, filterStatistics);
    if (unreg) {
      var registeredUnits = _.map(filteredData, 'registered')
      setTotalUnregUnits(registeredUnits.length - _.compact(filteredData).length);
    } else {
      var rent = _.map(filteredData, 'rent');
      setAvgRent(_.mean(rent));
      setMinRent(_.min(rent));
      setMaxRent(_.max(rent));
      setTotalUnits(rent.length);
    }
  }, [filterStatistics, unreg, statsData]);

  // old stats function
  /*
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
  */

  useEffect(() => {
    if (
      //map.current &&
      //map.current.isStyleLoaded() &&
      //map.current.getStyle() &&
      //map.current.isSourceLoaded("units") &&
      //"units" in map.current.getStyle().sources
      styleLoaded
    ) {
      map.current.setFilter("ccrr-units-geojson", mapFilter);
    }
  }, [styleLoaded, mapFilter]);

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

  useEffect(() => {
    var _ = require("lodash")
    const ud = _.filter(statsData,(o) => o.address === popupAddress.current && o.unit === unit);
    const ur = _.filter(histData,(o) => o.slug === popupSlug.current && o.unit === unit);
    if (ud.length && ur.length) {
      setUnitData(ud[0]);
      setUnitRents(ur);
    }
  }, [unit, statsData, histData])

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
        popupOwner,
        popupMultipleOwners,
        //forceStatsUpdate,
        vacancyValues,
        setVacancyValues,
        ownerValues,
        setOwnerValues,
        addressValue,
        setAddressValue,
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
        setSearchParams,
        resetFilters,
        filtersSet,
        thisFilterSet,
        statsData,
        unit,
        setUnit,
        unitData,
        unitRents
      }}
    >
      {children}
    </Provider>
  );
}

export { MapProvider, mapContext };
