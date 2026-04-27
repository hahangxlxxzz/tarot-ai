import React from 'react';
import { cn } from '../lib/utils';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'tertiary' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-surface-dim font-semibold uppercase tracking-wider shadow-md hover:brightness-110 active:scale-[0.95] cursor-pointer',
      secondary: 'bg-surface-container-highest text-secondary border border-primary/20 hover:bg-surface-container-high cursor-pointer active:scale-[0.98]',
      tertiary: 'bg-transparent border border-primary/40 text-primary hover:bg-primary/5 cursor-pointer active:scale-[0.98]',
      ghost: 'bg-transparent hover:bg-primary/10 text-outline hover:text-primary cursor-pointer active:scale-[0.98]',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'px-5 py-2.5 rounded-sm transition-all duration-200 flex items-center justify-center gap-2 text-xs disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

export const GlassCard = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div className={cn('bg-surface-container/90 border border-primary/20 rounded-md p-6 shadow-xl', className)} {...props}>
    {children}
  </div>
);

export const SectionTitle = ({ children, subtitle, icon: Icon }: { children: React.ReactNode; subtitle?: string; icon?: React.ElementType }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-1">
      {Icon && <Icon className="w-4 h-4 text-primary" />}
      <h2 className="text-xl font-serif italic tracking-wide text-secondary">{children}</h2>
    </div>
    {subtitle && <p className="text-[10px] text-outline uppercase tracking-widest">{subtitle}</p>}
  </div>
);
