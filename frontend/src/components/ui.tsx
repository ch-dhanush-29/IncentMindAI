import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

// Badge
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'success' | 'purple' | 'neutral';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', className, children, ...props }) => {
  const variants = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/30',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    info: 'bg-cyan-500/10 text-accent-cyan border-cyan-500/30',
    success: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80',
    purple: 'bg-purple-950/60 text-purple-300 border-purple-800/80',
    neutral: 'bg-gray-800/80 text-gray-300 border-gray-700/80',
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

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
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
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';
  
  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-xs gap-2',
    lg: 'px-4 py-2.5 text-sm gap-2',
  };

  const variants = {
    primary: 'bg-accent-blue hover:bg-blue-600 text-white shadow-sm shadow-blue-500/20 border border-blue-500/40',
    secondary: 'bg-card hover:bg-background text-gray-200 border border-border hover:border-gray-700 shadow-sm',
    outline: 'bg-transparent hover:bg-card text-accent-cyan border border-accent-cyan/40 hover:border-accent-cyan',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-sm shadow-red-500/20 border border-red-500/40',
    ghost: 'bg-transparent hover:bg-card/80 text-gray-400 hover:text-gray-200 border border-transparent',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 border border-emerald-500/40',
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
      className={cn('rounded-xl bg-card border border-border/90 shadow-sm shadow-black/20 p-5 backdrop-blur-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
};
