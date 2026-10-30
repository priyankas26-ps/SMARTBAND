
import React, { useEffect, useState } from 'react';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';

import L from 'leaflet';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';
import { api } from '../api';

const markerIcon = new L.Icon({
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function Location() {
  const [loc, setLoc] = useState({
    latitude: 17.348954,
    longitude: 78.339502
  });

  useEffect(() => {
    api('/api/location')
      .then(setLoc)
      .catch(() => {});
  }, []);

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">GPS TRACKING</span>
          <h1>Child location</h1>
          <p>View the last location received from the connected band.</p>
        </div>
      </div>

      <div className="panel location-panel">
        <div className="panel-heading">
          <div>
            <h2>Arnav's last known position</h2>
            <p>Band ID KB1024</p>
          </div>

          <span className="status-pill">
            <span className="dot" />
            Location available
          </span>
        </div>

        <div className="real-map">
          <MapContainer
            center={[loc.latitude, loc.longitude]}
            zoom={14}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
              position={[loc.latitude, loc.longitude]}
              icon={markerIcon}
            >
              <Popup>
                <div>
                  <b>Arnav – KidBand KB1024</b>
                  <br />
                  <button onClick={openGoogleMaps}>
                    Open in Google Maps
                  </button>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="coordinates">
          <span>
            Latitude <b>{loc.latitude}</b>
          </span>

          <span>
            Longitude <b>{loc.longitude}</b>
          </span>

          <span>
            Updated
            <b>
              {loc.updatedAt
                ? new Date(loc.updatedAt).toLocaleString()
                : 'Demo location'}
            </b>
          </span>
        </div>

        <button
          className="maps-button"
          onClick={openGoogleMaps}
        >
          <Navigation size={18} />
          Open Arnav's Location in Google Maps
          <ExternalLink size={16} />
        </button>
      </div>

      <p className="demo-warning">
        The displayed coordinates are a sample starting point.
        Live GPS requires a physical GPS-enabled band and a
        connected data service.
      </p>
    </>
  );
}
