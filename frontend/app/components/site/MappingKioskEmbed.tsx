'use client';

import { useState } from 'react';
import { legacyMapUrl } from '@/lib/site';

export default function MappingKioskEmbed(): React.ReactElement {
  const [showMap, setShowMap] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="kiosk-live">
      <div className="kiosk-live-bar">
        <span className="site-eyebrow">GeoTripz / Legacy mapping application</span>
        {showMap && (
          <button type="button" className="site-text-link" onClick={() => setShowMap(false)}>
            Close embedded map
          </button>
        )}
      </div>
      {showMap && !failed ? (
        <iframe
          className="kiosk-frame"
          src={legacyMapUrl}
          title="Live GeoTripz Mapping Kiosk — external application"
          referrerPolicy="no-referrer"
          onError={() => {
            setFailed(true);
            setShowMap(false);
          }}
        />
      ) : (
        <div className="kiosk-launch-panel">
          <div className="kiosk-hex-field" aria-hidden="true">
            <span>H3</span>
          </div>
          <div>
            <p className="site-eyebrow">A different way to see your surroundings</p>
            <h3>
              Your place.
              <br />
              <em>A wider perspective.</em>
            </h3>
            <p>
              {failed
                ? 'The embedded map could not be opened. Continue directly to the GeoTripz application.'
                : 'Explore the original GeoTripz map here, or open it in its own window.'}
            </p>
            {!failed && (
              <button type="button" className="site-button" onClick={() => setShowMap(true)}>
                Load the interactive map <span aria-hidden="true">+</span>
              </button>
            )}
          </div>
        </div>
      )}
      <div className="kiosk-live-footer">
        <p>
          Loading the map connects to an external GeoTripz / AfriGIS application and its providers.
          Its own privacy terms and availability apply. If the frame stays blank, use the direct
          link below.
        </p>
        <a href={legacyMapUrl} target="_blank" rel="noopener noreferrer" className="site-button">
          Launch the Live GeoTripz Map ↗
        </a>
      </div>
    </div>
  );
}
