import React from "react";

const DisplayControls = ({ isRunning, toggleRunning, interval, setIntervalTime, content, updateContent }) => {
  const handleChange = (e) => {
    const val = parseInt(e.target.value);
    setIntervalTime(val);
  };

  const handleTextChange = (e) => updateContent({ ...content, text: e.target.value });
  const handleColorChange = (e) => updateContent({ ...content, color: e.target.value });
  const handleBgChange = (e) => updateContent({ ...content, bg: e.target.value });
  const handleSizeChange = (e) => updateContent({ ...content, size: e.target.value });
  const handleSpeedChange = (e) => updateContent({ ...content, speed: parseInt(e.target.value) });

  return (
    <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-md flex flex-col gap-2 z-20">
      <button onClick={toggleRunning} className="px-2 py-1 rounded bg-blue-500 text-white">
        {isRunning ? "Pause" : "Play"}
      </button>

      <div className="flex flex-col gap-1">
        <label>Text:</label>
        <input type="text" value={content.text || ""} onChange={handleTextChange} className="border rounded px-2 py-1" />
      </div>

      <div className="flex flex-col gap-1">
        <label>Text Color:</label>
        <input type="color" value={content.color || "#ffffff"} onChange={handleColorChange} />
      </div>

      <div className="flex flex-col gap-1">
        <label>Background Color:</label>
        <input type="color" value={content.bg || "#000000"} onChange={handleBgChange} />
      </div>

      <div className="flex flex-col gap-1">
        <label>Font Size:</label>
        <select value={content.size || "3xl"} onChange={handleSizeChange} className="border rounded px-2 py-1">
          <option value="2xl">2xl</option>
          <option value="3xl">3xl</option>
          <option value="4xl">4xl</option>
          <option value="5xl">5xl</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label>Marquee Speed:</label>
        <input type="range" min="1" max="20" value={content.speed || 5} onChange={handleSpeedChange} />
        <span>{content.speed || 5}</span>
      </div>

      <div className="flex flex-col gap-1">
        <label>Interval (ms):</label>
        <input type="number" value={interval || 5000} onChange={handleChange} className="border rounded px-2 py-1" />
      </div>
    </div>
  );
};

export default DisplayControls;
