import React from 'react';
import { cn } from '../../lib/utils';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  leftIcon?: React.ReactNode;
};

export const Button: React.FC<Props> = ({ variant = 'primary', className, leftIcon, children, ...props }) => {
  const base = 'px-4 py-2 rounded-xl font-semibold transition-all';
  const styles = {
    primary: 'btn-gradient text-white shadow-soft hover:opacity-90',
    secondary: 'bg-support text-textblue shadow-soft hover:shadow-lg',
    ghost: 'bg-transparent border border-primary text-textblue hover:bg-snow',
  }[variant];

  return (
    <button className={cn(base, styles, className)} {...props}>
      <span className="inline-flex items-center gap-2">
        {leftIcon}
        {children}
      </span>
    </button>
  );
};