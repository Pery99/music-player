import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { tracks } from "./data/tracks";
import MusicCard from "./components/MusicCard";
import {
  BsFillPlayFill,
  BsPauseFill,
  BsSkipEndFill,
  BsSkipStartFill,
} from "react-icons/bs";
import { IoMdShuffle, IoMdRepeat } from "react-icons/io";
import { BiVolumeFull, BiVolumeMute } from "react-icons/bi";

const App = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    // Preload images
    const preloadImages = tracks.map(track => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = track.artwork;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    Promise.all(preloadImages)
      .then(() => setIsLoading(false))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      if (isPlaying) audioRef.current.play();
    }
  }, [currentTrack, volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleNext);
      return () => {
        audioRef.current?.removeEventListener('ended', handleNext);
      };
    }
  }, [currentTrack]);

  // Add buffering detection
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleWaiting = () => setIsBuffering(true);
      const handlePlaying = () => setIsBuffering(false);
      
      audio.addEventListener('waiting', handleWaiting);
      audio.addEventListener('playing', handlePlaying);
      
      return () => {
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('playing', handlePlaying);
      };
    }
  }, []);

  // Update audio loading handler with better initial load handling
  useEffect(() => {
    const handleInitialLoad = () => {
      setIsAudioLoading(false);
      setDuration(audioRef.current.duration);
    };

    if (audioRef.current) {
      setIsAudioLoading(true); // Set loading state when track changes
      
      const handleLoadStart = () => setIsAudioLoading(true);
      const handleCanPlay = () => setIsAudioLoading(false);
      
      audioRef.current.addEventListener('loadstart', handleLoadStart);
      audioRef.current.addEventListener('canplay', handleCanPlay);
      audioRef.current.addEventListener('loadedmetadata', handleInitialLoad);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadstart', handleLoadStart);
          audioRef.current.removeEventListener('canplay', handleCanPlay);
          audioRef.current.removeEventListener('loadedmetadata', handleInitialLoad);
        }
      };
    }
  }, [currentTrack]);

  // Add this effect to handle track changes
  useEffect(() => {
    setIsAudioLoading(true);
  }, [currentTrack]);

  // Add effect to handle auto-play on track change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    setProgress(e.target.value);
  };

  // Update handleNext to handle shuffle properly
  const handleNext = () => {
    if (shuffle) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (nextIndex === currentTrack && tracks.length > 1);
      setCurrentTrack(nextIndex);
    } else {
      setCurrentTrack((prev) => (prev + 1) % tracks.length);
    }
    setIsPlaying(true); // Ensure playing state is set
  };

  // Update handleEnded to properly handle repeat and shuffle
  const handleEnded = () => {
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    } else {
      handleNext();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Update control button handlers
  const toggleShuffle = () => {
    setShuffle(prev => !prev);
  };

  const toggleRepeat = () => {
    setRepeat(prev => !prev);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-emerald-500 space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-emerald-500/80">Loading your music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="container mx-auto px-4 py-8">
        {/* Now Playing */}
        <div className="mb-12">
          <motion.div 
            className="flex flex-col md:flex-row gap-8 items-center p-6 rounded-2xl bg-zinc-800/50 backdrop-blur-xl"
            layoutId={`card-${currentTrack}`}
          >
            <div className="relative w-64 h-64 rounded-xl overflow-hidden shadow-2xl">
              <motion.img
                key={tracks[currentTrack].artwork}
                src={tracks[currentTrack].artwork}
                alt={tracks[currentTrack].title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <motion.h1
                key={tracks[currentTrack].title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold mb-2 text-white"
              >
                {tracks[currentTrack].title}
              </motion.h1>
              <motion.p
                key={tracks[currentTrack].artist}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl mb-8 text-zinc-400"
              >
                {tracks[currentTrack].artist}
              </motion.p>
              
              {/* Add Genre Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm mb-8"
              >
                {tracks[currentTrack].genre}
              </motion.div>

              {/* Progress Bar */}
              <div className="mb-8 space-y-2">
                <div className="flex items-center gap-2 relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className={`w-full h-2 rounded-full appearance-none cursor-pointer bg-zinc-700
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-3
                      [&::-webkit-slider-thumb]:h-3
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-emerald-500
                      hover:[&::-webkit-slider-thumb]:bg-emerald-400
                      ${isAudioLoading ? 'opacity-50' : ''}`}
                  />
                  {isAudioLoading && (
                    <div className="absolute inset-0 overflow-hidden rounded-full">
                      <div className="h-full w-1/3 bg-emerald-500/20 animate-loading-bar" />
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>{isAudioLoading ? '--:--' : formatTime(currentTime)}</span>
                  <span>{isAudioLoading ? '--:--' : formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-center md:justify-start gap-6">
                  <button
                    onClick={toggleShuffle}
                    className={`p-2 transition-colors ${
                      shuffle
                        ? "text-emerald-500"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <IoMdShuffle size={24} />
                  </button>

                  <button
                    onClick={() =>
                      setCurrentTrack(
                        (prev) => (prev - 1 + tracks.length) % tracks.length
                      )
                    }
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    <BsSkipStartFill size={32} />
                  </button>

                  <button
                    onClick={togglePlay}
                    disabled={isBuffering}
                    className={`p-4 bg-emerald-500 rounded-full transition-colors
                      ${isBuffering ? 'opacity-50 cursor-wait' : 'hover:bg-emerald-600'}`}
                  >
                    {isPlaying ? (
                      <BsPauseFill size={32} className="text-white" />
                    ) : (
                      <BsFillPlayFill size={32} className="text-white" />
                    )}
                  </button>

                  <button
                    onClick={() =>
                      setCurrentTrack((prev) => (prev + 1) % tracks.length)
                    }
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    <BsSkipEndFill size={32} />
                  </button>

                  <button
                    onClick={toggleRepeat}
                    className={`p-2 transition-colors ${
                      repeat
                        ? "text-emerald-500"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <IoMdRepeat size={24} />
                  </button>
                </div>

                {/* Volume Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleMute}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    {isMuted ? (
                      <BiVolumeMute size={24} />
                    ) : (
                      <BiVolumeFull size={24} />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-3
                      [&::-webkit-slider-thumb]:h-3
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-emerald-500
                      hover:[&::-webkit-slider-thumb]:bg-emerald-400"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Playlist */}
        <div className="space-y-2">
          {tracks.map((track, index) => (
            <MusicCard
              key={index}
              track={track}
              isPlaying={isPlaying && currentTrack === index}
              isActive={currentTrack === index}
              isRepeating={repeat}
              isShuffling={shuffle}
              onClick={() => {
                setCurrentTrack(index);
                if (!isPlaying) togglePlay();
              }}
            />
          ))}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={tracks[currentTrack].url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onLoadedData={() => setIsAudioLoading(false)}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default App;
