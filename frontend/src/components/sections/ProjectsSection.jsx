import { ExternalLink, Image } from 'lucide-react';

export default function ProjectsSection({ projects }) {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="section-title text-3xl md:text-4xl font-black mb-6">
            Projects
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 && (
            <p className="text-gray-500 text-sm col-span-3 text-center py-10">No projects added yet.</p>
          )}
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={`neo-card flex flex-col overflow-hidden ${i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              {/* Project image */}
              <div className="h-44 border-b-2 border-black bg-[#F0F0F0] flex items-center justify-center overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image.startsWith('http') ? project.image : `${import.meta.env.VITE_API_URL}${project.image}`}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Image size={32} />
                    <span className="text-xs font-bold">No Preview</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-black text-base mb-2">{project.title}</h3>
                <p className="text-xs text-gray-700 leading-relaxed mb-4 flex-1">{project.description}</p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {(project.tech_stack || []).map(tech => (
                    <span key={tech} className="neo-badge-accent text-[10px] py-0.5 px-2">{tech}</span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-2 pt-3 border-t-2 border-black">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-neo-accent text-xs py-1.5 px-3 flex-1 justify-center"
                    >
                      <ExternalLink size={12} /> Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-neo-outline text-xs py-1.5 px-3 flex-1 justify-center"
                    >
                      <ExternalLink size={12} /> Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
