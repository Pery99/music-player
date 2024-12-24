import { parseBlob } from 'music-metadata-browser';

export const extractMetadata = async (file) => {
  try {
    const metadata = await parseBlob(file);
    return {
      title: metadata.common.title || file.name,
      artist: metadata.common.artist || 'Unknown Artist',
      album: metadata.common.album || 'Unknown Album',
      duration: metadata.format.duration,
      picture: metadata.common.picture?.[0] ? 
        URL.createObjectURL(new Blob([metadata.common.picture[0].data])) : 
        null
    };
  } catch (error) {
    console.error('Error extracting metadata:', error);
    return null;
  }
};

export const createAudioContext = (audioElement) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();
  const source = audioCtx.createMediaElementSource(audioElement);
  
  analyser.fftSize = 256;
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  
  return analyser;
};
