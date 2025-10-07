import React, { useEffect, useRef, useState } from "react";
import DisplayScreen from "../components/DisplayScreen";
import { useParams } from "react-router-dom";

function DisplayPage() {
  const { id } = useParams();
  const [contents, setContents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const displayKeyRaw = id || localStorage.getItem('selectedDisplayId') || 'default';
    // Jika numeric id tersedia, gunakan angka untuk endpoint Laravel binding implicit
    const numericId = /^\d+$/.test(String(displayKeyRaw)) ? String(displayKeyRaw) : null;
    const displayKey = numericId || displayKeyRaw;

    const load = async () => {
      // 1) Coba ambil dari API
      try {
        const resp = await fetch(`/api/displays/${encodeURIComponent(displayKey)}/playlist`);
        if (resp.ok) {
          const data = await resp.json();
          const items = Array.isArray(data.items) ? data.items : [];
          // Map ke struktur frontend
          const mapped = items.map((it) => {
            const c = it.content || {};
            if (c.type === 'image' || c.type === 'video') {
              return {
                type: c.type,
                src: c.url || c.path || '',
                duration: it.duration || c.duration || 5000,
                overlayText: c.metadata?.overlayText || '',
                overlaySize: c.metadata?.overlaySize || 'md',
                overlayColor: c.metadata?.overlayColor || '',
                overlayBg: c.metadata?.overlayBg || 'transparent',
                tickerText: c.metadata?.tickerText || '',
                tickerSpeed: c.metadata?.tickerSpeed || 8,
                tickerMarquee: c.metadata?.tickerMarquee ?? true,
              };
            }
            // text/html/url -> tampilkan sebagai text (jika metadata ada)
            return {
              type: 'text',
              text: c.metadata?.text || c.title || '',
              size: c.metadata?.size || '3xl',
              color: c.metadata?.color || '',
              bg: c.metadata?.bg || 'transparent',
              marquee: c.metadata?.marquee ?? true,
              speed: c.metadata?.speed || 5,
              duration: it.duration || c.duration || 5000,
            };
          });
          if (!cancelled) {
            setContents(mapped);
            setCurrentIndex(0);
          }
        }
      } catch {}

      // 2) Fallback ke localStorage
      try {
        const saved = JSON.parse(localStorage.getItem(`playlist:${displayKey}`) || "[]");
        const savedDark = JSON.parse(localStorage.getItem(`darkMode:${displayKey}`) || "false");
        if (!cancelled) {
          if (!Array.isArray(contents) || contents.length === 0) {
            setContents(Array.isArray(saved) ? saved : []);
            setCurrentIndex(0);
          }
          setDarkMode(!!savedDark);
        }
      } catch {}
    };

    load();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    const current = contents[currentIndex];
    if (!isRunning || !current) return;
    const duration = current.duration || 5000;
    const t = setTimeout(() => {
      setCurrentIndex((p) => (p + 1) % (contents.length || 1));
    }, duration);
    return () => clearTimeout(t);
  }, [contents, currentIndex, isRunning]);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(`playlist:${id || localStorage.getItem('selectedDisplayId') || 'default'}`) || "[]");
        const savedDark = JSON.parse(localStorage.getItem(`darkMode:${id || localStorage.getItem('selectedDisplayId') || 'default'}`) || "false");
        setContents(Array.isArray(saved) ? saved : []);
        setDarkMode(!!savedDark);
        if (currentIndex >= (saved?.length || 0)) setCurrentIndex(0);
      } catch {}
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const enterFullscreen = () => {
    const el = containerRef.current || document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  const current = contents[currentIndex] || null;

  return (
    <div ref={containerRef} className={`w-screen h-screen ${darkMode ? "bg-black" : "bg-gray-100"} relative`}>
      <button
        onClick={enterFullscreen}
        className="absolute top-3 right-3 z-30 px-3 py-1 rounded bg-blue-600 text-white opacity-80 hover:opacity-100"
      >
        Fullscreen
      </button>
      <DisplayScreen currentContent={current} isRunning={isRunning} darkMode={darkMode} />
    </div>
  );
}

export default DisplayPage;


