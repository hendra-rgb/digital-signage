import React, { useEffect, useRef } from "react";

const DisplayScreen = ({ currentContent, isRunning, darkMode }) => {
  const marqueeMainRef = useRef(null);
  const tickerRef = useRef(null);

  useEffect(() => {
    const resetAnim = (el) => {
      if (!el) return;
      el.style.animation = "none";
      void el.offsetHeight;
      el.style.animation = null;
    };
    resetAnim(marqueeMainRef.current);
    resetAnim(tickerRef.current);
  }, [currentContent]);

  if (!currentContent) {
    return (
      <div
        className={`flex-1 flex items-center justify-center text-3xl ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        No content
      </div>
    );
  }

  // Helpers: kontras warna agar teks selalu terbaca
  const parseHex = (hex) => {
    if (!hex || typeof hex !== "string") return null;
    const h = hex.replace('#','');
    if (h.length === 3) {
      const r = parseInt(h[0] + h[0], 16);
      const g = parseInt(h[1] + h[1], 16);
      const b = parseInt(h[2] + h[2], 16);
      return { r, g, b };
    }
    if (h.length === 6) {
      const r = parseInt(h.substring(0,2), 16);
      const g = parseInt(h.substring(2,4), 16);
      const b = parseInt(h.substring(4,6), 16);
      return { r, g, b };
    }
    return null;
  };

  const getLuminance = (hex) => {
    const rgb = parseHex(hex);
    if (!rgb) return 0;
    const toLinear = (c) => {
      const cs = c / 255;
      return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
    };
    const r = toLinear(rgb.r);
    const g = toLinear(rgb.g);
    const b = toLinear(rgb.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const isLightColor = (hex) => {
    try { return getLuminance(hex) > 0.7; } catch { return false; }
  };

  const getContrastingTextColor = (backgroundHex, isDarkMode, explicitColor) => {
    // Jika ada warna eksplisit dan bukan dark mode, pakai warna eksplisit
    if (!isDarkMode && explicitColor) return explicitColor;
    // Saat dark mode, pastikan teks putih kecuali background sangat terang (mis. putih)
    if (isDarkMode) {
      if (backgroundHex && isLightColor(backgroundHex)) return "#000000";
      return "#ffffff";
    }
    // Default non-dark mode
    if (explicitColor) return explicitColor;
    // Jika ada background terang, pakai hitam, selain itu tetap hitam sebagai default
    if (backgroundHex && isLightColor(backgroundHex)) return "#000000";
    return "#000000";
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-black">
      {/* Text Content */}
      {currentContent.type === "text" && (
        <div className="absolute inset-0 flex items-center overflow-hidden">
          <div
            ref={marqueeMainRef}
            className="whitespace-nowrap inline-block"
            style={{
              color: getContrastingTextColor(currentContent.bg, darkMode, currentContent.color),
              fontSize:
                currentContent.size === "2xl"
                  ? "2rem"
                  : currentContent.size === "3xl"
                  ? "3rem"
                  : currentContent.size === "5xl"
                  ? "5rem"
                  : "4rem",
              backgroundColor: currentContent.bg || "transparent",
              animation: currentContent.marquee !== false && isRunning ? `marquee ${(currentContent.speed || 5)}s linear infinite` : "none",
              marginLeft: currentContent.marquee !== false ? "100%" : "0",
              width: "fit-content",
              willChange: currentContent.marquee !== false && isRunning ? "transform" : "auto",
            }}
          >
            {currentContent.text}
          </div>
        </div>
      )}

      {/* Media */}
      {currentContent.type === "image" && (
        <img
          src={currentContent.src}
          alt="media"
          className="w-full h-full object-contain"
        />
      )}

      {currentContent.type === "video" && (
        <video
          src={currentContent.src}
          className="w-full h-full object-contain"
          autoPlay={isRunning}
          loop
          muted
        />
      )}

      {/* Overlay Text */}
      {(currentContent.type === "image" ||
        currentContent.type === "video") &&
        currentContent.overlayText && (
          <div
            className="absolute bottom-4 w-full text-center"
            style={{
              color: getContrastingTextColor(currentContent.overlayBg, darkMode, currentContent.overlayColor),
              fontSize:
                currentContent.overlaySize === "sm"
                  ? "1rem"
                  : currentContent.overlaySize === "md"
                  ? "1.5rem"
                  : "2rem",
              backgroundColor: currentContent.overlayBg || "transparent",
            }}
          >
            {currentContent.overlayText}
          </div>
        )}

      {/* Ticker text berjalan di bawah media */}
      {(currentContent.type === "image" || currentContent.type === "video") && currentContent.tickerText && (
        <div className="absolute bottom-0 w-full py-2 bg-black/60 overflow-hidden z-20">
          <div
            ref={tickerRef}
            className="whitespace-nowrap"
            style={{
              color: getContrastingTextColor("#000000", true, currentContent.tickerColor || "#ffffff"),
              animation: currentContent.tickerMarquee === false || !isRunning ? "none" : `marquee ${(currentContent.tickerSpeed || 8)}s linear infinite`,
              marginLeft: currentContent.tickerMarquee === false ? "0" : "100%",
              width: "fit-content",
            }}
          >
            {currentContent.tickerText}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayScreen;
