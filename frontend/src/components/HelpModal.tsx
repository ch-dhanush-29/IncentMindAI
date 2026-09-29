import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  Layers, 
  Command, 
  ShieldAlert, 
  BrainCircuit, 
  FileCheck2, 
  BarChart2, 
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState<'workflow' | 'tabs' | 'memory' | 'shortcuts'>('workflow');

  if (!isOpen) return null;

  const pagesInfo = [
    { id: 'dashboard', name: 'Dashboard / Home', icon: ShieldAlert, desc: 'Real-time SRE control room with active incident severity breakdown, live carousel, service health matrix, and visual intelligence hub.' },
    { id: 'incidents', name: 'Incidents Feed', icon: Layers, desc: 'Searchable multi-dimensional incident table with status filtering (Investigating, Mitigated, Resolved), service & severity filters, and pagination.' },
    { id: 'incident-detail', name: 'Incident Dossier', icon: FileCheck2, desc: 'Deep lifecycle view of an incident with quick status/severity/assignee controls, symptoms & logs, AI summary, SRE notes, and immutable audit trail.' },
    { id: 'investigation', name: 'AI Investigation Studio', icon: BrainCircuit, desc: 'Persistent-memory root-cause diagnosis, side-by-side memory vs baseline comparison, interactive diagnostic checklist, and SRE Copilot chat.' },
    { id: 'postmortem', name: 'Resolution & Retain', icon: CheckCircle2, desc: 'Guided postmortem studio to document verified root causes, timeline, and permanent fixes, and retain verified knowledge into Hindsight memory.' },
    { id: 'after-action', name: 'After Action Reports', icon: BookOpen, desc: 'Executive retrospective summaries featuring MTTA/MTTD/MTTR reliability metrics, timeline breakdowns, and customer impact reviews.' },
    { id: 'improvements', name: 'Improvement Items', icon: Sparkles, desc: 'Action item tracker ensuring post-incident preventative engineering tasks (P0, P1, P2) are assigned and completed.' },
    { id: 'memory-explorer', name: 'Knowledge Base (Hindsight)', icon: Layers, desc: 'Inspect retained biomimetic memories, filter by type (failure signature, mitigation, postmortem, architecture), and view raw JSON vector docs.' },
    { id: 'history', name: 'Incident Archive', icon: Clock, desc: 'Historical archive of all resolved outages with keyword search, service filters, verified root causes, and postmortem records.' },
    { id: 'analytics', name: 'Reliability Analytics', icon: BarChart2, desc: 'Executive MTTR benchmark banner (with vs without memory), daily incident volume trends, and recurring failure signature clusters.' },
    { id: 'settings', name: 'Settings & Health Monitor', icon: Command, desc: 'Inspect live connection statuses for Hindsight Cloud, Groq LLM, Backend API, and real-time SSE stream, plus model configurations.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#222834] flex items-center justify-between bg-[#F8FAFC] dark:bg-[#0E1117]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
                <span>IncidentMind AI — Operational Guide</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                  Live SRE Manual
                </span>
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Persistent-memory incident response powered by Vectorize Hindsight & Groq LLM
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] hover:bg-slate-200 dark:hover:bg-[#1E2430] transition-colors cursor-pointer"
            title="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#E2E8F0] dark:border-[#222834] bg-white dark:bg-[#141820] text-xs font-medium">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'workflow'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
            }`}
          >
            Live Demo Workflow (End-to-End)
          </button>
          <button
            onClick={() => setActiveTab('tabs')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'tabs'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
            }`}
          >
            All Tabs & Components
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'memory'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
            }`}
          >
            Hindsight Memory Architecture
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'shortcuts'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
            }`}
          >
            Shortcuts & Tips
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#172033] dark:text-[#F1F5F9]">
          {/* TAB 1: LIVE DEMO WORKFLOW */}
          {activeTab === 'workflow' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs">
                <span className="font-bold text-indigo-900 dark:text-indigo-300">Live Real-Time Demo Walkthrough: </span>
                Follow these 5 steps to experience how persistent biomimetic memory accelerates resolution and prevents repeated firefighting.
              </div>

              <div className="grid gap-3 text-xs">
                {/* Step 1 */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834] flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#172033] dark:text-[#F1F5F9]">Declare an Outage</h4>
                    <p className="text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                      Click the <span className="font-semibold text-indigo-600 dark:text-indigo-400">+ New Incident</span> button in the top navbar. Select a preset (e.g., <code className="bg-slate-100 dark:bg-[#1E2430] px-1 rounded">PostgreSQL Conn Pool</code>) or enter your own incident details. Click <strong>Declare Incident</strong>. Real-time SSE broadcasts the incident to all connected dashboards automatically.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834] flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#172033] dark:text-[#F1F5F9]">Real-Time Triage in Control Room</h4>
                    <p className="text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                      Navigate to <strong>Home (Dashboard)</strong>. See the active severity strip update in real-time. Locate your outage in the horizontal <strong>Live Incident Carousel</strong> and click <strong>Investigate</strong>.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834] flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#172033] dark:text-[#F1F5F9]">AI Studio with Hindsight Persistent Memory</h4>
                    <p className="text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                      In the <strong>AI Investigation Studio</strong>, review the Agentic Diagnosis card. Notice the <strong>Recalled Hindsight Memories</strong> showing matching past outages and verified fixes. Click <strong>Compare with Baseline</strong> to see how a stateless LLM struggles without memory.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834] flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#172033] dark:text-[#F1F5F9]">Interactive SRE Copilot & Checklist</h4>
                    <p className="text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                      Check off diagnostic verification items on the <strong>Diagnostic Checklist</strong>. Use the <strong>SRE Copilot Chat</strong> to ask specific runbook questions grounded directly in past company incident memories.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834] flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#172033] dark:text-[#F1F5F9]">Postmortem & Persistent Knowledge Retention</h4>
                    <p className="text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                      Click <strong>Resolve & Conduct Postmortem</strong>. Fill in the confirmed root cause and verified resolution. Click <strong>Retain Knowledge & Close</strong>. The solution is committed to Hindsight memory, teaching the system so the next recurring outage is solved in seconds!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALL TABS & COMPONENTS */}
          {activeTab === 'tabs' && (
            <div className="space-y-3 text-xs">
              <p className="text-[#64748B] dark:text-[#94A3B8]">
                IncidentMind AI contains 11 dedicated functional modules accessible via the sidebar and top navigation:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {pagesInfo.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div 
                      key={p.id} 
                      className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 font-bold text-xs text-[#172033] dark:text-[#F1F5F9] mb-1">
                          <Icon className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{p.name}</span>
                        </div>
                        <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                          {p.desc}
                        </p>
                      </div>

                      {onNavigateTab && (
                        <button
                          onClick={() => {
                            onNavigateTab(p.id);
                            onClose();
                          }}
                          className="mt-2 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <span>Open this tab</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: HINDSIGHT MEMORY ARCHITECTURE */}
          {activeTab === 'memory' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
                <h4 className="font-bold text-indigo-950 dark:text-indigo-300 text-sm mb-1">
                  How Vectorize Hindsight Biomimetic Memory Works
                </h4>
                <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Unlike traditional RAG systems that rely solely on naive semantic search over raw documents, Hindsight structures operational knowledge into memory nodes indexed via <strong>TEMPR</strong> (Temporal, Entity, Multi-strategy, Parallel Retrieval).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834]">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">1. Failure Signatures</span>
                  <p className="text-[#64748B] dark:text-[#94A3B8] mt-1 text-[11px]">
                    Encodes multi-metric symptom fingerprints (error codes, latency spikes, database thread pool exhaustion patterns).
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834]">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">2. Verified Mitigations</span>
                  <p className="text-[#64748B] dark:text-[#94A3B8] mt-1 text-[11px]">
                    Stores proven remediation steps verified by human SREs, linked to specific system environments and configurations.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834]">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3. Postmortem Documents</span>
                  <p className="text-[#64748B] dark:text-[#94A3B8] mt-1 text-[11px]">
                    Retains root causes, timelines, contributing factors, and architectural decisions with immutable evidence provenance.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834]">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4. Grounded Groq Inference</span>
                  <p className="text-[#64748B] dark:text-[#94A3B8] mt-1 text-[11px]">
                    Groq runs Llama 3.3 70B inference in milliseconds, conditioned directly on the retrieved Hindsight memory context.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SHORTCUTS & TIPS */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834] flex items-center justify-between">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">Focus Global Search</span>
                  <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-[#1E2430] border border-[#E2E8F0] dark:border-[#2D3545] font-mono text-[11px] text-[#172033] dark:text-[#F1F5F9]">
                    ⌘K or /
                  </kbd>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834] flex items-center justify-between">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">Close Active Modal</span>
                  <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-[#1E2430] border border-[#E2E8F0] dark:border-[#2D3545] font-mono text-[11px] text-[#172033] dark:text-[#F1F5F9]">
                    Esc
                  </kbd>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834] flex items-center justify-between">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">Ask SRE Copilot</span>
                  <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-[#1E2430] border border-[#E2E8F0] dark:border-[#2D3545] font-mono text-[11px] text-[#172033] dark:text-[#F1F5F9]">
                    Enter
                  </kbd>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834] flex items-center justify-between">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">Toggle Theme Mode</span>
                  <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                    Theme Button (Sidebar/Navbar)
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0E1117] border border-[#E2E8F0] dark:border-[#222834] flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#172033] dark:text-[#F1F5F9]">Full Documentation Available</div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Detailed architecture and production SRE manual in the codebase</div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/50 text-[11px] font-mono text-indigo-700 dark:text-indigo-300 font-bold">
                  docs/USER_GUIDE.md
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E2E8F0] dark:border-[#222834] bg-[#F8FAFC] dark:bg-[#0E1117] flex items-center justify-between text-xs">
          <span className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">
            IncidentMind AI • Persistent Memory Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
