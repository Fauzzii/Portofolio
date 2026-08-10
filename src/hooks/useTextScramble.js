import { useState, useEffect, useCallback } from 'react';

export function useTextScramble(originalText, duration = 800) {
  const [text, setText] = useState(originalText);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      setText(originalText);
      return;
    }

    let frame = 0;
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    const totalFrames = Math.floor(duration / 25);
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      const scrambled = originalText
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          // If this character position has passed its scramble timeframe, show original char
          if (index / originalText.length < progress) {
            return originalText[index];
          }
          // Otherwise show random noise character
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      setText(scrambled);

      if (frame >= totalFrames) {
        setText(originalText);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isHovered, originalText, duration]);

  const trigger = useCallback(() => setIsHovered(true), []);
  const reset = useCallback(() => setIsHovered(false), []);

  return [text, trigger, reset];
}
