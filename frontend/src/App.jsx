import React, { useState, useEffect } from "react";
import ControlPanel from "./components/ControlPanel";
import DisplayScreen from "./components/DisplayScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DisplayPage from "./pages/Display";
import DisplaysGrid from "./components/DisplaysGrid";

function App() {
  const [contents, setContents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Multi-display (beberapa tampilan)
  const [displays, setDisplays] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("displays") || "null");
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch {}
    return [{ id: "default", name: "Default" }];
  });
  const [selectedDisplayId, setSelectedDisplayId] = useState(() => {
    try {
      return localStorage.getItem("selectedDisplayId") || "default";
    } catch { return "default"; }
  });

  const currentContent = contents[currentIndex] || null;

  // Tambah konten baru (per display)
  const addContent = (item) => {
    setContents([...contents, item]);
  };

  // Update konten tertentu (misal edit overlay / teks)
  const updateContent = (index, newContent) => {
    const updated = [...contents];
    updated[index] = newContent;
    setContents(updated);
  };

  // Reset semua konten (per display)
  const resetAll = () => {
    setContents([]);
    setCurrentIndex(0);
  };

  // Export JSON
  const exportJSON = () => {
    try {
      const dataStr = JSON.stringify(contents, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `playlist-${selectedDisplayId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch {}
  };

  // Import JSON
  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        setContents(imported);
        setCurrentIndex(0);
      } catch (err) {
        alert("Invalid JSON file!");
      }
    };
    reader.readAsText(file);
  };

  // Toggle play/pause
  const toggleRunning = () => {
    setIsRunning(!isRunning);
  };

  // Auto next konten sesuai duration
  useEffect(() => {
    if (!isRunning || !currentContent) return;
    const duration = currentContent.duration || 5000;
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % contents.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [currentContent, isRunning, contents]);

  // Persist multi-display list & pilihan aktif
  useEffect(() => {
    try { localStorage.setItem("displays", JSON.stringify(displays)); } catch {}
  }, [displays]);
  useEffect(() => {
    try { localStorage.setItem("selectedDisplayId", selectedDisplayId); } catch {}
  }, [selectedDisplayId]);

  // Muat konten & darkMode saat ganti display
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`playlist:${selectedDisplayId}`) || "[]");
      setContents(Array.isArray(saved) ? saved : []);
      const savedDark = JSON.parse(localStorage.getItem(`darkMode:${selectedDisplayId}`) || "false");
      setDarkMode(!!savedDark);
      setCurrentIndex(0);
    } catch {}
  }, [selectedDisplayId]);

  // Sinkronisasi playlist dan mode gelap ke localStorage per display
  useEffect(() => {
    try {
      localStorage.setItem(`playlist:${selectedDisplayId}`, JSON.stringify(contents));
      localStorage.setItem(`playlistVersion:${selectedDisplayId}`, String(Date.now()));
    } catch {}
  }, [contents, selectedDisplayId]);

  useEffect(() => {
    try { localStorage.setItem(`darkMode:${selectedDisplayId}`, JSON.stringify(darkMode)); } catch {}
  }, [darkMode, selectedDisplayId]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div
              className={`flex h-screen flex-col md:flex-row ${
                darkMode ? "bg-gray-900" : "bg-gray-100"
              }`}
            >
              {/* Control Panel */}
              <ControlPanel
                isRunning={isRunning}
                toggleRunning={toggleRunning}
                addContent={addContent}
                resetAll={resetAll}
                exportJSON={exportJSON}
                importJSON={importJSON}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                contents={contents}
                setContents={setContents}
                updateContent={updateContent}
                displays={displays}
                setDisplays={setDisplays}
                selectedDisplayId={selectedDisplayId}
                setSelectedDisplayId={setSelectedDisplayId}
              />

              {/* Display Screen */}
              <div className="flex-1 flex flex-col overflow-y-auto">
                {/* Grid preview semua display */}
                <DisplaysGrid
                  displays={displays}
                  selectedDisplayId={selectedDisplayId}
                  setSelectedDisplayId={setSelectedDisplayId}
                  darkMode={darkMode}
                />
              </div>
            </div>
          }
        />
        <Route path="/display/:id" element={<DisplayPage />} />
        <Route path="/display" element={<DisplayPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
