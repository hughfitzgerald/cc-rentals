import React, { createContext, useState, useRef } from "react";

// Create two context:
// UserContext: to query the context state
// UserDispatchContext: to mutate the context state
const mapContext = createContext(undefined);

// A "provider" is used to encapsulate only the
// components that needs the state in this context
function MapProvider({ children }) {
  const [popupContent, setPopupContent] = useState([]);
  const map = useRef(null);
  const [lngLat, setLngLat] = useState({ lng: null, lat: null });

  const Provider = mapContext.Provider;

  return (
    <Provider
      value={{
        popupContent,
        setPopupContent,
        map,
        lngLat,
        setLngLat
      }}
    >
      {children}
    </Provider>
  );
}

export { MapProvider, mapContext };