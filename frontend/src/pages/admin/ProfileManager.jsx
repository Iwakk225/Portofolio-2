import { useState, useEffect } from 'react';
import { Save, Upload, User } from 'lucide-react';
import api from '../../api/axios';

export default function ProfileManager() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ bio_title: '', about_me: '', rpg_stats: '{}' });
  const [files, setFiles] = useState({ avatar: null, cv_link: null });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    api.get('/api/profile').then(r => {
      const p = r.data;
      setProfile(p);
      setForm({
        bio_title: p.bio_title || '',
        about_me: p.about_me || '',
        rpg_stats: JSON.stringify(p.rpg_stats || {}, null, 2),
      });
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    try {
      const fd = new FormData();
      fd.append('bio_title', form.bio_title);
      fd.append('about_me', form.about_me);
      
      // Convert rpg_stats from object {name: value} to array [{stat: name, value: value}]
      try {
        const statsObj = JSON.parse(form.rpg_stats);
        const statsArray = Object.entries(statsObj).map(([stat, value]) => ({ stat, value: Number(value) }));
        fd.append('rpg_stats', JSON.stringify(statsArray));
      } catch (e) {
        setMsg({ type: 'error', text: 'Invalid RPG Stats JSON format' });
        setSaving(false);
        return;
      }
      
      if (files.avatar) fd.append('avatar', files.avatar);
      if (files.cv_link) fd.append('cv_link', files.cv_link);
      const res = await api.post('/api/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile(res.data.profile);
      setMsg({ type: 'success', text: 'Profile saved successfully!' });
    } catch (err) {
      const errors = err?.response?.data?.errors;
      const text = errors ? Object.values(errors).flat().join(' ') : 'Failed to save.';
      setMsg({ type: 'error', text });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <User size={20} />
        <h1 className="text-2xl font-black">Profile Manager</h1>
      </div>

      <form onSubmit={handleSubmit} className="neo-card p-8 max-w-2xl space-y-5">
        {/* Avatar preview */}
        {profile?.avatar && (
          <div className="flex items-center gap-4 pb-5 border-b-2 border-black">
            <img
              src={profile.avatar.startsWith('http') ? profile.avatar : `${import.meta.env.VITE_API_URL}${profile.avatar}`}
              alt="Avatar"
              className="w-20 h-20 object-cover border-2 border-black shadow-[3px_3px_0px_0px_#00C2FF]"
            />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-500">Current Avatar</p>
              <p className="text-[10px] text-[#00C2FF] font-bold mt-1">
                {profile.avatar.startsWith('http') ? '☁️ Stored on Cloudinary' : '💾 Stored locally'}
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-1">Bio Title / Tagline</label>
          <input className="neo-input" value={form.bio_title}
            onChange={e => setForm(f => ({ ...f, bio_title: e.target.value }))} required />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-1">About Me</label>
          <textarea className="neo-input resize-none h-32"
            value={form.about_me}
            onChange={e => setForm(f => ({ ...f, about_me: e.target.value }))} required />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-1">Avatar Image</label>
          <input type="file" accept="image/*" onChange={e => setFiles(f => ({ ...f, avatar: e.target.files[0] }))}
            className="neo-input text-xs py-2" />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-1">CV / Resume (PDF)</label>
          <input type="file" accept=".pdf" onChange={e => setFiles(f => ({ ...f, cv_link: e.target.files[0] }))}
            className="neo-input text-xs py-2" />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-1">
            RPG Stats (JSON) <span className="normal-case font-medium text-gray-500">e.g. {`{"Backend Power": 90, "Frontend Agility": 85}`}</span>
          </label>
          <textarea className="neo-input resize-none h-28 font-mono text-xs"
            value={form.rpg_stats}
            onChange={e => setForm(f => ({ ...f, rpg_stats: e.target.value }))}
            placeholder='{"stat_name": 90, "another_stat": 85}' />
          <p className="text-xs text-gray-500 mt-1">Format: Object with stat names as keys and numeric values</p>
        </div>

        {msg && (
          <div className={`border-2 p-3 text-xs font-bold ${msg.type === 'success' ? 'border-[#00C2FF] text-[#00C2FF]' : 'border-red-600 text-red-600'}`}>
            {msg.type === 'success' ? '✓' : '⚠'} {msg.text}
          </div>
        )}

        <button type="submit" disabled={saving} className="btn-neo text-sm w-full justify-center">
          <Save size={14} /> {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
