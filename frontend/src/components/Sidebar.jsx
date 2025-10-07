import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="bg-gray-800 text-white w-64 h-screen p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">Menu</h2>
      <Link to="/" className="mb-4 hover:bg-gray-700 px-3 py-2 rounded">Dashboard</Link>
      <Link to="/display" className="mb-4 hover:bg-gray-700 px-3 py-2 rounded">Display Screen</Link>
      <Link to="/settings" className="hover:bg-gray-700 px-3 py-2 rounded">Settings</Link>
    </div>
  );
}

export default Sidebar;
