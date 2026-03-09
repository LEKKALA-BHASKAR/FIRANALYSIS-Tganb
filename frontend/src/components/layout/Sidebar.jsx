import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FileSearch, Upload, History, BarChart3,
  MessageSquare, Settings, HelpCircle, Scale, ChevronLeft, ChevronRight,
} from 'lucide-react';

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/app/analyze', icon: FileSearch, label: 'New Analysis' },
  { to: '/app/history', icon: History, label: 'Case History' },
  { to: '/app/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/app/chat', icon: MessageSquare, label: 'AI Assistant' },
];

const bottomItems = [];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onCloseMobile} />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-sidebar text-white flex flex-col
          transition-all duration-300 ease-in-out
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-white/10 ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-transparent">
            <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold tracking-tight leading-tight">FIR Auditor</h1>
              <p className="text-[10px] text-gray-400 leading-tight">AI Legal Platform</p>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <p className={`text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-3 ${collapsed ? 'text-center' : 'px-3'}`}>
            {collapsed ? '•••' : 'Main Menu'}
          </p>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${collapsed ? 'justify-center' : ''}
                ${isActive
                  ? 'bg-sidebar-active text-white shadow-lg shadow-primary-500/10'
                  : 'text-gray-400 hover:bg-sidebar-hover hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Nav */}
        <div className="py-3 px-3 space-y-1 border-t border-white/10">
          {bottomItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${collapsed ? 'justify-center' : ''}
                ${isActive
                  ? 'bg-sidebar-active text-white'
                  : 'text-gray-400 hover:bg-sidebar-hover hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={onToggle}
            className="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                       text-gray-500 hover:bg-sidebar-hover hover:text-white transition-all duration-200 w-full"
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <><ChevronLeft className="w-5 h-5" /><span>Collapse</span></>}
          </button>
        </div>
      </aside>
    </>
  );
}
