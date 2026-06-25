export default function SkillsSection({ skills }) {
  const categories = ['Frontend', 'Backend', 'Tools'];

  return (
    <section id="skills" className="py-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            <span className="text-[#00C2FF]">// </span>Skills & Arsenal
          </h2>
          <div className="h-[3px] bg-[#00C2FF] w-24"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map(cat => {
            const catSkills = skills.filter(s => s.category === cat);
            return (
              <div key={cat} className="border-2 border-white p-6 hover:border-[#00C2FF] transition-colors group">
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white">
                  <span className="text-[#00C2FF] font-black text-xs tracking-widest uppercase">
                    {cat === 'Frontend' ? '🎨' : cat === 'Backend' ? '⚙️' : '🛠️'} {cat}
                  </span>
                </div>
                <div className="space-y-4">
                  {catSkills.length === 0 && (
                    <p className="text-gray-500 text-xs font-medium">No skills added yet.</p>
                  )}
                  {catSkills.map(skill => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold">{skill.name}</span>
                        <span className="text-xs font-black text-[#00C2FF]">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 border border-gray-600">
                        <div
                          className="h-full bg-[#00C2FF] transition-all duration-700"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating badges */}
        <div className="mt-10 flex flex-wrap gap-3">
          {skills.map(skill => (
            <span key={skill.id} className="neo-badge bg-[#111] text-white border-white text-xs">
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
