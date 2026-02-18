'use client';
import { useState, useEffect } from 'react';
import { Trash2, RefreshCw, Ban, CheckCircle, Plus, Search } from 'lucide-react';

// หน้าเว็บ Dashboard จัดการ Keys
export default function AdminDashboard() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [customKey, setCustomKey] = useState('');

  // Fetch Keys
  const fetchKeys = async () => {
    setLoading(true);
    const res = await fetch('/api/admin');
    const data = await res.json();
    setKeys(data);
    setLoading(false);
  };

  useEffect(() => { fetchKeys(); }, []);

  // Actions
  const handleAction = async (action: string, key: string = '') => {
    if (!confirm('Are you sure?')) return;
    
    await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            action, 
            key: action === 'create' ? customKey : key, 
            note: newNote 
        })
    });
    setCustomKey('');
    setNewNote('');
    fetchKeys();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-red-500">BRX Admin</h1>
            <p className="text-gray-400">Key Management System</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg flex gap-2 items-end">
            <div>
                <label className="text-xs text-gray-400 block mb-1">Custom Key (Optional)</label>
                <input value={customKey} onChange={e => setCustomKey(e.target.value)} placeholder="XXXX-YYYY" className="bg-gray-700 p-2 rounded text-sm text-white" />
            </div>
            <div>
                <label className="text-xs text-gray-400 block mb-1">Note / Owner</label>
                <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Customer Name" className="bg-gray-700 p-2 rounded text-sm text-white" />
            </div>
            <button onClick={() => handleAction('create')} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
                <Plus size={16} /> GEN KEY
            </button>
          </div>
        </header>

        {loading ? <div className="text-center py-20">Loading...</div> : (
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-750 border-b border-gray-700 text-gray-400 text-xs uppercase">
                  <th className="p-4">Key</th>
                  <th className="p-4">Note</th>
                  <th className="p-4">HWID</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.key} className="border-b border-gray-700 hover:bg-gray-750 transition">
                    <td className="p-4 font-mono text-yellow-400 select-all">{k.key}</td>
                    <td className="p-4 text-sm text-gray-300">{k.note || '-'}</td>
                    <td className="p-4 font-mono text-xs text-gray-500 max-w-[150px] truncate" title={k.hwid}>{k.hwid || 'Not Linked'}</td>
                    <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${k.status === 'active' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                            {k.status?.toUpperCase()}
                        </span>
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                        <button onClick={() => handleAction('reset_hwid', k.key)} title="Reset HWID" className="p-2 bg-blue-900/50 text-blue-400 rounded hover:bg-blue-900"><RefreshCw size={14}/></button>
                        {k.status === 'active' ? (
                            <button onClick={() => handleAction('ban', k.key)} title="Ban Key" className="p-2 bg-orange-900/50 text-orange-400 rounded hover:bg-orange-900"><Ban size={14}/></button>
                        ) : (
                            <button onClick={() => handleAction('unban', k.key)} title="Unban" className="p-2 bg-green-900/50 text-green-400 rounded hover:bg-green-900"><CheckCircle size={14}/></button>
                        )}
                        <button onClick={() => handleAction('delete', k.key)} title="Delete" className="p-2 bg-red-900/50 text-red-400 rounded hover:bg-red-900"><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
                {keys.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No keys found. Create one!</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
