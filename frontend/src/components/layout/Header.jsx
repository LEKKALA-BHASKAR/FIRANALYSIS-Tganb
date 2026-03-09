import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search, Bell, Settings, ChevronDown, LogOut, User, Shield,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  const notifications = [
    { id: 1, text: 'FIR-2026-047 analysis complete', time: '2m ago', unread: true },
    { id: 2, text: 'New NDPS guideline update available', time: '1h ago', unread: true },
    { id: 3, text: 'System maintenance scheduled', time: '3h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
          <Link to="/app" className="hover:text-primary-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium capitalize">
            {location.pathname.split('/').pop() || 'Dashboard'}
          </span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search FIRs, reports, cases..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                       placeholder:text-gray-400 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5
                         px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100 rounded border border-gray-200">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger-500 text-white text-[10px]
                             font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-100">
                <h4 className="font-semibold text-sm">Notifications</h4>
              </div>
              {notifications.map(n => (
                <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${n.unread ? 'bg-primary-50/50' : ''}`}>
                  <p className="text-sm text-gray-700">{n.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
              ))}
              <div className="px-4 py-2 border-t border-gray-100">
                <button className="text-xs text-primary-600 font-medium hover:text-primary-700">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative ml-2">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-700 leading-tight">{user?.name || 'User'}</p>
              <p className="text-[11px] text-gray-400 leading-tight">{user?.role || 'Officer'}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Shield className="w-3 h-3 text-primary-500" />
                  <span className="text-xs text-primary-600 font-medium">{user?.badge}</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-danger-600"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside handler */}
      {(showProfile || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowProfile(false); setShowNotifications(false); }}
        />
      )}
    </header>
  );
}
