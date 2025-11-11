"use client";
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { ProfessionalCard } from '../../components/ui/ProfessionalCard';
import { mockProfessionals } from '../../lib/utils';
import { Map } from '../../components/ui/Map';
import { Heart, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ProfessionalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [professionals, setProfessionals] = useState(mockProfessionals);

  useEffect(() => {
    async function fetchProfessionals() {
      try {
        const { data, error } = await supabase
          .from('professionals')
          .select('id,specialty,price_per_hour,rating,bio,city,lat,lng,users(name)');
        if (error) throw error;
        if (data && Array.isArray(data)) {
          const mapped = data.map((row: any) => ({
            id: row.id,
            name: row.users?.name || 'Profissional',
            specialty: row.specialty,
            city: row.city || 'Cidade',
            pricePerHour: Number(row.price_per_hour || 0),
            rating: Number(row.rating || 0),
            bio: row.bio || '',
            lat: row.lat ? Number(row.lat) : undefined,
            lng: row.lng ? Number(row.lng) : undefined,
            photoUrl: 'https://i.pravatar.cc/150?u=' + row.id,
          }));
          setProfessionals(mapped);
        }
      } catch (e) {
        // mantém mocks em caso de erro
      }
    }
    fetchProfessionals();
  }, []);

  const cities = useMemo(() => Array.from(new Set(professionals.map(p => p.city))), [professionals]);
  const specialties = ['Enfermeira', 'Fisioterapeuta', 'Cuidadora', 'Home Care'];

  const filtered = useMemo(() => {
    let list = [...professionals];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.specialty.toLowerCase().includes(s) ||
        p.bio.toLowerCase().includes(s)
      );
    }
    if (specialtyFilter !== 'all') {
      list = list.filter(p => p.specialty === specialtyFilter);
    }
    if (cityFilter !== 'all') {
      list = list.filter(p => p.city === cityFilter);
    }
    return list;
  }, [searchTerm, specialtyFilter, cityFilter, professionals]);

  const markers = filtered.filter(p => p.lat && p.lng).map(p => ({ lat: p.lat!, lng: p.lng!, title: p.name }));

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-full">
              <div className="relative">
                <Heart className="w-8 h-8 text-sky-400" />
                <MapPin className="w-4 h-4 text-emerald-400 absolute -bottom-1 -right-1" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-emerald-400 bg-clip-text text-transparent">SeuCuidado</h1>
          </div>
          <Link href="/dashboard" className="rounded-full px-6 py-2 bg-sky-400 text-white">Meu Painel</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Profissionais Disponíveis</h1>
          <p className="text-gray-600">Encontre o profissional ideal para suas necessidades</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 rounded-xl border-2 border-gray-100 focus:border-sky-400 px-4"
            />

            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="h-12 rounded-xl border-2 border-gray-100 px-3"
            >
              <option value="all">Todas as especialidades</option>
              {specialties.map(s => (<option key={s} value={s}>{s}</option>))}
            </select>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="h-12 rounded-xl border-2 border-gray-100 px-3"
            >
              <option value="all">Todas as cidades</option>
              {cities.map(city => (<option key={city} value={city}>{city}</option>))}
            </select>

            <button
              onClick={() => { setSearchTerm(''); setSpecialtyFilter('all'); setCityFilter('all'); }}
              className="h-12 rounded-xl border-2 border-gray-200 hover:bg-gray-50"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold text-sky-600">{filtered.length}</span> profissionais encontrados
          </p>
        </div>

        {/* Map */}
        {markers.length > 0 && (
          <div className="my-4">
            <Map markers={markers} />
          </div>
        )}

        {/* Professionals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="cursor-pointer" onClick={() => location.assign(`/professional/${p.id}`)}>
              <ProfessionalCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}