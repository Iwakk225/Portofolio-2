import { useState, useEffect } from 'react';
import { FolderOpen, Trash2, Pencil, X, Check, Save } from 'lucide-react';
import api from '../../api/axios';

const EMPTY = { title: '', description: '', tech_stack: '', demo_url: '', github_url: '' };

export default function ProjectManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    try {
      const res = await api.get('/api/projects');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      
      // Parse tech_stack from comma-separated string to array, clean it up, and serialize to JSON
      const techArray = form.tech_stack
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);
      fd.append('tech_stack', JSON.stringify(techArray));

      if (form.demo_url) fd.append('demo_url', form.demo_url);
      if (form.github_url) fd.append('github_url', form.github_url);
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        // Laravel update workaround for form-data file upload (must use POST to update with file)
        await api.post(`/api/projects/${editing}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMsg({ type: 'success', text: 'Project updated successfully.' });
      } else {
        await api.post('/api/projects', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMsg({ type: 'success', text: 'Project created successfully.' });
      }

      setForm(EMPTY);
      setImageFile(null);
      setImagePreview(null);
      setEditing(null);
      load();
    } catch (err) {
      const errors = err?.response?.data?.errors;
      const text = errors ? Object.values(errors).flat().join(' ') : 'Failed to save project.';
      setMsg({ type: 'error', text });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setForm({
      title: item.title,
      description: item.description,
      tech_stack: Array.isArray(item.tech_stack) ? item.tech_stack.join(', ') : '',
      demo_url: item.demo_url || '',
      github_url: item.github_url || '',
    });
    setImagePreview(item.image ? (item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL}${item.image}`) : null);
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/api/projects/${id}`);
      load();
    } catch (err) {
      alert('Failed to delete project.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <FolderOpen size={20} />
        <h1 className="text-2xl font-black">Projects Manager</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Panel */}
        <div className="neo-card p-6 h-fit">
          <h3 className="text-sm font-black uppercase tracking-widest mb-5 pb-3 border-b-2 border-black">
            {editing ? '✏️ Edit Project' : '+ Add Project'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Project Title</label>
              <input
                className="neo-input"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
                placeholder="e.g. My Anime Tracker"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Description</label>
              <textarea
                className="neo-input resize-none h-24"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                required
                placeholder="Describe your project..."
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Tech Stack (comma-separated)</label>
              <input
                className="neo-input"
                value={form.tech_stack}
                onChange={e => setForm(f => ({ ...f, tech_stack: e.target.value }))}
                required
                placeholder="Laravel, React, Tailwind"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Demo URL</label>
              <input
                type="url"
                className="neo-input"
                value={form.demo_url}
                onChange={e => setForm(f => ({ ...f, demo_url: e.target.value }))}
                placeholder="https://my-demo.com"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Github URL</label>
              <input
                type="url"
                className="neo-input"
                value={form.github_url}
                onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))}
                placeholder="https://github.com/my-repo"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1">Project Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="neo-input text-xs py-2"
              />
              {imagePreview && (
                <div className="mt-3 border-2 border-black p-1 shadow-[2px_2px_0px_0px_#00C2FF]">
                  <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                </div>
              )}
            </div>

            {msg && (
              <div className={`border-2 p-2 text-xs font-bold ${msg.type === 'success' ? 'border-[#00C2FF] text-[#00C2FF]' : 'border-red-600 text-red-600'}`}>
                {msg.text}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-neo text-xs py-2 flex-1 justify-center"
              >
                <Check size={12} /> {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm(EMPTY);
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="btn-neo-outline text-xs py-2 px-3"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="neo-card p-5 flex flex-col md:flex-row gap-5 items-start">
              {item.image && (
                <img
                  src={item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL}${item.image}`}
                  alt={item.title}
                  className="w-full md:w-40 h-28 object-cover border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                />
              )}
              <div className="flex-1">
                <h3 className="font-black text-lg">{item.title}</h3>
                <p className="text-xs text-gray-700 leading-relaxed mt-1">{item.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {(item.tech_stack || []).map(tech => (
                    <span key={tech} className="neo-badge-accent text-[9px] py-0.5 px-2">{tech}</span>
                  ))}
                </div>
                {(item.demo_url || item.github_url) && (
                  <div className="mt-3 flex gap-4 text-xs font-bold text-gray-500">
                    {item.demo_url && <a href={item.demo_url} target="_blank" rel="noreferrer" className="hover:text-black underline">Demo URL</a>}
                    {item.github_url && <a href={item.github_url} target="_blank" rel="noreferrer" className="hover:text-black underline">Github URL</a>}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0 md:self-start">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1 border border-black hover:bg-black hover:text-white transition-colors"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="neo-card p-10 text-center text-gray-400 text-sm">
              No projects added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
