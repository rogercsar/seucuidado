"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { ProfessionalCard } from '../components/ui/ProfessionalCard';
import { mockProfessionals } from '../lib/utils';
import { Heart, MapPin, Shield, Users, Clock } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const navigateToSearch = () => {
    router.push(`/professionals?search=${encodeURIComponent(search)}`);
  };

  const featured = mockProfessionals.slice(0, 3);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Heart className="w-8 h-8 text-sky-400" />
              <MapPin className="w-4 h-4 text-emerald-400 absolute -bottom-1 -right-1" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-emerald-400 bg-clip-text text-transparent">SeuCuidado</h1>
          </div>
          <Link href="/dashboard"><Button className="rounded-full px-6">Meu Painel</Button></Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-sky-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-200 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-block bg-sky-100 text-sky-600 rounded-full px-4 py-1 text-sm">Conectando você ao cuidado certo</span>
            <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Encontre o profissional certo para cuidar de{' '}
              <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">quem você ama</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Com poucos cliques, mais segurança e carinho no seu lar.</p>
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Buscar profissional ou especialidade..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-sky-400 outline-none"
                />
                <Button onClick={navigateToSearch} className="rounded-xl px-8 h-12">Buscar</Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-500">500+</div>
                <div className="text-sm text-gray-600">Profissionais</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-500">2.5k+</div>
                <div className="text-sm text-gray-600">Atendimentos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">4.9</div>
                <div className="text-sm text-gray-600">Avaliação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher o SeuCuidado?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-2 border-sky-100 hover:border-sky-300 transition shadow-lg hover:shadow-xl rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-sky-500" />
              </div>
              <h3 className="text-xl font-bold">Profissionais Verificados</h3>
              <p className="text-gray-600">Todos os profissionais passam por verificação de documentos e histórico.</p>
            </div>
            <div className="border-2 border-emerald-100 hover:border-emerald-300 transition shadow-lg hover:shadow-xl rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold">Atendimento Humanizado</h3>
              <p className="text-gray-600">Profissionais capacitados e com foco no cuidado empático.</p>
            </div>
            <div className="border-2 border-purple-100 hover:border-purple-300 transition shadow-lg hover:shadow-xl rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold">Agendamento Rápido</h3>
              <p className="text-gray-600">Agende atendimentos em poucos minutos direto pela plataforma.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="py-16 bg-gradient-to-br from-sky-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Profissionais em destaque</h2>
            <p className="text-gray-600">Conheça alguns dos nossos melhores profissionais</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((p) => (
              <div key={p.id} className="cursor-pointer" onClick={() => router.push(`/professional/${p.id}`)}>
                <ProfessionalCard p={p} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}