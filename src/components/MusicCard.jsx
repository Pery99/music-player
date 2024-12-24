import React from "react";
import { motion } from "framer-motion";
import { BsPlayFill, BsPauseFill, BsClock } from "react-icons/bs";
import { IoMdRepeat, IoMdShuffle } from "react-icons/io";

const MusicCard = ({ track, isPlaying, isActive, onClick, isRepeating, isShuffling }) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer transition-all ${
        isActive
          ? "bg-emerald-500/10 border border-emerald-500/50"
          : "bg-zinc-900/50 hover:bg-zinc-800/50"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
          <img
            src={track.artwork}
            alt={track.title}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/40
            ${
              isActive ? "opacity-100" : "opacity-0 hover:opacity-100"
            } transition-opacity`}
          >
            {isActive && isPlaying ? (
              <BsPauseFill size={24} className="text-white" />
            ) : (
              <BsPlayFill size={24} className="text-white" />
            )}
          </div>
        </div>

        <div className="flex-1">
          <h3
            className={`font-bold ${
              isActive ? "text-emerald-500" : "text-white"
            }`}
          >
            {track.title}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-zinc-400">{track.artist}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400">
              {track.genre}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isActive && (
            <>
              {isRepeating && (
                <IoMdRepeat className="text-emerald-500" size={16} />
              )}
              {isShuffling && (
                <IoMdShuffle className="text-emerald-500" size={16} />
              )}
            </>
          )}
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <BsClock />
            <span>{formatDuration(track.duration)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicCard;
