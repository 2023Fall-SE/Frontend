import React, { useEffect, useState } from 'react';
import { Wrapper, Status } from "@googlemaps/react-wrapper";

export const Main = () => {
    const [clicks, setClicks] = useState([]);
    const [zoom, setZoom] = useState(3);
    const [center, setCenter] = useState({lat: 0, lng: 0});

    const onClick = (e) => {
        setClicks([...clicks, e.latLng]);
    };

    const onIdle = (m) => {
        console.log("Idling...");
        setZoom(m.getZoom());
        setCenter(m.getCenter().toJSON());
    };

    const form = (
        <div
          style={{
            padding: "1rem",
            flexBasis: "250px",
            height: "100%",
            overflow: "auto",
          }}
        >
          <label htmlFor="zoom">Zoom</label>
          <input
            type="number"
            id="zoom"
            name="zoom"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
          <br />
          <label htmlFor="lat">Latitude</label>
          <input
            type="number"
            id="lat"
            name="lat"
            value={center.lat}
            onChange={(event) =>
              setCenter({ ...center, lat: Number(event.target.value) })
            }
          />
          <br />
          <label htmlFor="lng">Longitude</label>
          <input
            type="number"
            id="lng"
            name="lng"
            value={center.lng}
            onChange={(event) =>
              setCenter({ ...center, lng: Number(event.target.value) })
            }
          />
          <h3>{clicks.length === 0 ? "Click on map to add markers" : "Clicks"}</h3>
          {clicks.map((latLng, i) => (
            <pre key={i}>{JSON.stringify(latLng.toJSON(), null, 2)}</pre>
          ))}
          <button onClick={() => setClicks([])}>Clear</button>
        </div>
    );
    
    return (
        <div style={{ display: "flex", height: "100%" }}>
          <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY!} render={render}>
            <Map
              center={center}
              onClick={onClick}
              onIdle={onIdle}
              zoom={zoom}
              style={{ flexGrow: "1", height: "100%" }}
            >
              {clicks.map((latLng, i) => (
                <Marker key={i} position={latLng} />
              ))}
            </Map>
          </Wrapper>
          {/* Basic form for controlling center and zoom of map. */}
          {form}
        </div>
      );
}