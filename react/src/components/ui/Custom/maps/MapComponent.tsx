//@ts-nocheck

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface MapComponentProps {
  position: { lat: number; lon: number, address: string };
}

const MapComponent: React.FC<MapComponentProps> = ({ position }) => {
  return (
    <div className="w-full h-96 z-0">
        <MapContainer center={[position.lat, position.lon]} zoom={13} className="w-full h-full z-0">
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[position.lat, position.lon]}>
            <Popup>
            {/* A pretty CSS3 popup. <br /> Easily customizable. */}{position.address}
            </Popup>
        </Marker>
        </MapContainer>
    </div>
  );
};

export default MapComponent;
