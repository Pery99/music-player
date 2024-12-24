import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tracks } from './data/tracks';
import MusicCard from './components/MusicCard';
import {
  BsFillPlayFill, BsPauseFill, BsSkipEndFill, BsSkipStartFill,
  BsVolumeUp, BsVolumeMute
} from 'react-icons/bs';
import { IoMdShuffle, IoMdRepeat } from 'react-icons/io';

const App = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(progress);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800">
      <div className="container mx-auto px-4 py-8">
        {/* Now Playing */}
        <div className="mb-12">
          <motion.div 
            className="flex flex-col md:flex-row gap-8 items-center p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-lg"
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
                className="text-4xl font-bold text-white mb-2"
              >
                {tracks[currentTrack].title}
              </motion.h1>
              <motion.p
                key={tracks[currentTrack].artist}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl text-zinc-400 mb-8"
              >
                {tracks[currentTrack].artist}
              </motion.p>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center md:justify-start gap-6">
                <button
                  onClick={() => setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length)}
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <BsSkipStartFill size={32} />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-4 bg-emerald-500 rounded-full hover:bg-emerald-600 transition-colors"
                >
                  {isPlaying ? (
                    <BsPauseFill size={32} className="text-white" />
                  ) : (
                    <BsFillPlayFill size={32} className="text-white" />
                  )}
                </button>

                <button
                  onClick={() => setCurrentTrack((prev) => (prev + 1) % tracks.length)}
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <BsSkipEndFill size={32} />
                </button>
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
        onEnded={() => setCurrentTrack((prev) => (prev + 1) % tracks.length)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default App;
