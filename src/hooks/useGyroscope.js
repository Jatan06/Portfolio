import { useState, useEffect, useRef } from "react";

/**
 * useGyroscope Hook
 * Manages DeviceOrientationEvent data with smoothing and iOS permission handling.
 * 
 * @param {boolean} isMobile - Only enables listeners if mobile is active.
 * @returns {Object} { beta, gamma, hasGyro, requestPermission, isPermissionGranted }
 */
export const useGyroscope = (isMobile) => {
  const [gyro, setGyro] = useState({ beta: 0, gamma: 0 });
  const [hasGyro, setHasGyro] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  
  // Persistence for lerp smoothing
  const lastVal = useRef({ beta: 0, gamma: 0 });

  /**
   * Request permission for iOS 13+ devices.
   */
  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          setIsPermissionGranted(true);
          return true;
        }
      } catch (error) {
        console.error("Gyroscope permission denied:", error);
      }
    } else {
      // Non-iOS or older browser handles automatically
      setIsPermissionGranted(true);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!isMobile) return;

    const onOrientationChange = (e) => {
      if (e.beta === null || e.gamma === null) return;
      if (!hasGyro) setHasGyro(true);

      // beta: front-back tilt [-180, 180]
      // gamma: left-right tilt [-90, 90]
      const b = e.beta;
      const g = e.gamma;

      // Smoothed input: prev * 0.92 + new * 0.08
      lastVal.current.beta = lastVal.current.beta * 0.92 + b * 0.08;
      lastVal.current.gamma = lastVal.current.gamma * 0.92 + g * 0.08;

      setGyro({
        beta: lastVal.current.beta,
        gamma: lastVal.current.gamma
      });
    };

    window.addEventListener("deviceorientation", onOrientationChange);
    return () => window.removeEventListener("deviceorientation", onOrientationChange);
  }, [isMobile, hasGyro]);

  return { ...gyro, hasGyro, requestPermission, isPermissionGranted };
};
