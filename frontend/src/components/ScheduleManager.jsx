import React, { useEffect, useState } from "react";
import NeoButton from "./NeoButton";

const ScheduleManager = ({ selectedDisplayId, darkMode }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!selectedDisplayId) return;
    setLoading(true);
    try { const r = await fetch(`/api/displays/${encodeURIComponent(selectedDisplayId)}/schedules`); setSchedules(await r.json()); } catch { setSchedules([]); }
    setLoading(false);
  };
  useEffect(() => { load(); }, [selectedDisplayId]);

  const add = async () => {
    const playlistId = prompt('Playlist ID?');
    if (!playlistId) return;
    const body = { playlist_id: Number(playlistId), is_active: true };
    const r = await fetch(`/api/displays/${encodeURIComponent(selectedDisplayId)}/schedules`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (r.ok) load();
  };

  const remove = async (id) => {
    const r = await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
    if (r.ok) load();
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-3 rounded border`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Jadwal Display</h3>
        <NeoButton color="amber" onClick={add}>+ Jadwal</NeoButton>
      </div>
      {loading && <div className="text-sm">Loading…</div>}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {schedules.map(s => (
          <div key={s.id} className="p-2 border rounded flex items-center justify-between">
            <div className="text-sm">
              <div>Playlist #{s.playlist_id}</div>
              <div className="opacity-80">{s.start_date || '-'} {s.start_time || ''} → {s.end_date || '-'} {s.end_time || ''} (DOW: {s.days_of_week || '-'})</div>
            </div>
            <button onClick={() => remove(s.id)} className="px-2 py-1 text-xs rounded bg-red-500 text-white">Hapus</button>
          </div>
        ))}
        {schedules.length === 0 && <div className="text-sm text-gray-500">Belum ada jadwal.</div>}
      </div>
    </div>
  );
};

export default ScheduleManager;


