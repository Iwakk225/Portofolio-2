import { NavLink, useNavigate } from 'react-router-dom';
import { Zap, User, Code, Award, GraduationCap, FolderOpen, MessageSquare, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/profile', label: 'Profile', icon: User },
  { to: '/admin/skills', label: 'Skills', icon: Code },
  { to: '/admin/achievements', label: 'Achievements', icon: Award },
  { to: '/admin/education', label: 'Education', icon: GraduationCap },
  { to: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { to: '/admin/guestbook', label: 'Guestbook', icon: MessageSquare },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-[#F8F9FA]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-black text-white flex flex-col border-r-2 border-black fixed h-screen z-40">
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-4 border-b-2 border-[#333]">
          <span className="flex items-center justify-center w-7 h-7 bg-[#00C2FF] text-black border border-white">
            <Zap size={14} fill="currentColor" />
          </span>
          <span className="font-black text-xs uppercase tracking-widest">Admin Panel</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-sm font-bold transition-all duration-100 border-l-4 ${
                  isActive
                    ? 'bg-[#00C2FF] text-black border-l-[#00C2FF]'
                    : 'text-gray-400 border-transparent hover:text-white hover:border-[#00C2FF] hover:bg-[#111]'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User / Logout */}
        <div className="px-5 py-4 border-t-2 border-[#333]">
          <p className="text-xs text-gray-400 font-semibold truncate mb-3">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-black text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-56 min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
