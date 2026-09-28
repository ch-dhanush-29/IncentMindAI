import React from 'react';
import { 
  BrainCircuit, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Activity, 
  RefreshCw, 
  Cpu, 
  FileCheck 
} from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface LandingPageProps {
  onLaunchConsole: () => void;
  onOpenInvestigation: () => void;
  onOpenMemoryExplorer: () => void;
  onOpenHistory: () => void;
  onOpenAnalytics: () => void;
  onDeclareIncident: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchConsole,
  onOpenInvestigation,
  onOpenMemoryExplorer,
  onOpenHistory,
  onOpenAnalytics,
  onDeclareIncident,
}) => {
  // Description cards featuring Images 2-9
  const descriptionCards = [
    {
      id: 'card-1',
      tag: 'HINDSIGHT ENGINE',
      title: 'Persistent Memory Across Incidents',
      description: 'IncidentMind AI builds a cumulative organizational memory. Every incident, log snippet, and post-mortem is indexed so knowledge is never lost to team turnover.',
      image: '/images/incidentmind/persistent-memory.png',
      alt: 'Persistent memory across incidents diagram',
      cta: 'Explore Memory Engine',
      action: onOpenMemoryExplorer,
      badge: 'Vector Retention',
    },
    {
      id: 'card-2',
      tag: 'SEMANTIC SEARCH',
      title: 'Instant Historical Context Retrieval',
      description: 'When an alert fires, IncidentMind AI scans past outages and retrieves similar incidents within seconds, complete with root causes and previous resolutions.',
      image: '/images/incidentmind/historical-context.png',
      alt: 'Historical context retrieval comparison',
      cta: 'View Similar Incidents',
      action: onOpenHistory,
      badge: '< 200ms Recall',
    },
    {
      id: 'card-3',
      tag: 'AGENTIC TRIAGE',
      title: 'AI-Assisted Incident Investigation',
      description: 'An intelligent agent works alongside on-call engineers, analyzing stack traces, anomalous metrics, and system topology to isolate failure points.',
      image: '/images/incidentmind/incident-investigation.jpg',
      alt: 'AI-assisted incident investigation console',
      cta: 'Open War Room',
      action: onOpenInvestigation,
      badge: 'Autonomous Co-Pilot',
    },
    {
      id: 'card-4',
      tag: '5-WHYS DEEP DIVE',
      title: 'Automated Root Cause Analysis',
      description: 'Eliminate manual post-mortems. The system pinpoints whether an outage stems from a bad deployment, connection pool saturation, or third-party API throttling.',
      image: '/images/incidentmind/root-cause-analysis.png',
      alt: 'Automated root cause analysis breakdown',
      cta: 'Inspect RCA Engine',
      action: onOpenAnalytics,
      badge: '94% Confidence',
    },
    {
      id: 'card-5',
      tag: 'RUNBOOK AUTOMATION',
      title: 'Context-Aware Recommended Actions',
      description: 'Rather than generic advice, get targeted remediation playbooks tailored to your exact infrastructure, backed by proven resolutions from past incidents.',
      image: '/images/incidentmind/recommended-actions.png',
      alt: 'Recommended mitigation actions list',
      cta: 'Test Action Scripts',
      action: onOpenInvestigation,
      badge: 'Verified Runbooks',
    },
    {
      id: 'card-6',
      tag: 'MTTR OPTIMIZATION',
      title: 'Resolve Incidents Faster',
      description: 'Drastically cut Mean Time to Resolution by eliminating initial panic and research time. On-call responders start with verified solutions on minute one.',
      image: '/images/incidentmind/faster-resolution.png',
      alt: 'Faster incident resolution and MTTR reduction graph',
      cta: 'View MTTR Analytics',
      action: onOpenAnalytics,
      badge: '-68% MTTR',
    },
    {
      id: 'card-7',
      tag: 'CONTINUOUS LEARNING',
      title: 'Turn Resolutions into Knowledge',
      description: 'Closed incidents automatically generate comprehensive post-mortems and feed back into the memory engine, training the AI to handle future edge cases.',
      image: '/images/incidentmind/knowledge-retention.png',
      alt: 'Automated post-mortem and knowledge retention report',
      cta: 'Browse Knowledge Base',
      action: onOpenHistory,
      badge: 'Self-Enriching',
    },
    {
      id: 'card-8',
      tag: 'PROACTIVE GUARDRAILS',
      title: 'Prevent Repeat Incidents',
      description: 'Identify latent architectural bottlenecks and recurring failure loops before they manifest into severe customer-facing service disruptions.',
      image: '/images/incidentmind/prevent-recurrence.png',
      alt: 'Prevent repeat incidents and proactive guardrails clustering',
      cta: 'Configure Guardrails',
      action: onLaunchConsole,
      badge: 'Proactive Alerting',
    },
  ];

  const benefits = [
    {
      icon: BrainCircuit,
      title: 'Remember',
      subtitle: 'Institutional Memory',
      desc: 'Retain every post-mortem and resolution in persistent vector memory. Never lose institutional knowledge to team turnover.',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      icon: Search,
      title: 'Investigate',
      subtitle: 'Agentic Diagnosis',
      desc: 'Correlate active alerts with historical telemetry and root causes in real-time alongside an autonomous SRE co-pilot.',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      icon: Zap,
      title: 'Resolve',
      subtitle: 'Verified Action',
      desc: 'Execute AI-guided runbooks and verified remediation scripts with human confirmation and sub-minute execution safety.',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      icon: ShieldCheck,
      title: 'Prevent',
      subtitle: 'System Guardrails',
      desc: 'Surface recurrent failure patterns and latent architectural risks before they cause widespread downtime.',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Ingest & Correlate',
      description: 'Ingest alerts from PagerDuty, Datadog, Prometheus, or Slack webhooks. Normalize symptoms, affected topologies, and blast radius.',
      icon: Activity,
    },
    {
      step: '02',
      title: 'Recall & Match',
      description: 'Hindsight persistent memory scans vector embeddings to retrieve identical past outages with verified resolution histories in milliseconds.',
      icon: RefreshCw,
    },
    {
      step: '03',
      title: 'Investigate & Diagnose',
      description: 'Agent analyzes logs, stack traces, and system metrics. Generates a multi-step 5-whys root cause analysis grounded in prior data.',
      icon: Cpu,
    },
    {
      step: '04',
      title: 'Resolve & Retain',
      description: 'Engineers execute validated remediation scripts. Post-mortem is automatically published and committed to the persistent memory bank.',
      icon: FileCheck,
    },
  ];

  const temprFramework = [
    {
      letter: 'T',
      name: 'Trigger',
      color: 'bg-indigo-600',
      description: 'Alert threshold breach, error surge, or manual engineer declaration ingested via webhooks.',
    },
    {
      letter: 'E',
      name: 'Extract',
      color: 'bg-blue-600',
      description: 'Structured telemetry extraction: error traces, affected microservices, commit shas, and service topology.',
    },
    {
      letter: 'M',
      name: 'Match',
      color: 'bg-violet-600',
      description: 'Dense vector search across historical incident banks using semantic similarity and metric correlation.',
    },
    {
      letter: 'P',
      name: 'Predict',
      color: 'bg-purple-600',
      description: 'High-confidence probability scoring of root cause hypotheses based on previous proven resolutions.',
    },
    {
      letter: 'R',
      name: 'Resolve',
      color: 'bg-emerald-600',
      description: 'Execution of contextual runbook scripts followed by automatic ingestion into institutional memory.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#172033] font-sans selection:bg-indigo-100 selection:text-indigo-800">
      
      {/* SECTION 1: NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onLaunchConsole}>
            <div className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center shadow-xs">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[#172033]">
                IncidentMind <span className="text-[#4F46E5] text-xs font-mono px-1.5 py-0.5 rounded bg-[#EEF2FF] border border-indigo-100 font-semibold">AI</span>
              </span>
              <p className="text-[10px] text-[#64748B] font-mono leading-none">Hindsight SRE Memory</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#64748B]">
            <a href="#features" className="hover:text-[#4F46E5] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#4F46E5] transition-colors">How It Works</a>
            <a href="#memory-engine" className="hover:text-[#4F46E5] transition-colors">Memory Engine</a>
            <button onClick={onOpenHistory} className="hover:text-[#4F46E5] transition-colors cursor-pointer">
              Past Incidents
            </button>
            <a href="#architecture" className="hover:text-[#4F46E5] transition-colors">Architecture</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onDeclareIncident}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8F0] hover:border-slate-300 bg-white hover:bg-[#F8FAFC] text-xs font-medium text-[#172033] shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>Declare Incident</span>
            </button>
            <button
              onClick={onLaunchConsole}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-medium shadow-xs transition-all duration-150 cursor-pointer group"
            >
              <span>Launch Console</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 2: INTRODUCTION (HERO) SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Soft background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-gradient-to-tr from-indigo-200/40 via-blue-100/30 to-purple-100/30 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] shadow-2xs mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono font-semibold text-[#4F46E5] tracking-wide uppercase">
                AI-Powered Incident Response Engine
              </span>
              <span className="text-[10px] text-[#64748B] font-mono border-l border-[#E2E8F0] pl-2">
                Hindsight v1.0
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#172033] tracking-tight leading-[1.12]">
              From Incident to Insight <br className="hidden sm:inline" />
              <span className="text-[#4F46E5]">with AI Memory</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-[#64748B] leading-relaxed max-w-2xl mx-auto">
              IncidentMind AI uses persistent memory (Hindsight) to analyze incidents, recall previous resolutions, 
              and suggest precise remediation steps in minutes. Never investigate the same outage twice.
            </p>

            {/* Dual CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={onLaunchConsole}
                className="px-6 py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Launch Console</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onDeclareIncident}
                className="px-5 py-3 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#172033] font-medium text-sm shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#4F46E5]" />
                <span>Declare Live Incident</span>
              </button>
              <button
                onClick={onOpenMemoryExplorer}
                className="px-4 py-3 rounded-xl hover:bg-[#EEF2FF] text-[#4F46E5] font-medium text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Explore Memory Engine</span>
              </button>
            </div>

            {/* Trust chips */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#64748B] font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Sub-second semantic recall
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Human-in-the-loop retention
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Powered by Hindsight TEMPR
              </span>
            </div>
          </div>

          {/* MAIN VISUAL: IMAGE 1 hero-dashboard.png */}
          <div className="relative max-w-5xl mx-auto mt-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-blue-500/20 rounded-2xl blur-lg -z-10" />
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-[#E2E8F0] shadow-xl overflow-hidden group">
              {/* Header bar mimic */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#E2E8F0] bg-[#F8FAFC] rounded-t-xl mb-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[#64748B] font-mono text-[11px] ml-2">app.incidentmind.ai / executive-overview</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live Cluster Connected
                  </span>
                </div>
              </div>

              {/* Image 1 */}
              <div className="relative overflow-hidden rounded-xl bg-slate-50">
                <img 
                  src="/images/incidentmind/hero-dashboard.png" 
                  alt="IncidentMind AI Executive Dashboard" 
                  className="w-full h-auto object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
                />
                
                {/* Floating caption badge */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md p-3 rounded-xl border border-[#E2E8F0] shadow-md flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] border border-indigo-100 flex items-center justify-center flex-shrink-0">
                    <BrainCircuit className="w-4 h-4 text-[#4F46E5]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#172033] truncate">Live incident triage with contextual memory recall</p>
                    <p className="text-[11px] text-[#64748B] truncate font-mono">Correlating 24 past outages across Redis & Kubernetes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: KEY BENEFITS STRIP */}
      <section className="py-12 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div 
                  key={idx} 
                  className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-indigo-200 hover:bg-white hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shadow-2xs">
                        <Icon className="w-5 h-5 text-[#4F46E5]" />
                      </div>
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${b.badgeColor}`}>
                        {b.subtitle}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#172033] tracking-tight">{b.title}</h3>
                    <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: DESCRIPTION SECTION ('Your Past Incidents Make You Stronger') */}
      <section id="features" className="py-16 md:py-24 bg-[#F5F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-semibold text-[#4F46E5] uppercase tracking-wider bg-[#EEF2FF] border border-indigo-100 px-3 py-1 rounded-full">
              Persistent Memory Advantage
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172033] tracking-tight">
              Your Past Incidents Make You Stronger
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#64748B] leading-relaxed">
              Traditional APM tools alert you when microservices crash. IncidentMind AI remembers how you fixed them, 
              instantly equipping on-call engineers with proven solutions from day one.
            </p>
          </div>

          {/* 2-Column Desktop Grid for Images 2 through 9 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {descriptionCards.map((card) => (
              <div 
                key={card.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col group"
              >
                {/* Image Showcase */}
                <div className="relative bg-[#F8FAFC] border-b border-[#E2E8F0] p-3 sm:p-4 overflow-hidden flex items-center justify-center">
                  <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center">
                    <img 
                      src={card.image} 
                      alt={card.alt}
                      className="w-full h-full object-contain p-1 rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Floating Pill */}
                  <span className="absolute top-6 right-6 text-[10px] font-mono font-medium px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-[#E2E8F0] shadow-2xs text-[#172033]">
                    {card.badge}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100 uppercase tracking-wider">
                        {card.tag}
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-lg font-bold text-[#172033] tracking-tight group-hover:text-[#4F46E5] transition-colors">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#64748B] leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                    <button
                      onClick={card.action}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors cursor-pointer group/btn"
                    >
                      <span>{card.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <span className="text-[11px] text-[#94A3B8] font-mono">IncidentMind Platform</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-semibold text-[#4F46E5] uppercase tracking-wider bg-[#EEF2FF] border border-indigo-100 px-3 py-1 rounded-full">
              Automated Incident Lifecycle
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172033] tracking-tight">
              From Alert to Permanent Institutional Memory
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#64748B] leading-relaxed">
              Every stage of response feeds into the next. Your engineering team gains compounding leverage with every resolved incident.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={idx} 
                  className="relative p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-white hover:border-indigo-200 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-mono font-black text-indigo-200">
                        {step.step}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#4F46E5] shadow-2xs">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-[#172033]">{step.title}</h3>
                    <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: HINDSIGHT PERSISTENT MEMORY ARCHITECTURE (TEMPR Framework) */}
      <section id="memory-engine" className="py-16 md:py-24 bg-[#F5F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-semibold text-[#4F46E5] uppercase tracking-wider bg-[#EEF2FF] border border-indigo-100 px-3 py-1 rounded-full">
              Hindsight Cognitive Architecture
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172033] tracking-tight">
              The TEMPR Memory Engine
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#64748B] leading-relaxed">
              How IncidentMind AI structures incident memory into actionable, grounded intelligence without hallucination.
            </p>
          </div>

          {/* TEMPR Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
            {temprFramework.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-8 h-8 rounded-lg ${item.color} text-white font-mono font-bold flex items-center justify-center text-sm shadow-xs`}>
                      {item.letter}
                    </span>
                    <span className="text-sm font-bold text-[#172033]">{item.name}</span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Architectural Specs Box */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="border-b md:border-b-0 md:border-r border-[#E2E8F0] pb-6 md:pb-0 md:pr-6">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">Retrieval Architecture</span>
                <h4 className="text-lg font-bold text-[#172033] mt-1">Dual-Tier Memory Bank</h4>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  Fast sub-second local cache + persistent Hindsight vector store for long-term audit and semantic clustering.
                </p>
              </div>

              <div className="border-b md:border-b-0 md:border-r border-[#E2E8F0] pb-6 md:pb-0 md:pr-6">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">Inference Speed</span>
                <h4 className="text-lg font-bold text-[#172033] mt-1">Groq Llama-70B Engine</h4>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  Real-time reasoning across active telemetry streams with zero synthetic hallucination and explicit citations.
                </p>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">Enterprise Safety</span>
                <h4 className="text-lg font-bold text-[#172033] mt-1">Human-in-the-Loop Signoff</h4>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  Remediation scripts require human authorization before execution. Post-mortems require verification before retention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CTA SECTION */}
      <section className="py-16 md:py-24 bg-white border-t border-[#E2E8F0] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] border border-indigo-100 flex items-center justify-center mx-auto mb-5 text-[#4F46E5] shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#172033] tracking-tight">
            Resolve Smarter. Learn Continuously.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Equip your engineering team with persistent incident intelligence. Reduce downtime, streamline on-call handoffs, 
            and never solve the same incident twice.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onLaunchConsole}
              className="px-6 py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer group"
            >
              <span>Launch SRE Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onDeclareIncident}
              className="px-5 py-3.5 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#172033] font-medium text-sm shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#4F46E5]" />
              <span>Declare New Incident</span>
            </button>
          </div>

          {/* Metric highlights */}
          <div className="mt-12 pt-8 border-t border-[#E2E8F0] grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-black text-[#172033] font-mono">-68%</div>
              <div className="text-xs text-[#64748B] mt-0.5">MTTR Reduction</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#172033] font-mono">99.4%</div>
              <div className="text-xs text-[#64748B] mt-0.5">SLA Compliance</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#172033] font-mono">&lt; 200ms</div>
              <div className="text-xs text-[#64748B] mt-0.5">Memory Retrieval</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#172033] font-mono">Zero</div>
              <div className="text-xs text-[#64748B] mt-0.5">Knowledge Loss</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FOOTER */}
      <footer className="bg-[#F8FAFC] border-t border-[#E2E8F0] py-12 text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Col 1: Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm text-[#172033]">IncidentMind AI</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                AI-powered incident response agent using Hindsight persistent memory for DevOps and SRE teams.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </div>
            </div>

            {/* Col 2: Platform */}
            <div>
              <h4 className="font-semibold text-[#172033] mb-3 uppercase tracking-wider text-[11px]">Platform</h4>
              <ul className="space-y-2">
                <li><button onClick={onLaunchConsole} className="hover:text-[#4F46E5] transition-colors cursor-pointer">Executive Overview</button></li>
                <li><button onClick={onOpenInvestigation} className="hover:text-[#4F46E5] transition-colors cursor-pointer">AI Investigation Studio</button></li>
                <li><button onClick={onOpenMemoryExplorer} className="hover:text-[#4F46E5] transition-colors cursor-pointer">Memory Explorer</button></li>
                <li><button onClick={onOpenAnalytics} className="hover:text-[#4F46E5] transition-colors cursor-pointer">SRE Deep Analytics</button></li>
              </ul>
            </div>

            {/* Col 3: Architecture */}
            <div>
              <h4 className="font-semibold text-[#172033] mb-3 uppercase tracking-wider text-[11px]">Architecture</h4>
              <ul className="space-y-2">
                <li><a href="#memory-engine" className="hover:text-[#4F46E5] transition-colors">TEMPR Framework</a></li>
                <li><span className="hover:text-[#4F46E5] transition-colors">Hindsight Vector Bank</span></li>
                <li><span className="hover:text-[#4F46E5] transition-colors">Groq Llama-3.3-70B</span></li>
                <li><span className="hover:text-[#4F46E5] transition-colors">Zero-Retention Security</span></li>
              </ul>
            </div>

            {/* Col 4: Resources */}
            <div>
              <h4 className="font-semibold text-[#172033] mb-3 uppercase tracking-wider text-[11px]">Project</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://github.com/ch-dhanush-29/IncentMindAI" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hover:text-[#4F46E5] transition-colors flex items-center gap-1.5"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub Repository</span>
                  </a>
                </li>
                <li><a href="/docs" target="_blank" className="hover:text-[#4F46E5] transition-colors">FastAPI Interactive Docs</a></li>
                <li><a href="/api/health" target="_blank" className="hover:text-[#4F46E5] transition-colors">Health Endpoint</a></li>
                <li><span className="text-[#94A3B8]">v1.0.0 Enterprise Edition</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
            <p>© 2026 IncidentMind AI. Built with Hindsight persistent memory for enterprise site reliability engineers.</p>
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-mono">Cluster: prod-east-1</span>
              <span>•</span>
              <span className="text-[11px] font-mono">Hindsight Bank: Connected</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
