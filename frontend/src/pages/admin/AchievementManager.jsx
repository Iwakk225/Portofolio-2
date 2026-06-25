import { useState, useEffect } from 'react';
import { Award, Trash2, Pencil, X, Check } from 'lucide-react';
import api from '../../api/axios';

const EMPTY = { title: '', issuer: '', date: '', description: '' };

export default function AchievementManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [certFile, setCertFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () => api.get('/api/achievements').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setMsg(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (certFile) fd.append('certificate_img', certFile);
      if (editing) { await api.post(`/api/achievements/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }); }
      else { await api.post('/api/achievements', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); }
      setMsg({ type: 'success', text: 'Saved!' });
      setForm(EMPTY); setCertFile(null); setEditing(null); load();
    } catch (err) {
      const errors = err?.response?.data?.errors;
      setMsg({ type: 'error', text: errors ? Object.values(errors).flat().join(' ') : 'Failed.' });
    } finally { setSaving(false); }
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setForm({ title: item.title, issuer: item.issuer, date: item.date?.split('T')[0] || item.date, description: item.description || '' });
  };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/api/achievements/${id}`); load(); };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8"><Award size={20} /><h1 className="text-2xl font-black">Achievements Manager</h1></div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="neo-card p-6">
          <h3 className="text-sm font-black uppercase tracking-widest mb-5 pb-3 border-b-2 border-black">{editing ? '✏️ Edit' : '+ Add'} Achievement</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[['title', 'Title'], ['issuer', 'Issuer / Organization']].map(([key, label]) => (
              <div key={key}>
                <label className="block text-xs font-black uppercase tracking-widest mb-1">{label}</label>
                <input className="neo-input" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required />
              </div>
            ))}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Date</label>
              <input type="date" className="neo-input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Description</label>
              <textarea className="neo-input resize-none h-20" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Certificate Image</label>
              <input type="file" accept="image/*" onChange={e => setCertFile(e.target.files[0])} className="neo-input text-xs py-2" />
            </div>
            {msg && <div className={`border-2 p-2 text-xs font-bold ${msg.type === 'success' ? 'border-[#00C2FF] text-[#00C2FF]' : 'border-red-600 text-red-600'}`}>{msg.text}</div>}
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn-neo text-xs py-2 flex-1 justify-center"><Check size={12} /> {saving ? '...' : editing ? 'Update' : 'Add'}</button>
              {editing && <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="btn-neo-outline text-xs py-2 px-3"><X size={12} /></button>}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4 content-start">
          {items.map(item => (
            <div key={item.id} className="neo-card p-5">
              {item.certificate_img && (
                <img src={item.certificate_img.startsWith('http') ? item.certificate_img : `${import.meta.env.VITE_API_URL}${item.certificate_img}`} alt={item.title}
                  className="w-full h-28 object-cover border-b-2 border-black mb-3" />
              )}
              <h3 className="font-black text-sm">{item.title}</h3>
              <p className="text-xs text-gray-600 font-semibold">{item.issuer}</p>
              <p className="text-xs text-[#00C2FF] font-bold mt-1">{new Date(item.date).toLocaleDateString()}</p>
              <div className="flex gap-2 mt-3 pt-3 border-t border-black">
                <button onClick={() => handleEdit(item)} className="p-1 border border-black hover:bg-black hover:text-white transition-colors"><Pencil size={12} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="sm:col-span-2 neo-card p-10 text-center text-gray-400 text-sm">No achievements yet.</div>}
        </div>
      </div>
    </div>
  );
}
