// nearbytechs/NearbyTechs.tsx
import React, { useState } from 'react';
import './NearbyTechs.css';

const NearbyTechs: React.FC = () => {
  const [radius, setRadius] = useState(5);

  const handleDetectLocation = () => {
    console.log('Detecting location...');
  };

  return (
    <div className="nearby-techs-page">
      <div className="page-header">
        <h1 className="page-title">Nearby Technicians</h1>
        <p className="page-subtitle">Find verified technicians near your location</p>
      </div>

      <div className="location-controls">
        <div className="location-section">
          <span className="control-label">YOUR LOCATION</span>
          <button className="detect-btn" onClick={handleDetectLocation}>
            📍 Detect My Location
          </button>
        </div>

        <div className="radius-section">
          <span className="control-label">SEARCH RADIUS</span>
          <div className="radius-options">
            {[2, 5, 10, 20].map((value) => (
              <button
                key={value}
                className={`radius-btn ${radius === value ? 'active' : ''}`}
                onClick={() => setRadius(value)}
              >
                {value} km
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="techs-list">
        <div className="empty-state">
          <span className="empty-icon">📍</span>
          <p className="empty-text">Share your location</p>
          <p className="empty-subtext">to find nearby technicians</p>
          <button className="share-location-btn" onClick={handleDetectLocation}>
            Share Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default NearbyTechs;