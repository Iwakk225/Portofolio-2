import { useState, useEffect } from 'react';
import { ArrowDown, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutSection from '../components/sections/AboutSection';
import SkillsSection from '../components/sections/SkillsSection';
import AchievementsSection from '../components/sections/AchievementsSection';
import EducationSection from '../components/sections/EducationSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import GuestbookSection from '../components/sections/GuestbookSection';
import api from '../api/axios';

export default function Portfolio() {
  const [data, setData] = useState({
    profile: null, skills: [], achievements: [], educations: [], projects: [], guestbook: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profile, skills, achievements, educations, projects, guestbook] = await Promise.all([
          api.get('/api/profile').then(r => r.data).catch(() => null),
          api.get('/api/skills').then(r => r.data).catch(() => []),
          api.get('/api/achievements').then(r => r.data).catch(() => []),
          api.get('/api/educations').then(r => r.data).catch(() => []),
          api.get('/api/projects').then(r => r.data).catch(() => []),
          api.get('/api/guestbook').then(r => r.data).catch(() => []),
        ]);
        setData({ profile, skills, achievements, educations, projects, guestbook });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-black shadow-[4px_4px_0px_0px_#00C2FF] mb-4 animate-bounce">
            <Zap size={32} className="text-[#00C2FF]" fill="currentColor" />
          </div>
          <p className="font-black uppercase tracking-widest text-sm">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  const { profile, skills, achievements, educations, projects, guestbook } = data;

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <section
        id="hero"
        className="min-h-screen flex flex-col justify-center pt-14 px-4 sm:px-6 max-w-6xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-10 items-center py-16">
          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-widest mb-6 shadow-[3px_3px_0px_0px_#00C2FF]">
              <span className="w-2 h-2 bg-[#00C2FF] animate-pulse"></span>
              Konnichiwa Minna!
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-4">
              <span className="block">Hello,</span>
              <span className="block">I'm a</span>
              <span className="block text-[#00C2FF] [text-shadow:4px_4px_0px_#000]">
                Developer.
              </span>
            </h1>
            {profile?.bio_title && (
              <p className="text-base font-semibold text-gray-600 mb-8 border-l-4 border-[#00C2FF] pl-4">
                {profile.bio_title}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="btn-neo text-sm">
                View Projects <ArrowDown size={14} />
              </a>
              <a href="#about" className="btn-neo-outline text-sm">
                About Me
              </a>
            </div>
          </div>

          {/* Right: Hero Card */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Main card */}
              <div className="neo-card p-8 relative z-10">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-black">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-black border border-black"></div>
                    <div className="w-3 h-3 rounded-full bg-[#00C2FF] border border-black"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-200 border border-black"></div>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-gray-500">portfolio.dev</span>
                </div>

                <div className="space-y-3 font-mono text-sm">
                  <p><span className="text-[#00C2FF] font-bold">const</span> <span className="font-bold">developer</span> = {'{'}</p>
                  <p className="pl-4"><span className="text-gray-500">name:</span> <span className="font-bold">"Frontend Dev"</span>,</p>
                  <p className="pl-4"><span className="text-gray-500">stack:</span> <span className="font-bold">["Laravel", "React"]</span>,</p>
                  <p className="pl-4"><span className="text-gray-500">style:</span> <span className="text-[#00C2FF] font-bold">"Manga Aesthetic"</span>,</p>
                  <p className="pl-4"><span className="text-gray-500">status:</span> <span className="font-bold text-green-600">"Everlasting As The Moon"</span>,</p>
                  <p>{'}'}</p>
                </div>

                <div className="mt-6 flex gap-3">
                  <div className="neo-badge text-xs">Laravel</div>
                  <div className="neo-badge text-xs">React</div>
                  <div className="neo-badge-accent text-xs">Tailwind</div>
                </div>
              </div>
              {/* Decorative offset card */}
              <div className="absolute top-4 -right-4 w-full h-full border-2 border-black bg-[#00C2FF] -z-10"></div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center pb-8">
          <a href="#about" className="flex flex-col items-center gap-2 text-xs font-bold text-gray-500 animate-bounce">
            <ArrowDown size={18} />
            <span className="uppercase tracking-widest">Scroll</span>
          </a>
        </div>
      </section>

      {/* SECTIONS */}
      <AboutSection profile={profile} />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={projects} />
      <AchievementsSection achievements={achievements} />
      <EducationSection educations={educations} />
      <GuestbookSection guestbook={guestbook} />

      <Footer />
    </div>
  );
}
