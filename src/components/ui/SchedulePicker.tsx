import React from 'react';

type Props = {
  availability: string[];
  selected?: string;
  onSelect: (v: string) => void;
};

export const SchedulePicker: React.FC<Props> = ({ availability, selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {availability.map((slot) => (
        <button
          key={slot}
          onClick={() => onSelect(slot)}
          className={`px-3 py-2 rounded-xl border ${selected === slot ? 'border-primary bg-primary/10' : 'border-snow bg-white'} hover:border-primary`}
        >
          {slot}
        </button>
      ))}
    </div>
  );
};