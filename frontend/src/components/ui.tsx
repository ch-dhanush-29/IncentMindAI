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
    critical: 'bg-red-50 text-red-700 border-red-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    medium: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    low: 'bg-blue-50 text-blue-700 border-blue-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    purple: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    cyan: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
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

// Consistent Severity Badge: Critical red, High orange, Medium yellow (#FEF3C7 / #92400E), Low blue
export const SeverityBadge: React.FC<{ severity: string; className?: string }> = ({ severity, className }) => {
  const sev = severity.toLowerCase();
  if (sev === 'critical') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-red-50 text-red-700 border border-red-200', className)}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
        Critical
      </span>
    );
  }
  if (sev === 'high') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-orange-50 text-orange-700 border border-orange-200', className)}>
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        High
      </span>
    );
  }
  if (sev === 'medium') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]', className)}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#92400E]" />
        Medium
      </span>
    );
  }
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200', className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
      Low
    </span>
  );
};

// Specialized Status Badge: Resolved green, Investigating indigo, Mitigated blue
export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className }) => {
  const st = status.toLowerCase();
  if (st === 'resolved') {
    return (
      <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200', className)}>
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        Resolved
      </span>
    );
  }
  if (st === 'investigating') {
    return (
      <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-indigo-50 text-indigo-700 border border-indigo-200', className)}>
        <Activity className="w-3 h-3 text-indigo-600 animate-spin" />
        Investigating
      </span>
    );
  }
  if (st === 'mitigated') {
    return (
      <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200', className)}>
        <Check className="w-3 h-3 text-blue-600" />
        Mitigated
      </span>
    );
  }
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200', className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      {status}
    </span>
  );
};

// Specialized Hindsight Badge
export const HindsightBadge: React.FC<{ label?: string; className?: string }> = ({ label = 'Hindsight TEMPR', className }) => {
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-indigo-50 text-indigo-700 border border-indigo-200', className)}>
      <Brain className="w-3 h-3 text-indigo-600" />
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
    secondary: 'bg-white hover:bg-[#F8FAFC] text-[#172033] border border-[#E2E8F0] hover:border-slate-300 shadow-xs',
    outline: 'bg-white hover:bg-[#EEF2FF] text-[#4F46E5] border border-[#E2E8F0] hover:border-indigo-200 shadow-xs',
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-red-600 shadow-xs',
    ghost: 'bg-transparent hover:bg-slate-100 text-[#64748B] hover:text-[#172033] border border-transparent',
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

// Card - Rounded (12-16px), white background, subtle shadow, thin border
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white border border-[#E2E8F0] shadow-xs p-5 transition-colors',
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
    <div className={cn('relative group rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs overflow-hidden', className)}>
      <div className="flex items-center justify-between px-3 py-1.5 bg-white border-b border-[#E2E8F0] text-[11px] text-[#64748B]">
        <span className="flex items-center gap-1.5 text-[#4F46E5] font-medium">
          <Terminal className="w-3.5 h-3.5" />
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[#64748B] hover:text-[#172033] px-2 py-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
          title="Copy command"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 text-[#172033] overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
        <code>{code}</code>
      </pre>
    </div>
  );
};
