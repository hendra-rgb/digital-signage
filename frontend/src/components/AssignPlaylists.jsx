import React, { useEffect, useState } from "react";
import NeoButton from "./NeoButton";

const AssignPlaylists = ({ selectedDisplayId, darkMode }) => {
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    try { const r = await fetch('/api/playlists'); setAllPlaylists(await r.json()); } catch {}
  };
  const loadAssigned = async () => {
    if (!selectedDisplayId) return;
    setLoading(true);
    try { const r = await fetch(`/api/displays/${encodeURIComponent(selectedDisplayId)}/playlists`); setAssigned(await r.json()); } catch { setAssigned([]); }
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);
  useEffect(() => { loadAssigned(); }, [selectedDisplayId]);

  const attach = async (playlistId) => {
    await fetch(`/api/displays/${encodeURIComponent(selectedDisplayId)}/playlists`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ playlist_id: playlistId }) });
    loadAssigned();
  };

  const detach = async (playlistId) => {
    await fetch(`/api/displays/${encodeURIComponent(selectedDisplayId)}/playlists/${playlistId}`, { method: 'DELETE' });
    loadAssigned();
  };

  const bump = async (playlistId, newPriority) => {
    await fetch(`/api/displays/${encodeURIComponent(selectedDisplayId)}/playlists/${playlistId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ priority: newPriority }) });
    loadAssigned();
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-3 rounded border`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Assign Playlists ke Display</h3>
        {loading && <span className="text-xs opacity-70">Loading…</span>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="font-medium mb-1">Semua Playlist</div>
          <div className="max-h-60 overflow-y-auto border rounded">
            {(allPlaylists || []).map(p => (
              <div key={p.id} className="p-2 flex items-center justify-between">
                <span className="truncate">{p.name}</span>
                <NeoButton color="blue" onClick={() => attach(p.id)}>Tambahkan</NeoButton>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="font-medium mb-1">Terpasang</div>
          <div className="max-h-60 overflow-y-auto border rounded">
            {(assigned || []).map(p => (
              <div key={p.id} className="p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs">{p.pivot?.priority}</span>
                  <span className="truncate max-w-[12rem]">{p.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => bump(p.id, Math.max(0, (p.pivot?.priority || 0) - 1))} className="px-2 py-1 text-xs rounded bg-gray-200">Up</button>
                  <button onClick={() => bump(p.id, (p.pivot?.priority || 0) + 1)} className="px-2 py-1 text-xs rounded bg-gray-200">Down</button>
                  <button onClick={() => detach(p.id)} className="px-2 py-1 text-xs rounded bg-red-500 text-white">Lepas</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignPlaylists;


