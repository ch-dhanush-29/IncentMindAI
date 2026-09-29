import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Brain, Check, Copy, ShieldCheck, Activity, Terminal } from 'lucide-react';

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
    critical: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/60',
    high: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/60',
    medium: 'bg-[#FEF3C7] dark:bg-amber-950/40 text-[#92400E] dark:text-amber-400 border-[#FDE68A] dark:border-amber-800/60',
    low: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/60',
    info: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/60',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
    purple: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60',
    cyan: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
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

// Consistent Severity Badge: Critical red, High orange, Medium yellow, Low blue
export const SeverityBadge: React.FC<{ severity: string; className?: string }> = ({ severity, className }) => {
  const sev = (severity || 'low').toLowerCase();
  if (sev === 'critical') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/60', className)}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500" />
        Critical
      </span>
    );
  }
  if (sev === 'high') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60', className)}>
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        High
      </span>
    );
  }
  if (sev === 'medium') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#FEF3C7] dark:bg-amber-950/40 text-[#92400E] dark:text-amber-400 border border-[#FDE68A] dark:border-amber-800/60', className)}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#92400E] dark:bg-amber-400" />
        Medium
      </span>
    );
  }
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60', className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
      Low
    </span>
  );
};

// Specialized Status Badge: Resolved green, Investigating indigo, Mitigated blue
export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className }) => {
  const st = (status || 'new').toLowerCase();
  if (st === 'resolved' || st === 'closed') {
    return (
      <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60', className)}>
        <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        {status}
      </span>
    );
  }
  if (st === 'investigating') {
    return (
      <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60', className)}>
        <Activity className="w-3 h-3 text-indigo-600 dark:text-indigo-400 animate-spin" />
        Investigating
      </span>
    );
  }
  if (st === 'mitigated') {
    return (
      <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60', className)}>
        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
        Mitigated
      </span>
    );
  }
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700', className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      {status}
    </span>
  );
};

// Specialized Hindsight Badge
export const HindsightBadge: React.FC<{ label?: string; className?: string }> = ({ label = 'Hindsight TEMPR', className }) => {
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60', className)}>
      <Brain className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
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
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';
  
  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-xs gap-2',
    lg: 'px-4 py-2.5 text-sm gap-2',
  };

  const variants = {
    primary: 'bg-[#4F46E5] hover:bg-[#4338CA] text-white border border-[#4F46E5] shadow-xs',
    secondary: 'bg-white dark:bg-[#1E2536] hover:bg-[#F8FAFC] dark:hover:bg-[#252D3D] text-[#172033] dark:text-[#F1F5F9] border border-[#E2E8F0] dark:border-[#2D3545] shadow-xs',
    outline: 'bg-white dark:bg-[#141820] hover:bg-[#EEF2FF] dark:hover:bg-[#1E2536] text-[#4F46E5] dark:text-indigo-400 border border-[#E2E8F0] dark:border-[#222834] shadow-xs',
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-red-600 shadow-xs',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-[#1E2536] text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] border border-transparent',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 shadow-xs',
    hindsight: 'bg-[#4F46E5] hover:bg-[#4338CA] text-white border border-[#4F46E5] shadow-xs',
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

// Card - Theme aware with dark mode support
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] text-[#172033] dark:text-[#F1F5F9] shadow-xs p-5 transition-colors',
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
    <div className={cn('relative group rounded-xl bg-[#F8FAFC] dark:bg-[#0E1117] border border-[#E2E8F0] dark:border-[#222834] font-mono text-xs overflow-hidden', className)}>
      <div className="flex items-center justify-between px-3 py-1.5 bg-white dark:bg-[#161B22] border-b border-[#E2E8F0] dark:border-[#222834] text-[11px] text-[#64748B] dark:text-[#94A3B8]">
        <span className="flex items-center gap-1.5 text-[#4F46E5] dark:text-indigo-400 font-medium">
          <Terminal className="w-3.5 h-3.5" />
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-[#1F2633] transition-colors cursor-pointer"
          title="Copy command"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 text-[#172033] dark:text-[#F1F5F9] overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
        <code>{code}</code>
      </pre>
    </div>
  );
};
