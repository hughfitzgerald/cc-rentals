import React, { useContext, useRef, useEffect, useState } from "react";
import { MantineProvider, Text } from '@mantine/core';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  "pk.eyJ1IjoiaHVnaGZpdHpnZXJhbGQiLCJhIjoiY2xkZGhjaG9wMDNqdTNvdDZ5bG80OXZ3YSJ9.6njmVnJyl0zAtMnM9d8duQ";

const Popup = ({  })

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-118.385796);
  const [lat, setLat] = useState(33.97883);
  const [zoom, setZoom] = useState(10.7);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/hughfitzgerald/cldjdvxl7000001qqfr6kpnpv",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on("load", function () {
      map.current.addSource("units", {
        type: "geojson",
        data: "https://hughfitzgerald.github.io/cc-rentals/ccrr-flat-20230202-122812.json",
      });
      map.current.addLayer({
        id: "ccrr-units-geojson",
        source: "units",
        layout: {
          visibility: "visible",
        },
        type: "circle",
      });
    });

    map.current.on("click", (event) => {
      // If the user clicked on one of your markers, get its information.
      const features = map.current.queryRenderedFeatures(event.point, {
        layers: ["ccrr-units-geojson"], // replace with your layer name
      });
      if (!features.length) {
        return;
      }
      const feature = features[0];

      /* 
        Create a popup, specify its options 
        and properties, and add it to the map.
    */
      var address = feature.properties.address;
      const units = map.current.queryRenderedFeatures(event.point, {
        layers: ["ccrr-units-geojson"],
        filter: ["in", address, ["get", "address"]],
      });
      //var units = JSON.parse(feature.properties.units);
      //var rentDiv = constructRentTable(address, data[address]);
      var rentDiv = constructRentTable(address, units);
      const popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(feature.geometry.coordinates)
        .setDOMContent(rentDiv)
        .addTo(map.current);

      // make table sortable again? maybe react helps?
      /*
      var rentTable = document.getElementById("rentTable");

      
        if (rentTable != null) {
          sorttable.makeSortable(rentTable);
        }
        */
    });
  });

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" style={{ width: '100%', height: '100vh'}} />
    </div>
    </MantineProvider>
  );
}

function constructRentTable(address, units) {
  const headers = [
    "Unit",
    "Beds",
    "Baths",
    "Year Built",
    "Rent",
    "Rent Reported On",
    "Affordable Unit",
    "Vacancy Status",
  ];
  const unitKeys = [
    "unit",
    "beds",
    "baths",
    "built",
    "rent",
    "rentdate",
    "encumbered",
    "status",
  ];
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  var rentDiv = document.createElement("div");

  var rentHeader = document.createElement("h3");
  rentHeader.appendChild(document.createTextNode(address));
  rentDiv.appendChild(rentHeader);

  var rentTable = document.createElement("table");

  var tableHead = document.createElement("thead");
  var headerRow = document.createElement("tr");
  for (var i = 0; i < headers.length; i++) {
    var cell = document.createElement("th");
    cell.appendChild(document.createTextNode(headers[i]));
    headerRow.appendChild(cell);
  }
  tableHead.appendChild(headerRow);
  rentTable.appendChild(tableHead);

  var firstRow = true;

  var tableBody = document.createElement("tbody");
  for (var i = 0; i < units.length; i++) {
    var row = document.createElement("tr");
    var unit = units[i]["properties"];

    if (firstRow && unit["unit"] == null && unit["rent"] == null) {
      rentDiv.appendChild(
        document.createTextNode("No rent information available.")
      );
      return rentDiv;
    }
    if (!firstRow && unit["unit"] == null && unit["rent"] == null) {
      continue;
    }
    firstRow = false;

    unitKeys.forEach(function (key, index) {
      var cell = document.createElement("td");
      if (key === "rent") {
        cell.appendChild(document.createTextNode(formatter.format(unit[key])));
      } else {
        cell.appendChild(document.createTextNode(unit[key]));
      }
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  }

  //rentTable.style.border = '1px solid black'
  rentTable.className = "sortable";
  rentTable.id = "rentTable";
  rentTable.appendChild(tableBody);
  rentDiv.appendChild(rentTable);
  return rentDiv;
}
