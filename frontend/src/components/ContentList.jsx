import React from "react";

const ContentList = ({ contents, setContents, setCurrentIndex, currentIndex }) => {
  const handleDelete = (index) => {
    const newContents = contents.filter((_, i) => i !== index);
    setContents(newContents);
    if (currentIndex >= newContents.length) setCurrentIndex(newContents.length - 1);
  };

  return (
    <div className="absolute bottom-4 left-4 bg-white p-4 rounded shadow-md flex flex-col gap-1 z-20 max-h-64 overflow-y-auto">
      {contents.map((c, i) => (
        <div
          key={i}
          className={`flex justify-between items-center p-1 border rounded cursor-pointer ${currentIndex === i ? "bg-blue-100" : ""}`}
          onClick={() => setCurrentIndex(i)}
        >
          <span>{c.type === "text" ? c.text : c.type}</span>
          <button onClick={() => handleDelete(i)} className="px-1 py-0.5 bg-red-500 text-white rounded">X</button>
        </div>
      ))}
    </div>
  );
};

export default ContentList;
