/**
 * useWarp Hook
 * Provides a function to trigger the hyperspace warp transition.
 * Uses a CustomEvent to communicate with the WarpOverlay component.
 */
export const useWarp = () => {
  const triggerWarp = (callback) => {
    // Dispatch custom event that WarpOverlay listens for
    const event = new CustomEvent("warp-start", { 
      detail: { callback } 
    });
    window.dispatchEvent(event);
  };

  return { triggerWarp };
};
