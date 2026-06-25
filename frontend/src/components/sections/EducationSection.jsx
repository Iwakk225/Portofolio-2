import { GraduationCap } from 'lucide-react';

export default function EducationSection({ educations }) {
  return (
    <section id="education" className="py-20 bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            <span className="text-[#00C2FF]">// </span>Education
          </h2>
          <div className="h-[3px] bg-[#00C2FF] w-24"></div>
        </div>

        <div className="relative timeline-line">
          {educations.length === 0 && (
            <p className="text-gray-500 text-sm">No education records added yet.</p>
          )}
          {educations.map((edu, i) => (
            <div key={edu.id} className="mb-8 relative">
              {/* Timeline dot */}
              <div className="timeline-dot top-1 bg-[#00C2FF] border-white shadow-[2px_2px_0px_0px_#00C2FF]"></div>

              <div className="border-2 border-white p-5 hover:border-[#00C2FF] transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-[#00C2FF] shrink-0" />
                    <h3 className="font-black text-base">{edu.institution}</h3>
                  </div>
                  <span className="text-xs font-bold text-[#00C2FF] border border-[#00C2FF] px-2 py-0.5">
                    {edu.start_year} – {edu.end_year ?? 'Present'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-300 mb-2">{edu.degree}</p>
                {edu.description && (
                  <p className="text-xs text-gray-400 leading-relaxed">{edu.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
