import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, MapPin, Navigation, AlertCircle } from 'lucide-react';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function calculateQibla(lat, lng) {
  const phiK = (KAABA_LAT * Math.PI) / 180;
  const lambdaK = (KAABA_LNG * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180;
  const qibla =
    (180 / Math.PI) *
    Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
    );
  return (qibla + 360) % 360;
}

export default function Qibla() {
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [qiblaAngle, setQiblaAngle] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setQiblaAngle(calculateQibla(latitude, longitude));
      },
      () => setError("Unable to get your location. Please enable location services."),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (window.DeviceOrientationEvent) {
      const handler = (e) => {
        if (e.alpha !== null) setHeading(e.alpha);
      };
      window.addEventListener('deviceorientation', handler);
      return () => window.removeEventListener('deviceorientation', handler);
    }
  }, []);

  const rotation = qiblaAngle - heading;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto flex flex-col items-center">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground">Qibla Direction</h1>
        <p className="font-amiri text-lg text-primary/80 mt-1">اتجاه القبلة</p>
        <p className="text-sm text-muted-foreground mt-2">
          Find the direction to the Holy Kaaba in Makkah
        </p>
      </motion.div>

      {error ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card border border-border rounded-2xl p-8 text-center max-w-md"
        >
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-4" />
          <p className="text-sm text-foreground mb-2">{error}</p>
          <p className="text-xs text-muted-foreground">Please allow location access and refresh the page.</p>
        </motion.div>
      ) : (
        <>
          {/* Compass */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-72 h-72 md:w-80 md:h-80 mb-10"
          >
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-border" />
            <div className="absolute inset-2 rounded-full border border-border/50" />
            
            {/* Direction indicators */}
            {['N', 'E', 'S', 'W'].map((dir, i) => (
              <div
                key={dir}
                className="absolute text-xs font-semibold text-muted-foreground"
                style={{
                  top: i === 0 ? '4px' : i === 2 ? 'auto' : '50%',
                  bottom: i === 2 ? '4px' : 'auto',
                  left: i === 3 ? '4px' : i === 1 ? 'auto' : '50%',
                  right: i === 1 ? '4px' : 'auto',
                  transform: (i === 0 || i === 2) ? 'translateX(-50%)' : 'translateY(-50%)',
                }}
              >
                {dir}
              </div>
            ))}

            {/* Qibla needle */}
            <motion.div
              animate={{ rotate: rotation }}
              transition={{ type: 'spring', stiffness: 60, damping: 20 }}
              className="absolute inset-0 flex flex-col items-center"
            >
              <div className="mt-8">
                <Navigation className="w-8 h-8 text-primary drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.4))' }} />
              </div>
              <div className="flex-1" />
            </motion.div>

            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-primary/20 border-2 border-primary" />
            </div>

            {/* Kaaba icon at center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-card border border-border flex flex-col items-center justify-center">
                <span className="text-2xl">🕋</span>
                <span className="text-[9px] text-muted-foreground mt-0.5">Kaaba</span>
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <Compass className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Qibla Info</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Direction</span>
                <span className="text-sm font-mono text-primary">{qiblaAngle.toFixed(1)}°</span>
              </div>
              {location && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Your Location</span>
                  <span className="text-xs font-mono text-foreground/70">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Destination</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary/60" />
                  <span className="text-xs text-foreground/70">Makkah, Saudi Arabia</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}