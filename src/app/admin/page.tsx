"use client";
import { useState } from 'react';
import { mockProfessionals } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
// import { approveProfessional, listProfessionals } from '../../lib/repos/professionals';

export default function AdminPage() {
  const [items, setItems] = useState(mockProfessionals.map(p => ({ ...p, approved: false })));

  async function approve(id: string) {
    setItems(items => items.map(i => (i.id === id ? { ...i, approved: true } : i)));
    alert('Profissional aprovado (mock). Integração com Supabase disponível.');
    // Em produção: await approveProfessional(id)
  }

  return (
    <main className="max-w-5xl mx-auto p-4">
      <h2 className="font-poppins text-2xl mb-4">Painel Admin — Aprovação de Profissionais</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <div key={p.id} className="card p-4">
            <img src={p.photoUrl} className="w-full h-36 object-cover rounded-xl" />
            <h3 className="font-poppins text-lg mt-2">{p.name}</h3>
            <p className="text-sm text-textblue/80">{p.specialty} • {p.city}</p>
            <p className="text-sm mt-1">R$ {p.pricePerHour}/hora</p>
            <div className="mt-3 flex justify-between items-center">
              <span className={`text-sm ${p.approved ? 'text-green-600' : 'text-yellow-600'}`}>{p.approved ? 'Aprovado' : 'Pendente'}</span>
              {!p.approved && <Button onClick={() => approve(p.id)}>Aprovar</Button>}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}