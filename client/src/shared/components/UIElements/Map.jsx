import { useEffect, useRef } from "react";
import "./Map.css";
import "ol/ol.css";
import { Map as OLMap, View } from "ol";
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile.js";
import { fromLonLat } from "ol/proj";

const Map = (props) => {
  const mapRef = useRef();
  const mapInstanceRef = useRef();

  const { center, zoom } = props;

  useEffect(() => {
    mapInstanceRef.current = new OLMap({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([center.lng, center.lat]),
        zoom: zoom,
      }),
    });
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(null);
      }
    };
  }, [center, zoom]);
  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
      id="map"
    ></div>
  );
};

export default Map;
