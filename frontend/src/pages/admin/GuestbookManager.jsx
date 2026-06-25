import { useState, useEffect } from 'react';
import { MessageSquare, Check, Trash2, ShieldAlert } from 'lucide-react';
import api from '../../api/axios';

export default function GuestbookManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/guestbook');
      setMessages(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch messages. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/api/guestbook/${id}/approve`);
      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, is_approved: true } : m))
      );
    } catch (err) {
      alert('Failed to approve message.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/api/guestbook/${id}`);
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      alert('Failed to delete message.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare size={20} />
        <h1 className="text-2xl font-black">Guestbook Moderation</h1>
      </div>

      {error && (
        <div className="mb-6 border-2 border-red-600 bg-red-50 p-4 text-xs font-bold text-red-600 flex items-center gap-2">
          <ShieldAlert size={16} />
          {error}
        </div>
      )}

      <div className="neo-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-black bg-black text-white">
              <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest">User Info</th>
              <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest">Message</th>
              <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest">Status</th>
              <th className="text-right px-4 py-3 text-xs font-black uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(msg => (
              <tr key={msg.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-4 w-48 shrink-0">
                  <div className="font-bold text-black">{msg.name}</div>
                  <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
                    {new Date(msg.created_at).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </div>
                </td>
                <td className="px-4 py-4 max-w-md">
                  <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                </td>
                <td className="px-4 py-4">
                  {msg.is_approved ? (
                    <span className="neo-badge-accent text-[9px] py-0.5 px-2 bg-green-500 text-white border-green-500">
                      Approved
                    </span>
                  ) : (
                    <span className="neo-badge text-[9px] py-0.5 px-2 bg-amber-100 text-amber-800 border-amber-500">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {!msg.is_approved && (
                      <button
                        onClick={() => handleApprove(msg.id)}
                        title="Approve Comment"
                        className="p-1 border-2 border-black bg-[#00C2FF] text-black hover:bg-black hover:text-[#00C2FF] transition-all shadow-[1px_1px_0px_0px_#000]"
                      >
                        <Check size={14} strokeWidth={3} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      title="Delete Comment"
                      className="p-1 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-[1px_1px_0px_0px_#000]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {messages.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400 text-sm font-semibold">
                  No guestbook messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
