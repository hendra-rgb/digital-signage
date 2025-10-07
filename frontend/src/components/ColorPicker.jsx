import React, { useState, useEffect } from "react";

const PRESETS = [
  "#000000", "#ffffff", "#ff0000", "#ff6b6b", "#ffa502",
  "#ffd93d", "#2ed573", "#1abc9c", "#3498db", "#6c5ce7",
  "#a55eea", "#ff8ed4", "#8e44ad", "#2c3e50", "#95a5a6"
];

function normalizeHex(value) {
  if (!value) return "";
  let v = value.trim();
  if (!v.startsWith("#")) v = `#${v}`;
  if (v.length === 4) {
    // expand short hex #abc -> #aabbcc
    v = `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  }
  return v.slice(0, 7);
}

const Swatch = ({ color, onPick, active }) => (
  <button
    onClick={() => onPick(color)}
    title={color}
    className={`w-6 h-6 rounded-md border transition transform hover:scale-105 ${
      active ? "ring-2 ring-blue-500" : ""
    }`}
    style={{ backgroundColor: color }}
  />
);

const ColorPicker = ({ label, value, onChange, darkMode }) => {
  const [hex, setHex] = useState(value || "#ffffff");

  useEffect(() => {
    if (value) setHex(normalizeHex(value));
  }, [value]);

  const handleHex = (v) => {
    const nv = normalizeHex(v);
    setHex(nv);
    if (/^#([0-9a-fA-F]{6})$/.test(nv)) onChange(nv);
  };

  const handleInput = (e) => {
    const nv = e.target.value;
    setHex(nv);
    if (/^#([0-9a-fA-F]{6})$/.test(nv)) onChange(nv);
  };

  const bgCard = darkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200";

  return (
    <div className={`rounded-xl border ${bgCard} p-3 space-y-2 backdrop-blur`}> 
      {label && (
        <div className={`text-xs font-semibold ${darkMode ? "text-gray-200" : "text-gray-600"}`}>{label}</div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hex}
          onChange={(e) => handleHex(e.target.value)}
          className="w-12 h-10 p-0 rounded-md border cursor-pointer"
          aria-label={`${label || "Color"} picker`}
        />
        <input
          type="text"
          value={hex}
          onChange={handleInput}
          placeholder="#FFFFFF"
          className={`flex-1 px-3 py-2 rounded-md border outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-300' : 'bg-white placeholder-gray-500'}`}
        />
        <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: hex }} />
      </div>
      <div className="grid grid-cols-8 gap-1">
        {PRESETS.map((c) => (
          <Swatch key={c} color={c} onPick={(col) => handleHex(col)} active={hex.toLowerCase() === c.toLowerCase()} />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;


