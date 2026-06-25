import { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import api from '../../api/axios';

export default function GuestbookSection({ guestbook: initialMessages }) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [form, setForm] = useState({ name: '', message: '' });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await api.post('/api/guestbook', form);
      setStatus('success');
      setForm({ name: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="section-title text-3xl md:text-4xl font-black mb-6">
            💬 Guestbook
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submission Form */}
          <div className="lg:col-span-1">
            <div className="neo-card p-6">
              <h3 className="font-black text-sm uppercase tracking-widest mb-5 pb-3 border-b-2 border-black">
                Leave a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="neo-input"
                    placeholder="e.g. Naruto Uzumaki"
                    required
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1">Message</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="neo-input resize-none h-28"
                    placeholder="Say something awesome..."
                    required
                    maxLength={1000}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-neo w-full justify-center text-sm"
                >
                  <Send size={14} /> {submitting ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'success' && (
                  <p className="text-xs font-bold text-[#00C2FF] text-center border border-[#00C2FF] p-2">
                    ✓ Message sent! Awaiting approval.
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-xs font-bold text-red-600 text-center border border-red-600 p-2">
                    ✗ Failed to send. Please try again.
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Messages Grid */}
          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-2 gap-6">
              {messages.length === 0 && (
                <div className="sm:col-span-2 text-center py-12">
                  <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-400 font-medium">No messages yet. Be the first!</p>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className="mb-6">
                  <div className="speech-bubble">
                    <p className="text-sm font-medium leading-relaxed text-gray-800">{msg.message}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#00C2FF] border-2 border-black flex items-center justify-center font-black text-xs shrink-0">
                      {msg.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-black">{msg.name}</p>
                      <p className="text-[10px] text-gray-500">
                        {new Date(msg.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
