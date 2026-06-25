import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Code, X, Check } from 'lucide-react';
import api from '../../api/axios';

const EMPTY = { name: '', category: 'Frontend', level: 80 };

export default function SkillManager() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () => api.get('/api/skills').then(r => setSkills(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setMsg(null);
    try {
      if (editing) {
        await api.put(`/api/skills/${editing}`, form);
        setMsg({ type: 'success', text: 'Skill updated.' });
      } else {
        await api.post('/api/skills', form);
        setMsg({ type: 'success', text: 'Skill added.' });
      }
      setForm(EMPTY); setEditing(null); load();
    } catch (err) {
      const errors = err?.response?.data?.errors;
      setMsg({ type: 'error', text: errors ? Object.values(errors).flat().join(' ') : 'Failed.' });
    } finally { setSaving(false); }
  };

  const handleEdit = (s) => { setEditing(s.id); setForm({ name: s.name, category: s.category, level: s.level }); };
  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    await api.delete(`/api/skills/${id}`); load();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8"><Code size={20} /><h1 className="text-2xl font-black">Skills Manager</h1></div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="neo-card p-6">
          <h3 className="text-sm font-black uppercase tracking-widest mb-5 pb-3 border-b-2 border-black">
            {editing ? '✏️ Edit Skill' : '+ Add Skill'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Skill Name</label>
              <input className="neo-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Category</label>
              <select className="neo-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option>Frontend</option><option>Backend</option><option>Tools</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Level: {form.level}%</label>
              <input type="range" min="0" max="100" value={form.level}
                onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))}
                className="w-full accent-[#00C2FF]" />
            </div>
            {msg && <div className={`border-2 p-2 text-xs font-bold ${msg.type === 'success' ? 'border-[#00C2FF] text-[#00C2FF]' : 'border-red-600 text-red-600'}`}>{msg.text}</div>}
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn-neo text-xs py-2 flex-1 justify-center">
                <Check size={12} /> {saving ? '...' : editing ? 'Update' : 'Add'}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="btn-neo-outline text-xs py-2 px-3">
                  <X size={12} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Skills Table */}
        <div className="lg:col-span-2 neo-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-black bg-black text-white">
                <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest">Skill</th>
                <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest">Category</th>
                <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest">Level</th>
                <th className="text-right px-4 py-3 text-xs font-black uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map(s => (
                <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-sm">{s.name}</td>
                  <td className="px-4 py-3">
                    <span className="neo-badge-accent text-[10px] py-0.5">{s.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 border border-black bg-gray-100">
                        <div className="h-full bg-[#00C2FF]" style={{ width: `${s.level}%` }} />
                      </div>
                      <span className="text-xs font-black">{s.level}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(s)} className="p-1 border border-black hover:bg-black hover:text-white transition-colors"><Pencil size={12} /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {skills.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-gray-400 text-sm">No skills yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
