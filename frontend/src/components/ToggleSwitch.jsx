import React from "react";

const ToggleSwitch = ({ checked, onChange, labelLeft = "Off", labelRight = "On" }) => {
  return (
    <label className="flex items-center gap-2 select-none cursor-pointer">
      <span className="text-xs">{labelLeft}</span>
      <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? 'bg-green-500' : 'bg-gray-400'}`}>
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </span>
      <span className="text-xs">{labelRight}</span>
    </label>
  );
};

export default ToggleSwitch;


