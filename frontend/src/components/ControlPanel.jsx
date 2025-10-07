import React, { useState } from "react";
import { motion } from "framer-motion";
import ColorPicker from "./ColorPicker";
import NeoButton from "./NeoButton";
import ToggleSwitch from "./ToggleSwitch";
import PlaylistManager from "./PlaylistManager";
import AssignPlaylists from "./AssignPlaylists";
import ScheduleManager from "./ScheduleManager";

const ControlPanel = ({
  isRunning,
  toggleRunning,
  addContent,
  resetAll,
  exportJSON,
  importJSON,
  darkMode,
  setDarkMode,
  contents,
  setContents,
  displays,
  setDisplays,
  selectedDisplayId,
  setSelectedDisplayId,
  previewVideoAudio,
  setPreviewVideoAudio,
}) => {
  const [text, setText] = useState("");
  const [textSize, setTextSize] = useState("3xl");
  const [textColor, setTextColor] = useState("");
  const [bgColor, setBgColor] = useState("transparent");
  const [duration, setDuration] = useState(5000);
  const [isMarquee, setIsMarquee] = useState(true);
  const [speed, setSpeed] = useState(5);

  const [mediaFile, setMediaFile] = useState(null);
  const [uploadToServer, setUploadToServer] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uploadToServer') || 'false'); } catch { return false; }
  });
  const [overlayText, setOverlayText] = useState("");
  const [overlaySize, setOverlaySize] = useState("md");
  const [overlayColor, setOverlayColor] = useState("");
  const [overlayBg, setOverlayBg] = useState("transparent");
  const [tickerText, setTickerText] = useState("");
  const [tickerSpeed, setTickerSpeed] = useState(8);
  const [tickerMarquee, setTickerMarquee] = useState(true);

  const handleAddText = () => {
    if (!text) return;
    addContent({
      type: "text",
      text,
      size: textSize,
      color: textColor,
      bg: bgColor,
      duration,
      marquee: isMarquee,
      speed,
    });
    setText("");
  };

  const handleAddMedia = async () => {
    if (!mediaFile) return;
    const type = mediaFile.type.includes("video") ? "video" : "image";
    if (uploadToServer) {
      try {
        const form = new FormData();
        form.append('file', mediaFile);
        form.append('title', mediaFile.name || 'media');
        const resp = await fetch('/api/upload', { method: 'POST', body: form });
        if (!resp.ok) throw new Error('Upload gagal');
        const data = await resp.json();
        addContent({
          type,
          src: data.url || data.path,
          name: data.title || mediaFile.name,
          overlayText: overlayText || "",
          overlaySize,
          overlayColor,
          overlayBg,
          duration,
          tickerText: tickerText || "",
          tickerSpeed,
          tickerMarquee,
        });
      } catch (e) {
        alert('Upload gagal, menggunakan penyimpanan lokal.');
        setUploadToServer(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        addContent({
          type,
          src: dataUrl, // simpan sebagai Data URL agar bisa dipakai di tab fullscreen
          name: mediaFile.name || "media",
          overlayText: overlayText || "",
          overlaySize,
          overlayColor,
          overlayBg,
          duration,
          tickerText: tickerText || "",
          tickerSpeed,
          tickerMarquee,
        });
      };
      reader.readAsDataURL(mediaFile);
    }
    setMediaFile(null);
    setOverlayText("");
    setTickerText("");
  };

  const handleDelete = (index) => {
    const updated = [...contents];
    updated.splice(index, 1);
    setContents(updated);
  };

  return (
    <motion.div
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      } p-4 flex flex-col overflow-y-auto w-full md:w-80 md:h-full`}
      initial={{ x: -300 }}
      animate={{ x: 0 }}
    >
      <h2 className="text-xl font-bold mb-4">Control Panel</h2>
      {/* Multi Display Selector */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Pilih Display</span>
          <button
            onClick={() => {
              const id = prompt("ID Display? (misal: lantai-1)", "");
              if (!id) return;
              const name = prompt("Nama Display?", id) || id;
              if (displays.find(d => d.id === id)) return alert("ID sudah ada");
              const next = [...displays, { id, name }];
              setDisplays(next);
              setSelectedDisplayId(id);
            }}
            className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
          >
            + Display
          </button>
        </div>
        <select
          value={selectedDisplayId}
          onChange={(e) => setSelectedDisplayId(e.target.value)}
          className={`w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
        >
          {displays.map((d) => (
            <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
          ))}
        </select>
        <div className="flex flex-col gap-2">
          <div className="text-xs opacity-80">Link TV (salin dan buka di TV)</div>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={`${(typeof window !== 'undefined' ? (localStorage.getItem('tvBase') || window.location.origin) : '')}/tv/${encodeURIComponent(selectedDisplayId)}`}
              className={`flex-1 p-2 rounded border text-xs ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'}`}
              onFocus={(e) => e.target.select()}
            />
            <button
              onClick={() => {
                const base = localStorage.getItem('tvBase') || window.location.origin;
                const link = `${base}/tv/${encodeURIComponent(selectedDisplayId)}`;
                navigator.clipboard?.writeText(link);
              }}
              className="px-3 py-2 rounded bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm shadow hover:from-emerald-600 hover:to-green-700 transition"
            >
              Copy
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="TV Link Base (mis: http://localhost:3001)"
              defaultValue={typeof window !== 'undefined' ? (localStorage.getItem('tvBase') || window.location.origin) : ''}
              onBlur={(e) => {
                try { localStorage.setItem('tvBase', e.target.value || window.location.origin); } catch {}
              }}
              className={`flex-1 p-2 rounded border text-xs ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'}`}
            />
            <label className="text-xs flex items-center gap-2">
              <input type="checkbox" checked={previewVideoAudio} onChange={(e) => setPreviewVideoAudio(e.target.checked)} />
              Audio Preview Video
            </label>
          </div>
          <button
            onClick={() => {
              if (displays.length <= 1) return alert("Minimal 1 display");
              const conf = confirm(`Hapus display ${selectedDisplayId}?`);
              if (!conf) return;
              const next = displays.filter(d => d.id !== selectedDisplayId);
              setDisplays(next);
              setSelectedDisplayId(next[0].id);
            }}
            className="px-3 py-2 rounded bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm shadow hover:from-rose-600 hover:to-red-700 transition"
          >
            Hapus Display
          </button>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span>Dark Mode</span>
        </label>
      </div>

      {/* Text Content */}
      <div className="mb-6 border-b pb-4">
        <h3 className="font-semibold mb-2">Add Text</h3>
        <input
          type="text"
          placeholder="Text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={`w-full mb-2 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 placeholder-gray-300' : 'bg-white placeholder-gray-500'}`}
        />
        <div className="flex space-x-2 mb-2">
          <select
            value={textSize}
            onChange={(e) => setTextSize(e.target.value)}
            className={`flex-1 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
          >
            <option value="2xl">2xl</option>
            <option value="3xl">3xl</option>
            <option value="4xl">4xl</option>
          </select>
        </div>
        <div className="mb-2">
          <ColorPicker label="Text Color" value={textColor} onChange={setTextColor} darkMode={darkMode} />
        </div>
        <div className="mb-2">
          <ColorPicker label="Background Color" value={bgColor} onChange={setBgColor} darkMode={darkMode} />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Teks berjalan</span>
          <ToggleSwitch checked={isMarquee} onChange={setIsMarquee} labelLeft="Diam" labelRight="Jalan" />
        </div>
        {isMarquee && (
          <div className="mb-2">
            <label className="text-sm">Kecepatan (1-20)</label>
            <input
              type="range"
              min="1"
              max="20"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          placeholder="Duration (ms)"
          className={`w-full mb-2 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
        />
        {/* Preview */}
        {text && (
          <div
            className="mb-2 p-2 border rounded text-center"
            style={{
              color: darkMode && !textColor ? "#fff" : textColor,
              backgroundColor: bgColor,
              fontSize:
                textSize === "2xl"
                  ? "2rem"
                  : textSize === "3xl"
                  ? "3rem"
                  : "4rem",
            }}
          >
            {text}
          </div>
        )}
        <NeoButton color="green" onClick={handleAddText}>Add Text</NeoButton>
      </div>

      {/* Media Content */}
      <div className="mb-6 border-b pb-4">
        <h3 className="font-semibold mb-2">Add Media (Image/Video)</h3>
        <label className="flex items-center gap-2 mb-2 text-sm">
          <input
            type="checkbox"
            checked={uploadToServer}
            onChange={(e) => {
              setUploadToServer(e.target.checked);
              try { localStorage.setItem('uploadToServer', JSON.stringify(e.target.checked)); } catch {}
            }}
          />
          Upload ke Server (pakai URL publik)
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setMediaFile(e.target.files[0])}
          className={`w-full mb-2 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
        />
        <input
          type="text"
          placeholder="Overlay Text"
          value={overlayText}
          onChange={(e) => setOverlayText(e.target.value)}
          className={`w-full mb-2 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 placeholder-gray-300' : 'bg-white placeholder-gray-500'}`}
        />
        <div className="flex space-x-2 mb-2">
          <select
            value={overlaySize}
            onChange={(e) => setOverlaySize(e.target.value)}
            className={`flex-1 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>
        <div className="mb-2">
          <ColorPicker label="Overlay Color" value={overlayColor} onChange={setOverlayColor} darkMode={darkMode} />
        </div>
        <div className="mb-2">
          <ColorPicker label="Overlay Background" value={overlayBg} onChange={setOverlayBg} darkMode={darkMode} />
        </div>
        <div className="mt-2 mb-1 font-semibold">Ticker Bawah (Media)</div>
        <input
          type="text"
          placeholder="Informasi panjang berjalan di bawah"
          value={tickerText}
          onChange={(e) => setTickerText(e.target.value)}
          className={`w-full mb-2 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 placeholder-gray-300' : 'bg-white placeholder-gray-500'}`}
        />
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Ticker berjalan</span>
          <ToggleSwitch checked={tickerMarquee} onChange={setTickerMarquee} labelLeft="Diam" labelRight="Jalan" />
        </div>
        {tickerMarquee && (
          <div className="mb-2">
            <label className="text-sm">Ticker Speed (5-30)</label>
            <input type="range" min="5" max="30" value={tickerSpeed} onChange={(e) => setTickerSpeed(parseInt(e.target.value))} className="w-full" />
          </div>
        )}
        {/* Preview overlay */}
        {overlayText && (
          <div
            className="mb-2 p-1 border rounded text-center"
            style={{
              color: darkMode && !overlayColor ? "#fff" : overlayColor,
              backgroundColor: overlayBg,
              fontSize:
                overlaySize === "sm"
                  ? "1rem"
                  : overlaySize === "md"
                  ? "1.5rem"
                  : "2rem",
            }}
          >
            {overlayText}
          </div>
        )}
        <NeoButton color="blue" onClick={handleAddMedia}>Add Media</NeoButton>
      </div>

      {/* Playlist */}
      <div className="mb-6">
        <PlaylistManager darkMode={darkMode} />
      </div>

      {/* Assign Playlists ke Display */}
      <div className="mb-6">
        <AssignPlaylists selectedDisplayId={selectedDisplayId} darkMode={darkMode} />
      </div>

      {/* Schedule Manager */}
      <div className="mb-6">
        <ScheduleManager selectedDisplayId={selectedDisplayId} darkMode={darkMode} />
      </div>

      {/* Export / Import / Reset */}
      <div className="space-y-2">
        <NeoButton color="purple" onClick={exportJSON}>Export JSON</NeoButton>
        <input
          type="file"
          accept=".json"
          onChange={importJSON}
          className={`w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
        />
        <NeoButton color="red" onClick={resetAll}>Reset All</NeoButton>
        <NeoButton color="amber" onClick={toggleRunning}>{isRunning ? "Pause" : "Play"}</NeoButton>
      </div>
    </motion.div>
  );
};

export default ControlPanel;
