import { Download, ArrowRight } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function AboutSection({ profile }) {
  if (!profile) return null;

  // Handle both object format {name: value} and array format [{stat: name, value: value}]
  const rpgData = profile.rpg_stats
    ? Array.isArray(profile.rpg_stats)
      ? profile.rpg_stats
      : Object.entries(profile.rpg_stats).map(([key, value]) => ({ stat: key, value }))
    : [];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="section-title text-3xl md:text-4xl font-black mb-6">
          About Me
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Left Panel - Bio */}
        <div className="neo-card p-8">
          <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-4">
            <div className="w-3 h-3 bg-[#00C2FF] border border-black"></div>
            <span className="text-xs font-black uppercase tracking-widest">Character Bio</span>
          </div>

          {profile.avatar && (
            <div className="mb-6 border-2 border-black inline-block shadow-[4px_4px_0px_0px_#00C2FF]">
              <img
                src={profile.avatar.startsWith('http') ? profile.avatar : `${import.meta.env.VITE_API_URL}${profile.avatar}`}
                alt="Avatar"
                className="w-28 h-28 object-cover"
              />
            </div>
          )}

          <h3 className="text-xl font-black mb-4 leading-tight">{profile.bio_title}</h3>
          <p className="text-sm leading-relaxed text-gray-700 mb-6 font-medium">{profile.about_me}</p>

          {profile.cv_link && (
            <a
              href={`${import.meta.env.VITE_API_URL}${profile.cv_link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neo-accent text-sm"
            >
              <Download size={14} /> Download CV
            </a>
          )}
        </div>

        {/* Right Panel - RPG Stats */}
        <div className="neo-card-accent p-8">
          <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-4">
            <div className="w-3 h-3 bg-black"></div>
            <span className="text-xs font-black uppercase tracking-widest">⚔️ Character Stats</span>
          </div>

          {rpgData.length > 0 ? (
            <>
              <div className="w-full h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height={256}>
                  <RadarChart data={rpgData}>
                    <PolarGrid stroke="#000" strokeWidth={1} />
                    <PolarAngleAxis
                      dataKey="stat"
                      tick={{ fontSize: 10, fontWeight: 700, fontFamily: 'Plus Jakarta Sans' }}
                    />
                    <Radar
                      dataKey="value"
                      stroke="#00C2FF"
                      fill="#00C2FF"
                      fillOpacity={0.35}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {rpgData.map(({ stat, value }) => (
                  <div key={stat} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-36 shrink-0">{stat}</span>
                    <div className="flex-1 h-3 border-2 border-black bg-gray-100">
                      <div
                        className="h-full bg-[#00C2FF] transition-all duration-700"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-xs font-black w-8 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 font-medium">Stats not configured.</p>
          )}
        </div>
      </div>
    </section>
  );
}
