import { useState, useEffect } from "react";

/**
 * Cycles through an array of words with a blur-fade transition.
 * Used for the animated surname in multiple languages on the Hero section.
 *
 * @prop {string[]} words - array of words to cycle through
 * @prop {object}   style - extra inline styles for the <span>
 */
export default function CyclingText({ words, style }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let intervalId;
    const startTimeout = setTimeout(() => {
      const changeWord = () => {
        setVisible(false);
        setTimeout(() => {
          setIndex((i) => (i + 1) % words.length);
          setVisible(true);
        }, 450);
      };

      changeWord();
      intervalId = setInterval(changeWord, 10000);
    }, 20000);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [words.length]);

  return (
    <span
      style={{
        ...style,
        display: "inline-block",
        minWidth: "3ch",
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(6px)",
        transform: visible ? "translateY(0)" : "translateY(-8px)",
        transition:
          "opacity 0.45s cubic-bezier(0.16,1,0.3,1), filter 0.45s ease, transform 0.45s ease",
      }}
    >
      {words[index]}
    </span>
  );
}
