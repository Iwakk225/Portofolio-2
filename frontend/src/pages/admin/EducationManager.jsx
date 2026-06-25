import { useState, useEffect } from 'react';
import { GraduationCap, Trash2, Pencil, X, Check } from 'lucide-react';
import api from '../../api/axios';

const EMPTY = { institution: '', degree: '', start_year: new Date().getFullYear(), end_year: '', description: '' };

export default function EducationManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () => api.get('/api/educations').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setMsg(null);
    const payload = { ...form, end_year: form.end_year || null };
    try {
      if (editing) { await api.put(`/api/educations/${editing}`, payload); }
      else { await api.post('/api/educations', payload); }
      setMsg({ type: 'success', text: 'Saved!' });
      setForm(EMPTY); setEditing(null); load();
    } catch (err) {
      const errors = err?.response?.data?.errors;
      setMsg({ type: 'error', text: errors ? Object.values(errors).flat().join(' ') : 'Failed.' });
    } finally { setSaving(false); }
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setForm({ institution: item.institution, degree: item.degree, start_year: item.start_year, end_year: item.end_year || '', description: item.description || '' });
  };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/api/educations/${id}`); load(); };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8"><GraduationCap size={20} /><h1 className="text-2xl font-black">Education Manager</h1></div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="neo-card p-6">
          <h3 className="text-sm font-black uppercase tracking-widest mb-5 pb-3 border-b-2 border-black">{editing ? '✏️ Edit' : '+ Add'} Education</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[['institution', 'Institution'], ['degree', 'Degree / Program']].map(([key, label]) => (
              <div key={key}>
                <label className="block text-xs font-black uppercase tracking-widest mb-1">{label}</label>
                <input className="neo-input" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-1">Start Year</label>
                <input type="number" className="neo-input" value={form.start_year} onChange={e => setForm(f => ({ ...f, start_year: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-1">End Year</label>
                <input type="number" className="neo-input" value={form.end_year} onChange={e => setForm(f => ({ ...f, end_year: e.target.value }))} placeholder="Present" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Description</label>
              <textarea className="neo-input resize-none h-20" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            {msg && <div className={`border-2 p-2 text-xs font-bold ${msg.type === 'success' ? 'border-[#00C2FF] text-[#00C2FF]' : 'border-red-600 text-red-600'}`}>{msg.text}</div>}
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn-neo text-xs py-2 flex-1 justify-center"><Check size={12} /> {saving ? '...' : editing ? 'Update' : 'Add'}</button>
              {editing && <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="btn-neo-outline text-xs py-2 px-3"><X size={12} /></button>}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="neo-card p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black">{item.institution}</h3>
                  <p className="text-sm font-semibold text-gray-600">{item.degree}</p>
                  <p className="text-xs text-[#00C2FF] font-bold mt-1">{item.start_year} – {item.end_year ?? 'Present'}</p>
                  {item.description && <p className="text-xs text-gray-500 mt-2">{item.description}</p>}
                </div>
                <div className="flex gap-2 shrink-0 ml-4">
                  <button onClick={() => handleEdit(item)} className="p-1 border border-black hover:bg-black hover:text-white transition-colors"><Pencil size={12} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="neo-card p-10 text-center text-gray-400 text-sm">No education records yet.</div>}
        </div>
      </div>
    </div>
  );
}
