import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import {
  TrendingUp, TrendingDown, BarChart3,
  AlertTriangle, CheckCircle2, XCircle, FileText, Loader2,
} from 'lucide-react';
import { getAnalytics } from '../services/api';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAnalytics();
        setStats(data);
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
        <span className="ml-3 text-sm text-gray-500">Loading analytics...</span>
      </div>
    );
  }

  // Build status distribution from real data
  const statusPie = [
    { name: 'Cleared', value: stats?.cleared || 0, color: '#22c55e' },
    { name: 'Warning', value: stats?.warnings || 0, color: '#f59e0b' },
    { name: 'Blocked', value: stats?.blocked || 0, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Build score distribution chart from real data
  const scoreDist = (stats?.score_distribution || []).map(b => ({
    range: b._id === 'other' ? 'Other' : `${b._id}-${b._id + 19}`,
    count: b.count,
  }));

  // Daily activity from real data
  const dailyData = (stats?.daily_data || []).map(d => ({
    date: d._id,
    count: d.count,
    avg_score: d.avg_score ? Math.round(d.avg_score) : 0,
  }));

  const hasNoData = !stats?.total;

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
        <p className="text-sm text-gray-500 mt-0.5">Real-time data from your analyzed FIRs</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Total Analyses', value: stats?.total || 0, bg: 'bg-primary-50', color: 'text-primary-600' },
          { icon: CheckCircle2, label: 'Avg Score', value: `${stats?.avg_score || 0}/100`, bg: 'bg-success-50', color: 'text-success-600' },
          { icon: XCircle, label: 'Blocked', value: stats?.blocked || 0, bg: 'bg-danger-50', color: 'text-danger-600' },
          { icon: AlertTriangle, label: 'Warnings', value: stats?.warnings || 0, bg: 'bg-warning-50', color: 'text-warning-600' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {hasNoData ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <BarChart3 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-sm text-gray-500 mb-1">No analysis data yet</p>
          <p className="text-xs text-gray-400">Analyze your first FIR to see charts and trends here.</p>
        </div>
      ) : (
        <>
          {/* Row 1: Daily Activity + Status Breakdown */}
          <div className="grid lg:grid-cols-2 gap-6">
            {dailyData.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-1">Daily Activity (Last 7 Days)</h3>
                <p className="text-xs text-gray-500 mb-6">Number of FIRs analyzed per day</p>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#actGrad)" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} name="FIRs" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {statusPie.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-1">Status Breakdown</h3>
                <p className="text-xs text-gray-500 mb-4">Distribution of audit outcomes</p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={statusPie} cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3} dataKey="value">
                      {statusPie.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {statusPie.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      {d.name} ({d.value})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Row 2: Score Distribution */}
          {scoreDist.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-1">Score Distribution</h3>
              <p className="text-xs text-gray-500 mb-6">How compliance scores are spread across all FIRs</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={scoreDist} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="FIRs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}

