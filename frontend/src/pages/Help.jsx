import { useState } from 'react';
import {
  HelpCircle, BookOpen, MessageCircle, FileText, ChevronDown, ChevronRight,
  Scale, ExternalLink, Mail, Phone,
} from 'lucide-react';

const faqs = [
  {
    q: 'How does the AI analyze FIRs?',
    a: 'The AI examines your FIR text across 5 modules (WHO, HOW, WHERE, WHAT, LEGAL) and validates it against NDPS Act requirements. It checks for correct sections, mandatory fields, procedural compliance, and identifies blockers and warnings.',
  },
  {
    q: 'What file formats are supported?',
    a: 'Currently, we support PDF file uploads up to 16 MB. You can also paste FIR text directly into the text input area. The system extracts text from PDFs automatically.',
  },
  {
    q: 'How accurate is the NDPS section validation?',
    a: 'The AI maps drug types and quantities to NDPS sections with high accuracy based on the Act\'s scheduling. It covers Ganja (Section 20), Heroin (Section 21), and other common narcotic substances. Always verify with legal counsel.',
  },
  {
    q: 'What counts as a "Blocker" vs a "Warning"?',
    a: 'Blockers are critical issues that MUST be fixed before submission (e.g., missing panchanama witnesses, wrong NDPS section). Warnings are issues that should be fixed to strengthen the case but won\'t necessarily prevent filing.',
  },
  {
    q: 'Is my FIR data stored securely?',
    a: 'FIR data is processed in-memory and is not permanently stored. Uploaded PDF files are deleted immediately after text extraction. Session data is temporary and cleared when the server restarts.',
  },
  {
    q: 'Can I use this for non-NDPS cases?',
    a: 'Currently, the system is specialized for NDPS (Narcotic Drugs and Psychotropic Substances) cases. Support for other case types (BNS/IPC) is planned for future releases.',
  },
];

export default function Help() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
            <HelpCircle className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-sm text-gray-500 mt-1">Find answers, learn the platform, and get assistance</p>
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: BookOpen, title: 'Documentation', desc: 'Learn how to use the platform', color: 'bg-blue-50 text-blue-600' },
            { icon: FileText, title: 'NDPS Reference', desc: 'Act sections & quantities', color: 'bg-purple-50 text-purple-600' },
            { icon: MessageCircle, title: 'Contact Support', desc: 'Get help from our team', color: 'bg-green-50 text-green-600' },
          ].map((link, i) => (
            <button key={i} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all text-left group">
              <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center flex-shrink-0`}>
                <link.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{link.title}</p>
                <p className="text-xs text-gray-500">{link.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors" />
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 animate-fade-in">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl border border-primary-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Need more help?</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email Support</p>
                <p className="text-xs text-gray-500">support@firauditor.gov.in</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Helpline</p>
                <p className="text-xs text-gray-500">1800-XXX-XXXX (Toll Free)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
