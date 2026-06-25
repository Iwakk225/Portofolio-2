import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import AdminDashboard from './AdminDashboard';
import ProfileManager from './ProfileManager';
import SkillManager from './SkillManager';
import AchievementManager from './AchievementManager';
import EducationManager from './EducationManager';
import ProjectManager from './ProjectManager';
import GuestbookManager from './GuestbookManager';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Profile', href: '/admin/profile' },
    { label: 'Skills', href: '/admin/skills' },
    { label: 'Achievements', href: '/admin/achievements' },
    { label: 'Education', href: '/admin/educations' },
    { label: 'Projects', href: '/admin/projects' },
    { label: 'Guestbook', href: '/admin/guestbook' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] rounded"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:relative w-64 bg-white border-r-2 border-black min-h-screen transition-transform duration-300 z-40`}
        >
          <div className="p-6 border-b-2 border-black">
            <h1 className="text-2xl font-bold text-black">Admin Panel</h1>
            <p className="text-sm text-gray-600 mt-2">Manage Portfolio</p>
          </div>

          <nav className="p-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className="block px-4 py-3 text-black font-medium border-2 border-black rounded hover:bg-blue-100 transition duration-200 shadow-[2px_2px_0px_0px_#000000]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-bold border-2 border-black rounded hover:bg-gray-800 transition duration-200 shadow-[2px_2px_0px_0px_#ffffff]"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 lg:p-12">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="profile" element={<ProfileManager />} />
            <Route path="skills" element={<SkillManager />} />
            <Route path="achievements" element={<AchievementManager />} />
            <Route path="educations" element={<EducationManager />} />
            <Route path="projects" element={<ProjectManager />} />
            <Route path="guestbook" element={<GuestbookManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
