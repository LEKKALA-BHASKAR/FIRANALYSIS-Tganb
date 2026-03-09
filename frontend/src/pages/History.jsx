import { useState, useEffect, useCallback } from 'react';
import {
  Search, CheckCircle2, AlertTriangle, XCircle,
  FileText, Eye, Loader2, RefreshCw, Trash2,
} from 'lucide-react';
import { getAnalyses, deleteAnalysis } from '../services/api';
import toast from 'react-hot-toast';

const statusConfig = {
  cleared: { icon: CheckCircle2, label: 'Cleared', color: 'text-success-500', bg: 'bg-success-50', border: 'border-success-200' },
  warning: { icon: AlertTriangle, label: 'Warning', color: 'text-warning-500', bg: 'bg-warning-50', border: 'border-warning-200' },
  blocked: { icon: XCircle, label: 'Blocked', color: 'text-danger-500', bg: 'bg-danger-50', border: 'border-danger-200' },
};

export default function History() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAnalyses({ page, limit, status: statusFilter, search });
      setAnalyses(data.analyses || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error('Failed to fetch analyses:', err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleDelete = async (sessionId) => {
    if (!confirm('Delete this analysis?')) return;
    try {
      await deleteAnalysis(sessionId);
      toast.success('Analysis deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case History</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} analyzed FIR records</p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by FIR ID or filename..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'cleared', 'warning', 'blocked'].map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                statusFilter === s
                  ? 'bg-primary-50 border-primary-200 text-primary-700'
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
            <span className="ml-3 text-sm text-gray-500">Loading records...</span>
          </div>
        ) : analyses.length === 0 ? (
          <div className="py-20 text-center">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-sm text-gray-500 mb-1">No records found</p>
            <p className="text-xs text-gray-400">Analyze an FIR to see it listed here.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">FIR / File</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {analyses.map(a => {
                    const sc = statusConfig[a.status] || statusConfig.cleared;
                    return (
                      <tr key={a.session_id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <div>
                              <span className="text-sm font-semibold text-gray-900">{a.fir_id || a.filename || 'Untitled'}</span>
                              {a.fir_id && a.filename && a.fir_id !== a.filename && (
                                <p className="text-xs text-gray-400">{a.filename}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(a.created_at)}</td>
                        <td className="px-6 py-4">
                          {a.score != null ? (
                            <div className="flex items-center gap-2">
                              <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${a.score}%`,
                                    backgroundColor: a.score >= 80 ? '#22c55e' : a.score >= 60 ? '#f59e0b' : '#ef4444',
                                  }}
                                />
                              </div>
                              <span className="text-xs font-bold text-gray-700">{a.score}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>
                            <sc.icon className="w-3 h-3" />
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                if (a.pdf_filename || a.session_id) {
                                  window.open(`/api/pdf/${a.session_id}`, '_blank');
                                } else {
                                  toast.error('No PDF available for this record');
                                }
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View Original PDF"
                            >
                              <Eye className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => handleDelete(a.session_id)}
                              className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-gray-400 hover:text-danger-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of {total} records
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 disabled:opacity-40"
                >
                  Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                      page === p ? 'text-white bg-primary-600' : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
