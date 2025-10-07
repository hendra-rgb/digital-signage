import React, { useEffect, useState } from "react";

function MiniPreview({ displayId, darkMode, onClick, isActive, previewVideoAudio }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    const load = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(`playlist:${displayId}`) || "[]");
        setContent(Array.isArray(saved) && saved.length > 0 ? saved[0] : null);
      } catch {
        setContent(null);
      }
    };
    load();
    const t = setInterval(load, 1000);
    return () => clearInterval(t);
  }, [displayId]);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border overflow-hidden ${
        isActive ? "ring-2 ring-blue-500" : "border-gray-300"
      } ${darkMode ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="px-3 py-2 flex items-center justify-between">
        <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>{displayId}</span>
        <span className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-500"}`}>preview</span>
      </div>
      <div className="w-full aspect-video bg-black flex items-center justify-center relative">
        {!content && (
          <span className="text-sm text-gray-300">No content</span>
        )}
        {content && content.type === "image" && (
          <img src={content.src} alt="preview" className="w-full h-full object-contain" />
        )}
        {content && content.type === "video" && (
          <video
            src={content.src}
            className="w-full h-full object-contain"
            autoPlay
            loop
            playsInline
            controls
            muted={!previewVideoAudio}
          />
        )}
        {content && content.type === "text" && (
          <div
            className="absolute px-2 py-1 rounded"
            style={{
              color: darkMode ? "#ffffff" : (content.color || "#000000"),
              backgroundColor: content.bg || "transparent",
              fontSize:
                content.size === "2xl" ? "0.9rem" : content.size === "3xl" ? "1.1rem" : "1.3rem",
            }}
          >
            {content.text}
          </div>
        )}
      </div>
    </button>
  );
}

const DisplaysGrid = ({ displays, selectedDisplayId, setSelectedDisplayId, darkMode, previewVideoAudio }) => {
  return (
    <div className="w-full p-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
        {displays.map((d) => (
          <MiniPreview
            key={d.id}
            displayId={d.id}
            darkMode={darkMode}
            isActive={selectedDisplayId === d.id}
            onClick={() => setSelectedDisplayId(d.id)}
            previewVideoAudio={previewVideoAudio}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplaysGrid;


