import React, { useEffect, useState } from "react";
import NeoButton from "./NeoButton";

const PlaylistManager = ({ darkMode }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPlaylists = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/playlists');
      const data = await res.json();
      setPlaylists(Array.isArray(data) ? data : []);
      if (!selected && Array.isArray(data) && data.length > 0) setSelected(data[0]);
    } catch {}
    setLoading(false);
  };

  const loadItems = async (playlistId) => {
    try {
      const res = await fetch(`/api/playlists/${playlistId}/items`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => { loadPlaylists(); }, []);
  useEffect(() => { if (selected) loadItems(selected.id); }, [selected?.id]);

  const createPlaylist = async () => {
    const name = prompt('Nama playlist?');
    if (!name) return;
    const res = await fetch('/api/playlists', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, is_active: true, loop: true }) });
    if (res.ok) loadPlaylists();
  };

  const deletePlaylist = async (id) => {
    if (!confirm('Hapus playlist ini?')) return;
    const res = await fetch(`/api/playlists/${id}`, { method: 'DELETE' });
    if (res.ok) { setSelected(null); loadPlaylists(); setItems([]); }
  };

  const addItem = async () => {
    if (!selected) return;
    const contentId = prompt('Content ID? (lihat /api/contents)');
    if (!contentId) return;
    const res = await fetch(`/api/playlists/${selected.id}/items`, { method: 'POST', body: new Blob([JSON.stringify({ content_id: Number(contentId) })], { type: 'application/json' }) });
    if (res.ok) loadItems(selected.id);
  };

  const removeItem = async (itemId) => {
    const res = await fetch(`/api/playlist-items/${itemId}`, { method: 'DELETE' });
    if (res.ok && selected) loadItems(selected.id);
  };

  const moveItem = async (itemId, newPos) => {
    const res = await fetch(`/api/playlist-items/${itemId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ position: newPos }) });
    if (res.ok && selected) loadItems(selected.id);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-3 rounded border`}> 
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Playlist Manager</h3>
        <NeoButton color="green" onClick={createPlaylist}>+ Playlist</NeoButton>
      </div>
      <div className="flex gap-3">
        <div className="w-1/3 max-h-80 overflow-y-auto border rounded">
          {loading && <div className="p-2 text-sm">Loading...</div>}
          {playlists.map(p => (
            <div key={p.id} className={`p-2 cursor-pointer flex items-center justify-between ${selected?.id === p.id ? 'bg-blue-100' : ''}`} onClick={() => setSelected(p)}>
              <span className="truncate">{p.name}</span>
              <button onClick={(e) => { e.stopPropagation(); deletePlaylist(p.id); }} className="text-red-600 text-xs">hapus</button>
            </div>
          ))}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Items</h4>
            <NeoButton color="blue" onClick={addItem}>+ Item</NeoButton>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {items.map((it, idx) => (
              <div key={it.id} className="p-2 border rounded flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs">{it.position}</span>
                  <span className="truncate max-w-[16rem]">{it.content?.title} ({it.content?.type})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveItem(it.id, Math.max(1, it.position - 1))} className="px-2 py-1 text-xs rounded bg-gray-200">Up</button>
                  <button onClick={() => moveItem(it.id, it.position + 1)} className="px-2 py-1 text-xs rounded bg-gray-200">Down</button>
                  <button onClick={() => removeItem(it.id)} className="px-2 py-1 text-xs rounded bg-red-500 text-white">Hapus</button>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="text-sm text-gray-500">Belum ada item.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistManager;


