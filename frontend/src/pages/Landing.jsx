import { Link } from 'react-router-dom';
import {
  Scale, ArrowRight, Shield, Zap, FileSearch, Users, BarChart3,
  MessageSquare, CheckCircle2, ChevronRight, Star, Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: FileSearch,
    title: 'PDF & Text Analysis',
    desc: 'Upload FIR PDFs or paste text directly. AI extracts and validates every detail automatically.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Shield,
    title: 'NDPS Section Validation',
    desc: 'Auto-maps drug types and quantities to correct NDPS sections. Flags mismatches instantly.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Users,
    title: 'Accused Role Classification',
    desc: 'AI classifies each accused as Mule, Supplier, Seller, Consumer, or Main Boss from the narrative.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: BarChart3,
    title: 'Compliance Analytics',
    desc: 'Track compliance scores across cases. Identify common filing errors and improvement areas.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: MessageSquare,
    title: 'AI Legal Assistant',
    desc: 'Ask follow-up questions about any FIR. Get guidance on corrections, sections, and procedures.',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    icon: CheckCircle2,
    title: '5-Module Audit',
    desc: 'WHO, HOW, WHERE, WHAT, LEGAL — comprehensive validation covering every aspect of the FIR.',
    color: 'bg-cyan-50 text-cyan-600',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-transparent">
              <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-bold text-gray-900">FIR Legal Auditor</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#modules" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Modules</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link
              to="/login"
              className="text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800
                         px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary-500/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-40 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-60 right-1/4 w-72 h-72 bg-accent-100 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-xs font-semibold text-primary-700 mb-6 border border-primary-100">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Advanced AI — Built for Indian Law Enforcement
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
            AI-Powered{' '}
            <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 bg-clip-text text-transparent">
              FIR Validation
            </span>
            <br />for NDPS Cases
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload an e-FIR and get an instant 5-module legal audit. Detect blockers,
            verify NDPS sections, validate evidence, and ensure procedural compliance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700
                         text-white font-semibold rounded-2xl shadow-xl shadow-primary-500/25
                         hover:shadow-2xl hover:shadow-primary-500/30 transition-all text-base"
            >
              Start Analyzing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-4 bg-white border border-gray-200
                         text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all text-base shadow-sm"
            >
              See How It Works
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for FIR validation
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              From PDF parsing to legal section validation, our AI handles every aspect of e-FIR auditing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group p-6 bg-white rounded-2xl border border-gray-100
                           hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5
                           transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Modules */}
      <section id="modules" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">5-Module Audit</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive validation — every angle covered
            </h2>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { icon: Users, label: 'WHO', desc: 'Persons & Roles', color: 'bg-blue-50 text-blue-600' },
              { icon: Zap, label: 'HOW', desc: 'Logistics', color: 'bg-orange-50 text-orange-600' },
              { icon: FileSearch, label: 'WHERE', desc: 'Locations', color: 'bg-green-50 text-green-600' },
              { icon: Shield, label: 'WHAT', desc: 'Substances', color: 'bg-purple-50 text-purple-600' },
              { icon: Scale, label: 'LEGAL', desc: 'Compliance', color: 'bg-red-50 text-red-600' },
            ].map((m, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all">
                <div className={`w-12 h-12 mx-auto rounded-xl ${m.color} flex items-center justify-center mb-3`}>
                  <m.icon className="w-6 h-6" />
                </div>
                <p className="font-bold text-gray-900">{m.label}</p>
                <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary-900 via-primary-800 to-sidebar rounded-3xl p-12 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-primary-400 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent-500 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to modernize FIR validation?</h2>
            <p className="text-primary-200 mb-8 max-w-xl mx-auto">
              Join hundreds of officers using AI to ensure compliance, catch errors, and strengthen cases.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-2xl
                         hover:bg-primary-50 transition-all shadow-xl text-base"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Logo" className="w-5 h-5 object-contain" />
            <span className="text-sm text-gray-500">&copy; {new Date().getFullYear()} FIR Legal Auditor. Built for Indian Law Enforcement.</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
