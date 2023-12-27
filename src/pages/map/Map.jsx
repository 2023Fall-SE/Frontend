import React, { useEffect, useState, useRef } from 'react';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { onClick, onIdle,  } from "./Main";

export const Map = (
    onClick,
    onIdle,
    children,
    style,
    ...options
) => {
    const ref = useRef(null);
    const [map, setMap] = useState();

    useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}));
        }
    }, [ref, map]);

    useDeepCompareEffectForMaps(() => {
        if (map) {
          map.setOptions(options);
        }
      }, [map, options]);

    useEffect(() => {
        if (map) {
            ["click", "idle"].forEach((eventName) =>
                google.maps.event.clearListeners(map, eventName)
            );

            if (onClick) {
                map.addListener("click", onClick);
            }

            if (onIdle) {
                map.addListener("idle", () => onIdle(map));
            }


        }
    }, [map, onClick, onIdle]);

    return (
        <>
          <div ref={ref} style={style} />
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              // set the map prop on the child component
              // @ts-ignore
              return React.cloneElement(child, { map });
            }
          })}
        </>
      );

}