import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send, MessageSquare, Loader2, Scale, Sparkles, Trash2,
  Search, FileText, Smartphone, Truck, FlaskConical,
} from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    // Simulate AI response (no active session — general legal assistant mode)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Thank you for your question about: **"${msg}"**\n\nTo get specific FIR-related answers, please first analyze an FIR from the **New Analysis** page. The AI assistant works best when it has an active FIR context to reference.\n\n**General guidance:**\n- For NDPS section queries, I can help once an FIR is loaded\n- For procedural questions about panchanama, seizure procedures, or filing requirements, analyze an FIR first\n- I'll reference specific details from your FIR text for accurate answers\n\n> Navigate to **New Analysis** → Upload/Paste FIR → Then use the **Chat** tab in the report view for FIR-specific Q&A.`,
      }]);
      setLoading(false);
    }, 1500);
  };

  const suggestedQuestions = [
    { icon: Scale, text: 'What are NDPS small, intermediate, and commercial quantities for Ganja?' },
    { icon: FileText, text: 'What are the mandatory requirements for a valid panchanama?' },
    { icon: Search, text: 'What happens if FIR filing is delayed beyond 24 hours?' },
    { icon: Smartphone, text: 'Why must IMEI numbers be recorded for seized mobile phones?' },
    { icon: Truck, text: 'When should vehicle engine/chassis numbers be verified in NDPS cases?' },
    { icon: FlaskConical, text: 'What is the procedure for drug testing of accused persons?' },
  ];

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-transparent">
            <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">AI Legal Assistant</h2>
            <p className="text-xs text-gray-500">NDPS specialist — Ask about sections, procedures, compliance</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-accent-50 to-primary-50 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-accent-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Legal Assistant</h3>
            <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
              Ask general questions about NDPS laws, FIR procedures, and legal compliance.
              For FIR-specific analysis, use the <strong>New Analysis</strong> page first.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {suggestedQuestions.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => setInput(sq.text)}
                  className="flex items-start gap-2 text-left p-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-600
                             hover:border-primary-300 hover:bg-primary-50 transition-all"
                >
                  <sq.icon className="w-3.5 h-3.5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span>{sq.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 mt-1 bg-transparent">
                    <img src="/assets/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-br-md'
                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-md shadow-sm'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>
                  ) : msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 mt-1 bg-transparent">
                  <img src="/assets/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about NDPS laws, FIR procedures..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800
                       text-white rounded-xl transition-all shadow-lg shadow-primary-500/20
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-2">
          AI can make mistakes. Verify legal advice with qualified counsel.
        </p>
      </div>
    </div>
  );
}
