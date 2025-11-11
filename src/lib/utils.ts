export function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export type Professional = {
  id: string;
  name: string;
  specialty: string;
  city: string;
  pricePerHour: number;
  rating: number;
  photoUrl: string;
  bio: string;
  lat?: number;
  lng?: number;
  availability?: string[];
};

export const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Ana Souza',
    specialty: 'Enfermeira',
    city: 'São Paulo',
    pricePerHour: 120,
    rating: 4.8,
    photoUrl: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400&h=400&fit=crop',
    bio: 'Profissional acolhedora com 10 anos de experiência em cuidados domiciliares.',
    lat: -23.5505,
    lng: -46.6333,
    availability: ['08:00', '10:00', '14:00', '18:00'],
  },
  {
    id: '2',
    name: 'Carlos Lima',
    specialty: 'Fisioterapeuta',
    city: 'Rio de Janeiro',
    pricePerHour: 150,
    rating: 4.6,
    photoUrl: 'https://images.unsplash.com/photo-1578496781985-906b98b1b9bd?w=400&h=400&fit=crop',
    bio: 'Atendimento humanizado com foco em reabilitação e mobilidade.',
    lat: -22.9068,
    lng: -43.1729,
    availability: ['09:00', '11:00', '15:00', '19:00'],
  },
  {
    id: '3',
    name: 'Marina Alves',
    specialty: 'Cuidadora',
    city: 'Curitiba',
    pricePerHour: 90,
    rating: 4.9,
    photoUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop',
    bio: 'Cuidado com carinho e atenção, especializada em idosos.',
    lat: -25.4284,
    lng: -49.2733,
    availability: ['07:00', '13:00', '17:00'],
  },
];