import { createContext, useContext, useState } from 'react';

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);

  const addSession = (session) => {
    const s = {
      ...session,
      id: session.session_id,
      timestamp: new Date().toISOString(),
      status: session.status || (session.report?.includes('BLOCKED') ? 'blocked' :
              session.report?.includes('NEEDS CORRECTION') ? 'warning' : 'cleared'),
      score: extractScore(session.report),
    };
    setSessions(prev => [s, ...prev]);
    setCurrentSession(s);
    return s;
  };

  const extractScore = (report) => {
    if (!report) return null;
    const match = report.match(/(\d+)\/100/);
    return match ? parseInt(match[1]) : null;
  };

  return (
    <AnalysisContext.Provider value={{ sessions, currentSession, setCurrentSession, addSession }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used within AnalysisProvider');
  return ctx;
}
