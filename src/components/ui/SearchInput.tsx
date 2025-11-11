import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export const SearchInput: React.FC<Props> = ({ value, onChange, placeholder = 'Busque por especialidade ou cidade', className }) => {
  return (
    <div className={cn('card flex items-center gap-2 px-3 py-2', className)}>
      <Search className="text-primary" size={18} />
      <input
        className="flex-1 outline-none bg-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};