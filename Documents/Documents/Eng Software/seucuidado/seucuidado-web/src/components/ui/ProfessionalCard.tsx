import React from 'react';
import { Star } from 'lucide-react';
import { Button } from './Button';
import { Professional } from '../../lib/utils';
import Link from 'next/link';

export const ProfessionalCard: React.FC<{ p: Professional }> = ({ p }) => (
  <div className="card p-4 flex gap-4 items-center">
    <img src={p.photoUrl} alt={p.name} className="w-20 h-20 rounded-xl object-cover" />
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h3 className="font-poppins text-lg font-semibold">{p.name}</h3>
        <div className="flex items-center gap-1 text-yellow-500">
          <Star size={16} />
          <span className="text-sm">{p.rating.toFixed(1)}</span>
        </div>
      </div>
      <p className="text-sm text-textblue/80">{p.specialty} • {p.city}</p>
      <p className="text-sm mt-1">R$ {p.pricePerHour}/hora</p>
    </div>
    <Link href={`/professional/${p.id}`}>
      <Button>Ver perfil</Button>
    </Link>
  </div>
);