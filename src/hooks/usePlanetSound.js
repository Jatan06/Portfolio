/**
 * usePlanetSound Hook
 * Provides functions to trigger synthesized tones for the solar system.
 * Communicates with the SoundEngine component via CustomEvents.
 */
export const usePlanetSound = () => {
  /**
   * Triggers a hover tone for a specific planet.
   * @param {string} planetName - One of: "About", "Projects", "Skills", "Contact"
   */
  const playPlanetTone = (planetName) => {
    window.dispatchEvent(new CustomEvent("play-planet-tone", { 
      detail: { planetName } 
    }));
  };

  /**
   * Triggers a deep "whomp" sound for planet clicks.
   */
  const playClickSound = () => {
    window.dispatchEvent(new CustomEvent("play-click-sound"));
  };

  return { playPlanetTone, playClickSound };
};
