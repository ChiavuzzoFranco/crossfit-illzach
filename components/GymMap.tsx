'use client';
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPTILER_KEY = 'REx3MD2wQpBVTAsjdKCY'; 

export default function GymMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  
  // États pour gérer le chargement et l'animation
  const [isMapReady, setIsMapReady] = useState(false);
  const [hasFlown, setHasFlown] = useState(false); // Pour ne lancer l'anim qu'une fois

  // DESTINATION (La Box)
  const GYM_COORDS: [number, number] = [7.3825381, 47.7665399]; 
  
  // DÉPART (Vue "Satellite" haute)
  const START_COORDS: [number, number] = [7.38, 47.77]; 
  const START_ZOOM = 13; 

  const handleZoomIn = () => { if (map.current) map.current.zoomIn(); };
  const handleZoomOut = () => { if (map.current) map.current.zoomOut(); };

  // 1. INITIALISATION DE LA CARTE
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}`,
      center: START_COORDS, // On commence en vue éloignée
      zoom: START_ZOOM,
      pitch: 0,             // Vue à plat (2D)
      bearing: 0,
      attributionControl: false,
      interactive: true
    });

    map.current.on('load', () => {
      if (!map.current) return;
      
      // On signale que la map est prête à recevoir des ordres
      setIsMapReady(true);

      // --- AJOUT DES BÂTIMENTS 3D ---
      const layers = map.current.getStyle().layers || [];
      let labelLayerId;
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i] as any; 
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          labelLayerId = layer.id;
          break;
        }
      }

      map.current.addLayer(
        {
          'id': '3d-buildings',
          'source': 'maptiler_planet',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 13,
          'paint': {
            'fill-extrusion-color': '#222',
            'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 13, 0, 13.05, ['get', 'render_height']],
            'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 13, 0, 13.05, ['get', 'render_min_height']],
            'fill-extrusion-opacity': 0.9
          }
        },
        labelLayerId
      );

      // --- MARQUEUR ---
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.backgroundColor = '#FF3300';
      el.style.borderRadius = '50%';
      el.style.boxShadow = '0 0 20px #FF3300';
      el.style.border = '2px solid white';
      
      el.innerHTML = `
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; border-radius: 50%; border: 1px solid #FF3300; opacity: 0; animation: pulse 2s infinite;"></div>
        <img id="marker-logo" src="/logo.png" alt="CrossFit Illzach" style="
          position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
          width: 60px; max-width: none; height: auto; object-fit: contain;
          filter: drop-shadow(0 5px 10px rgba(0,0,0,1)); pointer-events: none; transition: width 0.1s ease-out;
        " />
      `;

      new maplibregl.Marker({ element: el }).setLngLat(GYM_COORDS).addTo(map.current);

      // --- LOGIQUE DE SCALING ---
      const updateMarkerScale = () => {
        if (!map.current) return;
        const zoom = map.current.getZoom();
        const img = document.getElementById('marker-logo');
        if (img) {
          const minSize = 60; const maxSize = 220;
          const minZoom = 14; const maxZoom = 17;
          let newSize = maxSize;
          if (zoom <= minZoom) newSize = minSize;
          else if (zoom >= maxZoom) newSize = maxSize;
          else {
            const percentage = (zoom - minZoom) / (maxZoom - minZoom);
            newSize = minSize + (percentage * (maxSize - minSize));
          }
          img.style.width = `${newSize}px`;
        }
      };
      map.current.on('zoom', updateMarkerScale);
      updateMarkerScale();
    });
  }, []);


  // 2. DÉTECTION DU SCROLL (Intersection Observer)
  useEffect(() => {
    // On ne fait rien si la map n'est pas chargée ou si on a déjà fait l'animation
    if (!isMapReady || hasFlown || !mapContainer.current || !map.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Si l'élément est visible à l'écran
        if (entry.isIntersecting) {
          
          // LANCE L'ANIMATION
          map.current?.flyTo({
            center: GYM_COORDS,
            zoom: 17.5,
            pitch: 60,
            bearing: -20,
            speed: 0.5, // Lent et fluide
            curve: 1.2,
            essential: true
          });

          // On marque comme fait (pour ne pas recommencer)
          setHasFlown(true);
          // On arrête d'observer pour économiser des ressources
          observer.disconnect();
        }
      },
      {
        threshold: 0.4 // L'animation se lance quand 40% de la carte est visible
      }
    );

    observer.observe(mapContainer.current);

    return () => observer.disconnect();
  }, [isMapReady, hasFlown]); // Se relance quand la map est prête


  return (
    <div className="w-full h-full relative group">
      <div ref={mapContainer} className="w-full h-full bg-[#050505]" />
      
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
        <button onClick={handleZoomIn} className="w-10 h-10 bg-black border border-white/20 text-white hover:text-[#FF3300] hover:border-[#FF3300] transition-colors flex items-center justify-center font-display text-xl cursor-pointer">+</button>
        <button onClick={handleZoomOut} className="w-10 h-10 bg-black border border-white/20 text-white hover:text-[#FF3300] hover:border-[#FF3300] transition-colors flex items-center justify-center font-display text-xl cursor-pointer">-</button>
      </div>

      <style jsx global>{`
        @keyframes pulse { 0% { width: 10px; height: 10px; opacity: 0.8; } 100% { width: 60px; height: 60px; opacity: 0; } }
        .maplibregl-ctrl-bottom-left, .maplibregl-ctrl-bottom-right { display: none; }
      `}</style>

      {/* Overlay de chargement */}
      <div className={`absolute inset-0 bg-[#050505] transition-opacity duration-1000 pointer-events-none ${isMapReady ? 'opacity-0' : 'opacity-100'}`} />
    </div>
  );
}