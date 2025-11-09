import React from 'react';
import Image from 'next/image';
import { Button } from './ui/Button';
import { Star } from 'lucide-react';

interface ProfessionalCardProps {
  name: string;
  specialty: string;
  rating: number;
  imageUrl: string;
  pricePerHour: number;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  name,
  specialty,
  rating,
  imageUrl,
  pricePerHour
}) => {
  return (
    <div className="bg-white dark:bg-dark-bg/50 rounded-lg shadow-soft hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={`Foto de ${name}`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-poppins font-semibold text-dark-text dark:text-dark-text-main">{name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{specialty}</p>
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={i < Math.floor(rating) ? 'currentColor' : 'none'} />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-500">{rating.toFixed(1)}</span>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-lg font-semibold text-dark-text dark:text-dark-text-main">
            R${pricePerHour.toFixed(2)}<span className="text-sm font-normal">/hora</span>
          </p>
          <Button size="sm">Ver Perfil</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCard;
