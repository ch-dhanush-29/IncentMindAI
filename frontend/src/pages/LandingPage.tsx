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
import { ThemeToggle } from '../components/ThemeToggle';

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
      tag: 'INSTITUTIONAL MEMORY',
      title: 'Remember Every Incident',
      description: 'Preserve verified incident solutions and root causes so institutional knowledge is never lost.',
      image: '/images/incidentmind/persistent-memory.png',
      alt: 'Persistent memory across incidents',
      cta: 'Explore Memory',
      action: onOpenMemoryExplorer,
      badge: 'Cumulative Knowledge',
    },
    {
      id: 'card-2',
      tag: 'HISTORICAL CONTEXT',
      title: 'Learn from Past Incidents',
      description: 'Instantly surface matching past outages and verified fixes the moment an alert triggers.',
      image: '/images/incidentmind/historical-context.png',
      alt: 'Historical context retrieval comparison',
      cta: 'View Past Incidents',
      action: onOpenHistory,
      badge: 'Instant Recall',
    },
    {
      id: 'card-3',
      tag: 'AI INVESTIGATION',
      title: 'Investigate with Context',
      description: 'Correlate active logs, metrics, and dependencies to isolate failure points quickly.',
      image: '/images/incidentmind/incident-investigation.jpg',
      alt: 'AI-assisted incident investigation console',
      cta: 'Open Investigation',
      action: onOpenInvestigation,
      badge: 'Incident Co-Pilot',
    },
    {
      id: 'card-4',
      tag: 'ROOT CAUSE ANALYSIS',
      title: 'Identify Potential Root Causes',
      description: 'Pinpoint core failure drivers across services with automated multi-factor diagnostic analysis.',
      image: '/images/incidentmind/root-cause-analysis.png',
      alt: 'Automated root cause analysis breakdown',
      cta: 'View Diagnostics',
      action: onOpenAnalytics,
      badge: 'Automated RCA',
    },
    {
      id: 'card-5',
      tag: 'ACTIONABLE STEPS',
      title: 'Get Actionable Recommendations',
      description: 'Receive targeted, step-by-step remediation playbooks proven by past incident resolutions.',
      image: '/images/incidentmind/recommended-actions.png',
      alt: 'Recommended mitigation actions list',
      cta: 'Inspect Playbooks',
      action: onOpenInvestigation,
      badge: 'Proven Playbooks',
    },
    {
      id: 'card-6',
      tag: 'FAST RESOLUTION',
      title: 'Resolve Incidents Faster',
      description: 'Drastically reduce downtime by starting every investigation with validated fixes.',
      image: '/images/incidentmind/faster-resolution.png',
      alt: 'Faster incident resolution and MTTR reduction graph',
      cta: 'View Resolution Times',
      action: onOpenAnalytics,
      badge: 'Accelerated MTTR',
    },
    {
      id: 'card-7',
      tag: 'KNOWLEDGE RETENTION',
      title: 'Turn Resolutions into Knowledge',
      description: 'Convert every resolved incident into structured learnings so the whole team benefits.',
      image: '/images/incidentmind/knowledge-retention.png',
      alt: 'Automated post-mortem and knowledge retention report',
      cta: 'Browse Knowledge',
      action: onOpenHistory,
      badge: 'Continuous Learning',
    },
    {
      id: 'card-8',
      tag: 'PROACTIVE PREVENTION',
      title: 'Prevent Repeat Incidents',
      description: 'Detect recurring failure patterns and risks before they impact customer-facing services.',
      image: '/images/incidentmind/prevent-recurrence.png',
      alt: 'Prevent repeat incidents and proactive guardrails clustering',
      cta: 'View Risk Guardrails',
      action: onLaunchConsole,
      badge: 'Proactive Alerting',
    },
  ];

  const benefits = [
    {
      icon: BrainCircuit,
      title: 'Remember',
      subtitle: 'Institutional Memory',
      desc: 'Preserve verified incident solutions in permanent organizational memory.',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      icon: Search,
      title: 'Investigate',
      subtitle: 'Contextual Diagnosis',
      desc: 'Correlate live telemetry with historical data to isolate root causes rapidly.',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      icon: Zap,
      title: 'Resolve',
      subtitle: 'Verified Action',
      desc: 'Execute safe, proven remediation playbooks with full human oversight.',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      icon: ShieldCheck,
      title: 'Prevent',
      subtitle: 'System Guardrails',
      desc: 'Identify recurring failure patterns before they cause production downtime.',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Ingest & Correlate',
      description: 'Capture active incident signals and identify impacted services immediately.',
      icon: Activity,
    },
    {
      step: '02',
      title: 'Recall & Match',
      description: 'Match current symptoms against verified resolutions from past incidents.',
      icon: RefreshCw,
    },
    {
      step: '03',
      title: 'Investigate & Diagnose',
      description: 'Analyze telemetry and error patterns to pinpoint the underlying cause.',
      icon: Cpu,
    },
    {
      step: '04',
      title: 'Resolve & Retain',
      description: 'Apply validated solutions and automatically save learnings for the future.',
      icon: FileCheck,
    },
  ];

  const intelligenceLifecycle = [
    {
      step: '01',
      name: 'Detect',
      color: 'bg-indigo-600',
      description: 'Instantly ingest and prioritize incident signals across your infrastructure.',
    },
    {
      step: '02',
      name: 'Analyze',
      color: 'bg-blue-600',
      description: 'Extract affected services, error signatures, and blast radius in real time.',
    },
    {
      step: '03',
      name: 'Match',
      color: 'bg-violet-600',
      description: 'Correlate current symptoms against verified historical resolutions.',
    },
    {
      step: '04',
      name: 'Diagnose',
      color: 'bg-purple-600',
      description: 'Provide high-confidence root cause analysis based on proven evidence.',
    },
    {
      step: '05',
      name: 'Resolve',
      color: 'bg-emerald-600',
      description: 'Execute validated remediation playbooks and preserve knowledge permanently.',
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
              <p className="text-[10px] text-[#64748B] font-mono leading-none">Incident Intelligence</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#64748B]">
            <a href="#features" className="hover:text-[#4F46E5] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#4F46E5] transition-colors">Workflow</a>
            <a href="#lifecycle" className="hover:text-[#4F46E5] transition-colors">Intelligence</a>
            <button onClick={onOpenHistory} className="hover:text-[#4F46E5] transition-colors cursor-pointer">
              Past Incidents
            </button>
            <a href="#capabilities" className="hover:text-[#4F46E5] transition-colors">Capabilities</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
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
                AI-Powered Incident Response
              </span>
              <span className="text-[10px] text-[#64748B] font-mono border-l border-[#E2E8F0] pl-2">
                Enterprise Ready
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#172033] tracking-tight leading-[1.12]">
              From Incident to Insight <br className="hidden sm:inline" />
              <span className="text-[#4F46E5]">with AI Memory</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-[#64748B] leading-relaxed max-w-2xl mx-auto">
              IncidentMind AI helps DevOps and SRE teams investigate, resolve, and prevent incidents faster using AI and persistent memory.
            </p>

            {/* Dual CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={onLaunchConsole}
                className="px-6 py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Get Started</span>
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
                <span>Explore Features</span>
              </button>
            </div>

            {/* Trust chips */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#64748B] font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Instant knowledge recall
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Human-in-the-loop verification
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Enterprise reliability guardrails
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
                    <p className="text-[11px] text-[#64748B] truncate font-mono">Correlating historical patterns across production services</p>
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
              IncidentMind AI transforms every resolved incident into persistent knowledge, helping your team investigate smarter and prevent recurring problems.
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
                    <span className="text-[11px] text-[#94A3B8] font-mono">IncidentMind AI</span>
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
              Every stage of response feeds into the next, building compounding knowledge for your engineering team.
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

      {/* SECTION 6: INTELLIGENCE LIFECYCLE & CAPABILITIES */}
      <section id="lifecycle" className="py-16 md:py-24 bg-[#F5F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-semibold text-[#4F46E5] uppercase tracking-wider bg-[#EEF2FF] border border-indigo-100 px-3 py-1 rounded-full">
              Continuous Learning
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172033] tracking-tight">
              The 5-Stage Incident Intelligence Cycle
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#64748B] leading-relaxed">
              How IncidentMind AI structures incident data into actionable, verified solutions without speculation.
            </p>
          </div>

          {/* Intelligence Lifecycle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
            {intelligenceLifecycle.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-8 h-8 rounded-lg ${item.color} text-white font-mono font-bold flex items-center justify-center text-sm shadow-xs`}>
                      {item.step}
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

          {/* Capabilities Specs Box */}
          <div id="capabilities" className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="border-b md:border-b-0 md:border-r border-[#E2E8F0] pb-6 md:pb-0 md:pr-6">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">Institutional Memory</span>
                <h4 className="text-lg font-bold text-[#172033] mt-1">Verified Solution Store</h4>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  Every incident resolution is organized and indexed so your team never investigates the same problem twice.
                </p>
              </div>

              <div className="border-b md:border-b-0 md:border-r border-[#E2E8F0] pb-6 md:pb-0 md:pr-6">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">Fast Triage</span>
                <h4 className="text-lg font-bold text-[#172033] mt-1">Sub-Second Diagnostics</h4>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  Real-time correlation delivers immediate, evidence-grounded answers when production services are degraded.
                </p>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">Human-In-The-Loop</span>
                <h4 className="text-lg font-bold text-[#172033] mt-1">Safe Action Authorization</h4>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  All remediation playbooks and automation require explicit engineer confirmation before execution.
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
                AI-powered incident response platform with persistent institutional memory for engineering teams.
              </p>
              <div className="flex items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  All Systems Operational
                </div>
                <ThemeToggle className="py-1 px-2" />
              </div>
            </div>

            {/* Col 2: Platform */}
            <div>
              <h4 className="font-semibold text-[#172033] mb-3 uppercase tracking-wider text-[11px]">Platform</h4>
              <ul className="space-y-2">
                <li><button onClick={onLaunchConsole} className="hover:text-[#4F46E5] transition-colors cursor-pointer">Executive Overview</button></li>
                <li><button onClick={onOpenInvestigation} className="hover:text-[#4F46E5] transition-colors cursor-pointer">AI Investigation</button></li>
                <li><button onClick={onOpenMemoryExplorer} className="hover:text-[#4F46E5] transition-colors cursor-pointer">Memory Explorer</button></li>
                <li><button onClick={onOpenAnalytics} className="hover:text-[#4F46E5] transition-colors cursor-pointer">Reliability Analytics</button></li>
              </ul>
            </div>

            {/* Col 3: Intelligence */}
            <div>
              <h4 className="font-semibold text-[#172033] mb-3 uppercase tracking-wider text-[11px]">Intelligence</h4>
              <ul className="space-y-2">
                <li><a href="#lifecycle" className="hover:text-[#4F46E5] transition-colors">Intelligence Cycle</a></li>
                <li><a href="#features" className="hover:text-[#4F46E5] transition-colors">Persistent Knowledge</a></li>
                <li><a href="#how-it-works" className="hover:text-[#4F46E5] transition-colors">Incident Lifecycle</a></li>
                <li><a href="#capabilities" className="hover:text-[#4F46E5] transition-colors">Security & Safety</a></li>
              </ul>
            </div>

            {/* Col 4: Project */}
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
                <li><span className="hover:text-[#4F46E5] transition-colors cursor-pointer">Live System Status</span></li>
                <li><span className="hover:text-[#4F46E5] transition-colors cursor-pointer">Incident Playbooks</span></li>
                <li><span className="text-[#94A3B8]">Enterprise Edition</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
            <p>© 2026 IncidentMind AI. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-mono">Status: Operational</span>
              <span>•</span>
              <span className="text-[11px] font-mono">Protected by Enterprise Guardrails</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
