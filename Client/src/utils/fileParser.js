// utils/fileParser.js

export const parseGeoJson = (content) => {
    try {
      const data = JSON.parse(content);
      return data;
    } catch (error) {
      console.error('Error parsing GeoJSON:', error);
      return null;
    }
  };
  
  export const parseKml = (content) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'text/xml');
      const placemarks = xmlDoc.querySelectorAll('Placemark');
      const features = Array.from(placemarks).map((placemark) => {
        const name = placemark.querySelector('name').textContent;
        const coordinates = placemark.querySelector('coordinates').textContent.split(',').map(coord => {
          const [lng, lat] = coord.split(' ');
          return [parseFloat(lng), parseFloat(lat)];
        });
        return {
          type: 'Feature',
          properties: {
            name
          },
          geometry: {
            type: 'LineString',
            coordinates
          }
        };
      });
      return {
        type: 'FeatureCollection',
        features
      };
    } catch (error) {
      console.error('Error parsing KML:', error);
      return null;
    }
  };
  