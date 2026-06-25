import { useState } from 'react';
import { X, Award } from 'lucide-react';

export default function AchievementsSection({ achievements }) {
  const [modal, setModal] = useState(null);

  return (
    <section id="achievements" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="mb-12">
        <h2 className="section-title text-3xl md:text-4xl font-black mb-6">
          Achievements
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.length === 0 && (
          <p className="text-gray-500 text-sm col-span-3 text-center py-10">No achievements added yet.</p>
        )}
        {achievements.map(a => (
          <div key={a.id} className="neo-card p-5 cursor-pointer group" onClick={() => a.certificate_img && setModal(a)}>
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 border-2 border-black bg-[#00C2FF] shrink-0 shadow-[2px_2px_0px_0px_#000]">
                <Award size={16} />
              </div>
              <div>
                <h3 className="font-black text-sm leading-tight">{a.title}</h3>
                <p className="text-xs text-gray-600 font-semibold mt-1">{a.issuer}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-2">
              {new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </p>
            {a.description && (
              <p className="text-xs text-gray-700 leading-relaxed">{a.description}</p>
            )}
            {a.certificate_img && (
              <div className="mt-3 pt-3 border-t border-black">
                <span className="text-xs font-black text-[#00C2FF] uppercase tracking-widest">View Certificate →</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Certificate Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000] max-w-2xl w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-black text-lg">{modal.title}</h3>
                <p className="text-sm text-gray-600 font-semibold">{modal.issuer}</p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="border-2 border-black p-1 hover:bg-black hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <img
              src={modal.certificate_img.startsWith('http') ? modal.certificate_img : `${import.meta.env.VITE_API_URL}${modal.certificate_img}`}
              alt={`Certificate for ${modal.title}`}
              className="w-full border-2 border-black object-contain max-h-96"
            />
          </div>
        </div>
      )}
    </section>
  );
}
