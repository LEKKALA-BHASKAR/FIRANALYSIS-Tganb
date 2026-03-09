import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User, Shield, Bell, Lock, Palette, Globe, Save,
  Camera, CheckCircle2,
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    station: user?.station || 'Central Police Station',
    badge: user?.badge || 'IPS-2024-0471',
    phone: '+91 98765 43210',
    rank: 'Sub Inspector',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    analysisComplete: true,
    weeklyReport: true,
    systemUpdates: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'security', icon: Lock, label: 'Security' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
  ];

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-sm text-gray-500 mb-8">Manage your account and preferences</p>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-56 flex-shrink-0">
            <nav className="space-y-1">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeSection === s.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                  {s.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeSection === 'profile' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
                      {profile.name.charAt(0)}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                      <Camera className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                    <p className="text-sm text-gray-500">{profile.rank} &bull; {profile.station}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Shield className="w-3.5 h-3.5 text-primary-500" />
                      <span className="text-xs text-primary-600 font-medium">{profile.badge}</span>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', key: 'name', type: 'text' },
                    { label: 'Email', key: 'email', type: 'email' },
                    { label: 'Phone', key: 'phone', type: 'tel' },
                    { label: 'Rank', key: 'rank', type: 'text' },
                    { label: 'Station', key: 'station', type: 'text' },
                    { label: 'Badge ID', key: 'badge', type: 'text' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        value={profile[field.key]}
                        onChange={e => setProfile({ ...profile, [field.key]: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
                                   focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all text-sm shadow-sm"
                  >
                    {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                <h3 className="font-semibold text-gray-900">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full max-w-md px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full max-w-md px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full max-w-md px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all" />
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500 mb-3">Add an extra layer of security to your account</p>
                  <button className="px-4 py-2 bg-primary-50 text-primary-700 font-medium rounded-xl text-sm hover:bg-primary-100 transition-all">
                    Enable 2FA
                  </button>
                </div>
                <div className="flex justify-end">
                  <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all text-sm shadow-sm">
                    {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Update Password</>}
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                <h3 className="font-semibold text-gray-900">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { key: 'analysisComplete', label: 'Analysis Complete', desc: 'Get notified when FIR analysis finishes' },
                    { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly compliance summary' },
                    { key: 'systemUpdates', label: 'System Updates', desc: 'Updates about new features and changes' },
                    { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                    { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                  ].map(n => (
                    <div key={n.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{n.label}</p>
                        <p className="text-xs text-gray-500">{n.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [n.key]: !notifications[n.key] })}
                        className={`relative w-11 h-6 rounded-full transition-colors ${notifications[n.key] ? 'bg-primary-600' : 'bg-gray-300'}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${notifications[n.key] ? 'left-5.5 translate-x-0' : 'left-0.5'}`}
                          style={{ left: notifications[n.key] ? '22px' : '2px' }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                <h3 className="font-semibold text-gray-900">Appearance</h3>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Theme</p>
                  <div className="flex gap-3">
                    {[
                      { label: 'Light', active: true, preview: 'bg-white border-primary-300' },
                      { label: 'Dark', active: false, preview: 'bg-gray-900' },
                      { label: 'System', active: false, preview: 'bg-gradient-to-r from-white to-gray-900' },
                    ].map(t => (
                      <button key={t.label} className={`p-3 rounded-xl border-2 transition-all ${t.active ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'}`}>
                        <div className={`w-16 h-10 rounded-lg ${t.preview} border border-gray-200 mb-2`} />
                        <p className="text-xs font-medium text-gray-700">{t.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Language</p>
                  <select className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Telugu</option>
                    <option>Tamil</option>
                    <option>Marathi</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
