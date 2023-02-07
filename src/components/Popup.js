import React, { useContext, useEffect, useRef } from "react";
import { mapContext } from "../context/mapContext";
import mapboxgl from "mapbox-gl";

export const Popup = ({children, lngLat, onClose}) => {
    const { map } = useContext(mapContext);
    const popupRef = useRef();
    useEffect(() => {
        const popup = new mapboxgl.Popup({})
            .setLngLat(lngLat)
            .setDOMContent(popupRef.current)
            .addTo(map.current);
        
        //popup.on("close", onClose);

        //return popup.remove;
        return popup.remove;
    }, [children, lngLat, map, onClose])

    return (
        <div style={{ display: "none"}}>
            <div ref={popupRef}>{children}</div>
        </div>
    );
  };

  
export default Popup;