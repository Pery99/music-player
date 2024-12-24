import React, { useEffect, useRef } from "react";

const Waveform = ({ audioData, isPlaying }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#22c55e");
    gradient.addColorStop(1, "#10b981");

    ctx.fillStyle = gradient;

    const barWidth = canvas.width / audioData.length;
    audioData.forEach((value, index) => {
      const height = (value / 255) * canvas.height;
      const x = index * barWidth;
      const y = canvas.height - height;

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth - 1, height, 2);
      ctx.fill();
    });
  }, [audioData]);

  return (
    <canvas
      ref={canvasRef}
      width={1024}
      height={100}
      className={`w-full transition-opacity duration-300 ${
        isPlaying ? "opacity-100" : "opacity-30"
      }`}
    />
  );
};

export default Waveform;
