import React, { useState } from "react";

const ContentUploader = ({ addContent }) => {
  const [text, setText] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#000000");
  const [size, setSize] = useState("3xl");
  const [speed, setSpeed] = useState(5);
  const [marquee, setMarquee] = useState(true);
  const [tickerText, setTickerText] = useState("");
  const [tickerSpeed, setTickerSpeed] = useState(8);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const src = URL.createObjectURL(file);
    const type = file.type.startsWith("video") ? "video" : "image";
    addContent({ type, src, duration: 5000, tickerText, tickerSpeed });
  };

  const handleTextAdd = () => {
    if (!text) return;
    addContent({ type: "text", text, color, bg, size, speed, duration: 5000, marquee });
    setText("");
  };

  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded shadow-md flex flex-col gap-2 z-20">
      <input type="file" onChange={handleFileUpload} />
      <div className="flex flex-col gap-1">
        <label>Text Upload:</label>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="border rounded px-2 py-1" />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
        <select value={size} onChange={(e) => setSize(e.target.value)} className="border rounded px-2 py-1">
          <option value="2xl">2xl</option>
          <option value="3xl">3xl</option>
          <option value="4xl">4xl</option>
          <option value="5xl">5xl</option>
        </select>
        <label>Speed:</label>
        <input type="range" min="1" max="20" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} />
        <label>Marquee:</label>
        <select value={marquee ? 'true' : 'false'} onChange={(e) => setMarquee(e.target.value === 'true')} className="border rounded px-2 py-1">
          <option value="true">Jalan</option>
          <option value="false">Diam</option>
        </select>
        <label>Ticker bawah (untuk image/video):</label>
        <input type="text" value={tickerText} onChange={(e) => setTickerText(e.target.value)} placeholder="Info panjang berjalan di bawah" className="border rounded px-2 py-1" />
        <label>Ticker Speed:</label>
        <input type="range" min="5" max="30" value={tickerSpeed} onChange={(e) => setTickerSpeed(parseInt(e.target.value))} />
        <button onClick={handleTextAdd} className="px-2 py-1 bg-green-500 text-white rounded">Add Text</button>
      </div>
    </div>
  );
};

export default ContentUploader;
