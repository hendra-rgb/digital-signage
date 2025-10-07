import React from "react";
import PropTypes from "prop-types";

const NeoButton = ({ children, onClick, color = "blue", disabled }) => {
  const variants = {
    blue: {
      gradient: "from-sky-400 to-blue-600",
      border: "border-blue-700",
      glow: "shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_14px_rgba(59,130,246,0.35)]",
    },
    red: {
      gradient: "from-rose-400 to-red-600",
      border: "border-red-700",
      glow: "shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_14px_rgba(239,68,68,0.35)]",
    },
    green: {
      gradient: "from-emerald-400 to-green-600",
      border: "border-green-700",
      glow: "shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_14px_rgba(34,197,94,0.35)]",
    },
    amber: {
      gradient: "from-amber-400 to-yellow-600",
      border: "border-amber-700",
      glow: "shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_14px_rgba(245,158,11,0.35)]",
    },
    purple: {
      gradient: "from-fuchsia-400 to-purple-600",
      border: "border-purple-700",
      glow: "shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_14px_rgba(168,85,247,0.35)]",
    },
  };
  const palette = variants[color] || variants.blue;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center w-full select-none px-4 py-2 rounded-xl border ${palette.border} bg-gradient-to-b ${palette.gradient} text-white font-semibold ${palette.glow} transition active:translate-y-[2px] active:shadow-sm disabled:opacity-50`}
    >
      <span className="absolute inset-x-0 -top-1 h-1 rounded-t-xl bg-white/30" />
      <span className="relative z-10">{children}</span>
    </button>
  );
};

NeoButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  color: PropTypes.oneOf(["blue", "red", "green", "amber", "purple"]),
  disabled: PropTypes.bool,
};

NeoButton.defaultProps = {
  onClick: undefined,
  color: "blue",
  disabled: false,
};

export default NeoButton;


