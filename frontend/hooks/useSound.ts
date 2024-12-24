"use client";

import { useState, useEffect, useCallback } from "react";
interface SoundOptions {
  volume?: number;
  loop?: boolean;
}

export const useSound = () => {
  const [bellSound, setBellSound] = useState<HTMLAudioElement | null>(null);
  const [bgMusic, setBgMusic] = useState<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Initialize bell sound
    const bell = new Audio("/sounds/jingle-bells-107671.mp3");
    setBellSound(bell);

    // Initialize background music
    const music = new Audio("/sounds/glockenspiel2-35077.mp3");
    music.loop = true;
    setBgMusic(music);

    return () => {
      bell.pause();
      music.pause();
      bell.currentTime = 0;
      music.currentTime = 0;
    };
  }, []);

  const playSound = useCallback(
    (sound: HTMLAudioElement | null, options: SoundOptions = {}) => {
      if (!sound) return;

      sound.volume = options.volume ?? 1;
      if (options.loop !== undefined) {
        sound.loop = options.loop;
      }

      sound.currentTime = 0;
      sound.play();
    },
    []
  );

  const playBell = useCallback(() => {
    playSound(bellSound, { volume: 0.5 });
  }, [bellSound, playSound]);

  const toggleMusic = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    setIsMusicPlaying((prev) => !prev);
    if (!bgMusic) return;

    if (isMusicPlaying) {
      bgMusic.pause();
    } else {
      playSound(bgMusic, { volume: 0.3, loop: true });
    }
  }, [bgMusic, isMusicPlaying, playSound, hasInteracted]);

  return {
    playBell,
    toggleMusic,
    isMusicPlaying,
    hasInteracted,
  };
};
