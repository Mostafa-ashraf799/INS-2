import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Newspaper, Code, Brain, Shield, Globe, Smartphone,
  BarChart3, Cloud, Gamepad2, User, LogOut, Menu, X,
  Home, Server, Network, ChevronLeft, ChevronRight,
  Settings
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Code: <Code size={20} />,
  Brain: <Brain size={20} />,
  Shield: <Shield size={20} />,
  Globe: <Globe size={20} />,
  Smartphone: <Smartphone size={20} />,
  BarChart3: <BarChart3 size={20} />,
  Cloud: <Cloud size={20} />,
  Gamepad2: <Gamepad2 size={20} />,
  Container: <Server size={20} />,
  Network: <Network size={20} />,
};

import { TECH_CATEGORIES } from '../lib/store';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
        : 'text-dark-400 hover:text-dark-100 hover:bg-dark-700/50'
    } ${collapsed ? 'justify-center px-3' : ''}`;

  const userInitials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)
    : user?.username?.substring(0, 2) || '??';

  return (
    <div className="flex h-screen bg-dark-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 right-0 z-50
        ${collapsed ? 'w-20' : 'w-72'}
        bg-dark-900/95 backdrop-blur-xl border-l border-dark-700/50
        flex flex-col transition-all duration-300
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-dark-700/50">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-white text-lg shrink-0">
                IN
              </div>
              {!collapsed && <span className="text-xl font-bold gradient-text">INS Community</span>}
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-dark-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className={`text-xs text-dark-500 font-semibold mb-2 ${collapsed ? 'text-center' : 'px-4'}`}>
            {collapsed ? '—' : 'الرئيسية'}
          </div>
          <NavLink to="/news" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
            <Newspaper size={20} className="shrink-0" />
            {!collapsed && <span>آخر الأخبار</span>}
          </NavLink>

          <div className={`text-xs text-dark-500 font-semibold mt-4 mb-2 ${collapsed ? 'text-center' : 'px-4'}`}>
            {collapsed ? '—' : 'المجالات التقنية'}
          </div>
          {TECH_CATEGORIES.map(cat => (
            <NavLink
              key={cat.id}
              to={`/tech/${cat.id}`}
              className={navLinkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="shrink-0">{iconMap[cat.icon] || <Home size={20} />}</span>
              {!collapsed && <span className="truncate">{cat.name}</span>}
            </NavLink>
          ))}

          <div className={`text-xs text-dark-500 font-semibold mt-4 mb-2 ${collapsed ? 'text-center' : 'px-4'}`}>
            {collapsed ? '—' : 'الحساب'}
          </div>
          <NavLink to="/profile" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
            <User size={20} className="shrink-0" />
            {!collapsed && <span>الملف الشخصي</span>}
          </NavLink>
          {user?.isAdmin && (
            <NavLink to="/admin" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
              <Settings size={20} className="shrink-0" />
              {!collapsed && <span>لوحة الإدارة</span>}
            </NavLink>
          )}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center p-2 mx-3 mb-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700/50 transition-colors"
        >
          {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        {/* User card */}
        <div className="p-3 border-t border-dark-700/50">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {userInitials}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.fullName || user?.username}</p>
                <p className="text-xs text-dark-400 truncate">@{user?.username}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700/50"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-white text-sm">
              IN
            </div>
            <span className="font-bold gradient-text">INS</span>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-dark-400">مرحباً، {user?.fullName || user?.username}</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
