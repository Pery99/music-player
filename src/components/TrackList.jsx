import React from 'react';
import { motion } from 'framer-motion';
import { BsPlayFill, BsPauseFill } from 'react-icons/bs';

const TrackList = ({ tracks, currentTrack, isPlaying, onTrackSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
      {tracks.map((track, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onTrackSelect(index)}
          className={`group relative overflow-hidden rounded-xl cursor-pointer ${
            currentTrack === index ? 'ring-2 ring-emerald-500' : ''
          }`}
        >
          <div className="relative aspect-square">
            <img 
              src={track.artwork} 
              alt={track.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`p-4 rounded-full bg-emerald-500/80 transition-transform duration-300 ${
                currentTrack === index && isPlaying
                  ? 'scale-100'
                  : 'scale-0 group-hover:scale-100'
              }`}>
                {currentTrack === index && isPlaying ? (
                  <BsPauseFill size={24} className="text-white" />
                ) : (
                  <BsPlayFill size={24} className="text-white" />
                )}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white font-bold truncate">{track.title}</h3>
            <p className="text-gray-300 text-sm truncate">{track.artist}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TrackList;
