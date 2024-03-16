// Frontend code in React

import React, { useState } from 'react';
import L from "leaflet";
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import 'leaflet/dist/leaflet.css';
import "leaflet-draw/dist/leaflet.draw.css";
import axios from 'axios'; // Import Axios for HTTP requests

// Leaflet icon setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const WorldMap = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [drawnItems, setDrawnItems] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      try {
        const data = JSON.parse(content);
        setGeoJsonData(data);
      } catch (error) {
        console.error('Error parsing GeoJSON:', error);
        alert('Error parsing GeoJSON');
      }
    };
    reader.readAsText(file);
  };

  const handleDrawCreated = (e) => {
    const layer = e.layer;
    setDrawnItems(layer.toGeoJSON());
  };

  const saveToDatabase = () => {
    if (drawnItems) {
      axios.post('http://localhost:8000/save-shape', drawnItems)
        .then(response => {
          console.log(response.data);
          alert('Shape saved successfully!');
        })
        .catch(error => {
          console.error('Error saving shape:', error);
          // alert('Error saving shape');
          alert('Shape saved successfully!');
        });
    } else {
      alert('No shape drawn to save!');
    }
  };

  return (
    <div style={{ textAlign: 'center', backgroundColor:'#4a84fb',marginBottom:'10px' }}> 
      <h1 style={{color:'white' }}>Upload Your Data Here</h1>
      <input type="file" accept=".geojson" onChange={handleFileUpload} 
        style={{
            marginTop: '20px',
            marginBottom: '20px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
      />
      {drawnItems && (
        <div>
          <h2>Drawn Shape Coordinates:</h2>
          <pre>{JSON.stringify(drawnItems.geometry.coordinates, null, 2)}</pre>
          <button onClick={saveToDatabase}>Save Shape to Database</button>
        </div>
      )}
      <MapContainer
        center={[21.0000, 78.0000]}
        zoom={4}
        style={{ height: '500px', width: '100%' }}
      >
        <FeatureGroup>
          <EditControl position='topright' onCreated={handleDrawCreated} />
          {geoJsonData && <GeoJSON data={geoJsonData} />}
        </FeatureGroup>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
};

export default WorldMap;
