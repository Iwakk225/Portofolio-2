import { useAuth } from '../../context/useAuth';
import { LayoutDashboard, User, Code, Award, GraduationCap, FolderOpen, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const cards = [
  { to: '/admin/profile', label: 'Profile', icon: User, desc: 'Manage bio, avatar, and RPG stats.' },
  { to: '/admin/skills', label: 'Skills', icon: Code, desc: 'Add and manage technical skills.' },
  { to: '/admin/achievements', label: 'Achievements', icon: Award, desc: 'Upload certifications and awards.' },
  { to: '/admin/education', label: 'Education', icon: GraduationCap, desc: 'Manage educational background.' },
  { to: '/admin/projects', label: 'Projects', icon: FolderOpen, desc: 'Showcase your built projects.' },
  { to: '/admin/guestbook', label: 'Guestbook', icon: MessageSquare, desc: 'Moderate visitor messages.' },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-widest mb-3 shadow-[3px_3px_0px_0px_#00C2FF]">
          <LayoutDashboard size={12} /> Dashboard
        </div>
        <h1 className="text-3xl font-black">Welcome back,</h1>
        <p className="text-xl font-bold text-[#00C2FF]">{user?.name} ⚡</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map(({ to, label, icon: Icon, desc }) => (
          <Link key={to} to={to} className="neo-card p-5 group block">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 border-2 border-black bg-[#00C2FF] shadow-[2px_2px_0px_0px_#000] group-hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                <Icon size={18} />
              </div>
              <h3 className="font-black">{label}</h3>
            </div>
            <p className="text-xs text-gray-600 font-medium mb-3">{desc}</p>
            <span className="text-xs font-black text-[#00C2FF] uppercase tracking-widest flex items-center gap-1">
              Manage <ArrowRight size={12} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
