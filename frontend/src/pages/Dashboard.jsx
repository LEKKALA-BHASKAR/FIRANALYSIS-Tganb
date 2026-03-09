import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSearch, Upload, Clock, AlertTriangle, CheckCircle2, XCircle,
  TrendingUp, ArrowRight, BarChart3, Scale, Users, FileText,
  MessageSquare, Loader2, ChevronRight,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useAnalysis } from '../contexts/AnalysisContext';
import { getAnalytics, getAnalyses } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const { sessions } = useAnalysis();
  const [stats, setStats] = useState({ total: 0, cleared: 0, warnings: 0, blocked: 0, avg_score: 0 });
  const [dailyData, setDailyData] = useState([]);
  const [recentFIRs, setRecentFIRs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [analytics, recent] = await Promise.all([
          getAnalytics().catch(() => null),
          getAnalyses({ page: 1, limit: 5 }).catch(() => null),
        ]);
        if (analytics) {
          setStats({
            total: analytics.total || 0,
            cleared: analytics.cleared || 0,
            warnings: analytics.warnings || 0,
            blocked: analytics.blocked || 0,
            avg_score: analytics.avg_score || 0,
          });
          setDailyData((analytics.daily_data || []).map(d => ({
            day: d._id?.slice(-5) || '',
            analyses: d.count,
            avg: Math.round(d.avg_score || 0),
          })));
        }
        if (recent?.analyses) {
          setRecentFIRs(recent.analyses);
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessions]);

  const totalAnalyses = stats.total;
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  const statusData = [
    { name: 'Cleared', value: stats.cleared || 1, color: '#22c55e' },
    { name: 'Warnings', value: stats.warnings || 0, color: '#f59e0b' },
    { name: 'Blocked', value: stats.blocked || 0, color: '#ef4444' },
  ];

  const statusConfig = {
    cleared: { icon: CheckCircle2, label: 'Cleared', color: 'text-success-500', bg: 'bg-success-50' },
    warning: { icon: AlertTriangle, label: 'Warning', color: 'text-warning-500', bg: 'bg-warning-50' },
    blocked: { icon: XCircle, label: 'Blocked', color: 'text-danger-500', bg: 'bg-danger-50' },
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-accent-400 rounded-full blur-3xl" />
        </div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{greeting}, {user?.name?.split(' ')[0] || 'Officer'}</h1>
            <p className="text-primary-200 text-sm">
              {user?.station || 'Central Police Station'} &bull; Badge: {user?.badge || 'IPS-2024-0471'}
            </p>
          </div>
          <Link
            to="/app/analyze"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl
                       hover:bg-primary-50 transition-all shadow-lg text-sm w-fit"
          >
            <Upload className="w-4 h-4" />
            New Analysis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Total Analyses', value: totalAnalyses, sub: '+12 this week', color: 'text-primary-600', bg: 'bg-primary-50', trend: '+8%' },
          { icon: CheckCircle2, label: 'Cleared', value: Math.round(totalAnalyses * 0.65), sub: 'Last 30 days', color: 'text-success-600', bg: 'bg-success-50', trend: '+12%' },
          { icon: AlertTriangle, label: 'Warnings', value: Math.round(totalAnalyses * 0.25), sub: 'Needs attention', color: 'text-warning-600', bg: 'bg-warning-50', trend: '-3%' },
          { icon: XCircle, label: 'Blocked', value: Math.round(totalAnalyses * 0.10), sub: 'Critical issues', color: 'text-danger-600', bg: 'bg-danger-50', trend: '-5%' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                stat.trend.startsWith('+') ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'
              }`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            <p className="text-[11px] text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Analysis Trends (Last 7 Days)</h3>
              <p className="text-xs text-gray-500 mt-0.5">Analyses performed recently</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary-500" /> Count</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success-500" /> Avg Score</span>
            </div>
          </div>
          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="analyses" stroke="#3b82f6" fill="url(#colorTotal)" strokeWidth={2} />
                <Area type="monotone" dataKey="avg" stroke="#22c55e" fill="url(#colorAvg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-sm text-gray-400">
              No analysis data yet. Analyze FIRs to see trends.
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Status Distribution</h3>
          <p className="text-xs text-gray-500 mb-4">Overall compliance breakdown</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                formatter={(value) => [`${value}%`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-5 mt-2">
            {statusData.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name} ({s.value})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Analyses + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Recent Analyses</h3>
              <p className="text-xs text-gray-500 mt-0.5">Latest FIR validation reports</p>
            </div>
            <Link to="/app/history" className="text-xs text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-gray-100">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">FIR ID</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentFIRs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">
                      No analyses yet. Start by analyzing an FIR.
                    </td>
                  </tr>
                ) : recentFIRs.map(fir => {
                  const sc = statusConfig[fir.status] || statusConfig.cleared;
                  return (
                    <tr key={fir.session_id} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                      <td className="px-6 py-3.5 text-sm font-medium text-gray-900">{fir.fir_id || fir.filename || '-'}</td>
                      <td className="px-6 py-3.5 text-sm text-gray-500">{formatDate(fir.created_at)}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${fir.score}%`,
                                backgroundColor: fir.score >= 80 ? '#22c55e' : fir.score >= 60 ? '#f59e0b' : '#ef4444',
                              }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-700">{fir.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>
                          <sc.icon className="w-3 h-3" />
                          {sc.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { to: '/app/analyze', icon: Upload, label: 'Upload & Analyze FIR', desc: 'PDF or text input', color: 'bg-primary-50 text-primary-600' },
                { to: '/app/chat', icon: MessageSquare, label: 'AI Legal Assistant', desc: 'Ask legal questions', color: 'bg-accent-50 text-accent-600' },
                { to: '/app/analytics', icon: BarChart3, label: 'View Analytics', desc: 'Compliance trends', color: 'bg-green-50 text-green-600' },
              ].map((action, i) => (
                <Link
                  key={i}
                  to={action.to}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{action.label}</p>
                    <p className="text-xs text-gray-400">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Compliance Score */}
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl border border-primary-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Overall Compliance</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#e2e8f0" strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#3b82f6" strokeWidth="3"
                    strokeDasharray={`${stats.avg_score || 0}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-700">{stats.avg_score || 0}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Your station's average compliance score across all analyzed FIRs.</p>
                <p className="text-xs text-primary-600 font-medium mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +5% from last month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
