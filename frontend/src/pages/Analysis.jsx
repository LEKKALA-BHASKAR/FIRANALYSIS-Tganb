import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import {
  Upload, FileText, Trash2, Send, Loader2, AlertCircle,
  Download, MessageSquare, FileSearch, ChevronRight, X, Sparkles,
} from 'lucide-react';
import { uploadFIR, analyzeText, sendChatMessage } from '../services/api';
import { useAnalysis } from '../contexts/AnalysisContext';

export default function Analysis() {
  const [mode, setMode] = useState('upload'); // upload | paste
  const [file, setFile] = useState(null);
  const [firText, setFirText] = useState('');
  const [firId, setFirId] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [filename, setFilename] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatting, setChatting] = useState(false);
  const [activeTab, setActiveTab] = useState('report');
  const chatEndRef = useRef(null);
  const { addSession } = useAnalysis();
  const navigate = useNavigate();

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) {
      const f = accepted[0];
      if (f.size > 16 * 1024 * 1024) {
        toast.error('File size exceeds 16 MB');
        return;
      }
      setFile(f);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
  });

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      let result;
      if (mode === 'upload') {
        if (!file) return toast.error('Please select a PDF file');
        result = await uploadFIR(file);
      } else {
        if (firText.trim().length < 50) return toast.error('Please provide at least 50 characters of FIR text');
        result = await analyzeText(firText, firId);
      }
      setReport(result.report);
      setSessionId(result.session_id);
      setFilename(result.filename);
      addSession(result);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || !sessionId || chatting) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    setChatting(true);
    try {
      const res = await sendChatMessage(sessionId, msg);
      setChatMessages(prev => [...prev, { role: 'assistant', content: res.reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setChatting(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const handleQuickQuestion = (q) => {
    setChatInput(q);
    setActiveTab('chat');
  };

  const handleDownload = () => {
    if (!report) return;
    const element = document.getElementById('report-content');
    if (!element) return;
    
    const opt = {
      margin:       1,
      filename:     `${filename || 'report'}_audit.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  const handleReset = () => {
    setReport(null);
    setSessionId(null);
    setFile(null);
    setFirText('');
    setFirId('');
    setChatMessages([]);
    setActiveTab('report');
  };

  const quickQuestions = [
    { icon: AlertCircle, text: 'Critical issues?', q: 'What are the most critical issues to fix first?' },
    { icon: FileSearch, text: 'NDPS sections?', q: 'Explain the NDPS sections applied and whether they are correct.' },
    { icon: FileText, text: 'Panchanama valid?', q: 'Is the panchanama procedure correctly followed?' },
    { icon: Sparkles, text: 'Defence loopholes?', q: 'What evidence gaps could the defence exploit in court?' },
    { icon: ChevronRight, text: 'Fix checklist', q: 'Give me a step-by-step checklist to fix all blockers.' },
  ];

  return (
    <div className="h-full flex flex-col lg:flex-row animate-fade-in">
      {/* ── LEFT PANEL: Input ── */}
      <div className={`${report ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-[45%] lg:min-w-[380px] border-r border-gray-200 bg-white`}>
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-gray-900">FIR Input</h2>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setMode('upload')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                mode === 'upload' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upload PDF
            </button>
            <button
              onClick={() => setMode('paste')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                mode === 'paste' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Paste Text
            </button>
          </div>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'upload' ? (
            <div className="space-y-4">
              {!file ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-primary-400 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-primary-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {isDragActive ? 'Drop the file here' : 'Drag & drop your FIR PDF'}
                  </p>
                  <p className="text-xs text-gray-400">or click to browse &bull; PDF only &bull; Max 16 MB</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl border border-primary-100">
                    <FileText className="w-10 h-10 text-primary-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => setFile(null)} className="p-2 hover:bg-primary-100 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  
                  {/* PDF Preview */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center" style={{ height: '400px' }}>
                    <iframe 
                      src={URL.createObjectURL(file) + "#toolbar=0&navpanes=0"} 
                      title="PDF Preview" 
                      className="w-full h-full border-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">FIR ID <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={firId}
                  onChange={e => setFirId(e.target.value)}
                  placeholder="e.g. FIR-2026-001"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">FIR Narrative</label>
                <textarea
                  value={firText}
                  onChange={e => setFirText(e.target.value)}
                  placeholder="Paste the full FIR text/narrative here...

Example:
On 15/02/2026 at about 19:30 hrs, the complainant received credible information that one person was illegally possessing narcotic drugs near SR Nagar Main Road..."
                  rows={14}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                             transition-all resize-none placeholder:text-gray-400"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{firText.length} characters</span>
                  <button onClick={() => { setFirText(''); setFirId(''); }} className="text-xs text-gray-500 hover:text-gray-700">Clear</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white">
          {report ? (
            <button
              onClick={handleReset}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all text-sm"
            >
              + New Analysis
            </button>
          ) : (
            <button
              onClick={handleAnalyze}
              disabled={analyzing || (mode === 'upload' ? !file : firText.trim().length < 50)}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800
                         text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2
                         shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing FIR...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze FIR
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL: Output ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface">
        {!report ? (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                <FileSearch className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Findings & Analysis</h3>
              <p className="text-sm text-gray-500 mb-6">
                Upload a PDF or paste FIR text, then click <strong>Analyze</strong> to see the AI-powered legal audit report.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['WHO', 'HOW', 'WHERE', 'WHAT', 'LEGAL'].map(m => (
                  <span key={m} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Output Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4 text-primary-500" />
                <span className="font-medium">{filename}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setActiveTab('report')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                      activeTab === 'report' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <FileSearch className="w-3.5 h-3.5" /> Report
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                      activeTab === 'chat' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Chat
                  </button>
                </div>
                <button
                  onClick={handleDownload}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download Report"
                >
                  <Download className="w-4 h-4 text-gray-500" />
                </button>

                {/* Back to input on mobile */}
                <button
                  onClick={() => setReport(null)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Report Tab */}
            {activeTab === 'report' && (
              <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div id="report-content" className="max-w-4xl mx-auto markdown-content bg-white p-8">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{report}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-6">
                  {chatMessages.length === 0 ? (
                    <div className="max-w-lg mx-auto text-center py-12">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-accent-50 flex items-center justify-center mb-4">
                        <MessageSquare className="w-8 h-8 text-accent-500" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Ask the Auditor</h4>
                      <p className="text-sm text-gray-500 mb-6">
                        Ask follow-up questions about this FIR — legal sections, corrections, procedural guidance.
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {quickQuestions.map((qq, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuickQuestion(qq.q)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-600
                                       hover:border-primary-300 hover:bg-primary-50 transition-all"
                          >
                            <qq.icon className="w-3.5 h-3.5 inline-block mr-1" />{qq.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-3xl mx-auto space-y-4">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                            msg.role === 'user'
                              ? 'bg-primary-600 text-white rounded-br-md'
                              : 'bg-white border border-gray-200 text-gray-700 rounded-bl-md'
                          }`}>
                            {msg.role === 'assistant' ? (
                              <div className="markdown-content">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                              </div>
                            ) : msg.content}
                          </div>
                        </div>
                      ))}
                      {chatting && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="max-w-3xl mx-auto flex gap-2">
                    <input
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleChat()}
                      placeholder="Ask about the FIR analysis..."
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
                                 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                    />
                    <button
                      onClick={handleChat}
                      disabled={!chatInput.trim() || chatting}
                      className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center mt-2">
                    AI can make mistakes. Verify legal advice with qualified counsel.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
