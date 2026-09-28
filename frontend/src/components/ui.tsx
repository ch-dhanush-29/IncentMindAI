import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Brain, Check, Copy, AlertTriangle, ShieldCheck, Activity, Terminal } from 'lucide-react';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

// Badge
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'success' | 'purple' | 'cyan' | 'neutral';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', className, children, ...props }) => {
  const variants = {
    critical: 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.12)]',
    high: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.12)]',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    success: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 shadow-[0_0_12px_rgba(16,185,129,0.12)]',
    purple: 'bg-purple-950/60 text-purple-300 border-purple-800/80 shadow-[0_0_12px_rgba(168,85,247,0.15)]',
    cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/80 shadow-[0_0_12px_rgba(6,182,212,0.15)]',
    neutral: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border tracking-wide transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// Specialized Severity Badge
export const SeverityBadge: React.FC<{ severity: string; className?: string }> = ({ severity, className }) => {
  const sev = severity.toLowerCase();
  if (sev === 'critical') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.2)]', className)}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
        Critical
      </span>
    );
  }
  if (sev === 'high') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/40', className)}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        High
      </span>
    );
  }
  if (sev === 'medium') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-yellow-500/15 text-yellow-400 border border-yellow-500/40', className)}>
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
        Medium
      </span>
    );
  }
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/40', className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      Low
    </span>
  );
};

// Specialized Status Badge
export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className }) => {
  const st = status.toLowerCase();
  if (st === 'resolved') {
    return (
      <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-950/70 text-emerald-300 border border-emerald-700/70', className)}>
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        Resolved
      </span>
    );
  }
  if (st === 'investigating') {
    return (
      <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-cyan-950/70 text-cyan-300 border border-cyan-700/70 shadow-[0_0_12px_rgba(0,210,255,0.15)]', className)}>
        <Activity className="w-3 h-3 text-cyan-400 animate-spin" />
        Investigating
      </span>
    );
  }
  if (st === 'mitigated') {
    return (
      <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-blue-950/70 text-blue-300 border border-blue-700/70', className)}>
        <Check className="w-3 h-3 text-blue-400" />
        Mitigated
      </span>
    );
  }
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700', className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      {status}
    </span>
  );
};

// Specialized Hindsight Badge
export const HindsightBadge: React.FC<{ label?: string; className?: string }> = ({ label = 'Hindsight TEMPR', className }) => {
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-gradient-to-r from-purple-950/80 to-indigo-950/80 text-purple-200 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]', className)}>
      <Brain className="w-3 h-3 text-purple-400 animate-pulse" />
      {label}
    </span>
  );
};

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success' | 'hindsight';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';
  
  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-xs gap-2',
    lg: 'px-4 py-2.5 text-sm gap-2',
  };

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-accent-blue hover:from-blue-500 hover:to-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-400/30 hover:border-blue-300/50',
    secondary: 'bg-card hover:bg-card-hover text-slate-200 border border-border hover:border-slate-700 shadow-sm',
    outline: 'bg-transparent hover:bg-card text-accent-cyan border border-accent-cyan/40 hover:border-accent-cyan shadow-sm shadow-cyan-950/20',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-rose-600/20 border border-red-500/40',
    ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20 border border-emerald-400/40',
    hindsight: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-600/25 border border-purple-400/40',
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      )}
      {children}
    </button>
  );
};

// Card
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-xl bg-[#0F172A] border border-[#1E293B] shadow-sm shadow-black/40 p-5 backdrop-blur-sm transition-all hover:border-[#334155]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// CodeBlock with Copy Action
export const CodeBlock: React.FC<{ code: string; language?: string; className?: string }> = ({
  code,
  language = 'bash',
  className
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('relative group rounded-lg bg-black/80 border border-slate-800 font-mono text-xs overflow-hidden', className)}>
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[10px] text-slate-400">
        <span className="flex items-center gap-1.5 text-accent-cyan">
          <Terminal className="w-3 h-3" />
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
          title="Copy command"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
        <code>{code}</code>
      </pre>
    </div>
  );
};

