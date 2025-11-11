"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Button } from '../../../components/ui/Button';
import { Heart, MapPin, UploadCloud, FileText, CheckCircle } from 'lucide-react';
import { logoutAndClearAuth } from '../../../lib/auth';

interface ProfessionalProfile {
  id: string;
  radius_km: number;
  approved: boolean;
  documents: Array<{ name: string; path: string; url?: string; size?: number; type?: string }>|null;
}

export default function ProProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [professional, setProfessional] = useState<ProfessionalProfile | null>(null);
  const [radiusKm, setRadiusKm] = useState<string>('10');
  const [docs, setDocs] = useState<ProfessionalProfile['documents']>([]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth');
          return;
        }
        const { data: profs, error: profErr } = await supabase
          .from('professionals')
          .select('id, radius_km, approved, documents')
          .eq('user_id', user.id)
          .limit(1);
        if (profErr) throw profErr;
        const prof = Array.isArray(profs) && profs.length > 0 ? profs[0] : null;
        if (!prof) {
          setError('Não encontramos seu perfil de profissional.');
          setLoading(false);
          return;
        }
        const profile: ProfessionalProfile = {
          id: prof.id,
          radius_km: typeof prof.radius_km === 'number' ? prof.radius_km : 10,
          approved: !!prof.approved,
          documents: Array.isArray(prof.documents) ? prof.documents : [],
        };
        setProfessional(profile);
        setRadiusKm(String(profile.radius_km || 10));
        setDocs(profile.documents || []);
      } catch (e) {
        setError('Falha ao carregar seu perfil.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  async function handleLogout() {
    try {
      await logoutAndClearAuth();
    } finally {
      router.replace('/');
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  }

  async function handleUploadFiles(files: FileList | null) {
    if (!files || !professional) return;
    setSaving(true);
    setError(null);
    try {
      const uploaded: Array<{ name: string; path: string; url?: string; size?: number; type?: string }> = [];
      for (const file of Array.from(files)) {
        const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const path = `${professional.id}/${Date.now()}-${safeName}`;
        const { error: upErr } = await supabase.storage.from('documents').upload(path, file, { cacheControl: '3600', upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from('documents').getPublicUrl(path);
        uploaded.push({ name: file.name, path, url: pub?.publicUrl, size: file.size, type: file.type });
      }
      const newDocs = [...(docs || []), ...uploaded];
      setDocs(newDocs);
      setSuccess('Documentos enviados com sucesso. Lembre-se de salvar as alterações.');
    } catch (e: any) {
      setError(e?.message || 'Falha ao enviar documentos. Verifique se o bucket "documents" existe no Storage do Supabase.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    if (!professional) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const radiusVal = Math.max(1, Number(radiusKm) || 1);
      const { error: updErr } = await supabase
        .from('professionals')
        .update({ radius_km: radiusVal, documents: docs })
        .eq('id', professional.id);
      if (updErr) throw updErr;
      setSuccess('Perfil atualizado com sucesso.');
    } catch (e: any) {
      setError(e?.message || 'Não foi possível salvar seu perfil.');
    } finally {
      setSaving(false);
    }
  }

  async function handleApprove() {
    if (!professional) return;
    if (!docs || docs.length === 0) {
      setError('Envie ao menos um documento antes de aprovar.');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const { error: updErr } = await supabase
        .from('professionals')
        .update({ approved: true })
        .eq('id', professional.id);
      if (updErr) throw updErr;
      setSuccess('Documentos validados e perfil aprovado.');
      setProfessional({ ...professional, approved: true });
    } catch (e: any) {
      setError(e?.message || 'Falha ao aprovar perfil.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-sky-50 to-emerald-50">
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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-emerald-400 bg-clip-text text-transparent">Perfil do Profissional</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pro/dashboard"><Button variant="ghost">Painel PRO</Button></Link>
            <Button className="rounded-full px-6 bg-red-500 hover:bg-red-600" onClick={handleLogout}>Sair</Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 py-8">
        {loading && (
          <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-200">Carregando...</div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">{error}</div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">{success}</div>
        )}

        {!loading && professional && (
          <section className="card p-6 space-y-6">
            <div>
              <h2 className="font-poppins text-xl mb-2">Raio de atendimento (km)</h2>
              <input
                className="input"
                type="number"
                min={1}
                value={radiusKm}
                onChange={(e) => setRadiusKm(e.target.value)}
                placeholder="Ex.: 10"
              />
              <p className="text-xs text-gray-500 mt-1">Defina o raio máximo em quilômetros para receber pedidos.</p>
            </div>

            <div>
              <h2 className="font-poppins text-xl mb-2">Documentos</h2>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <UploadCloud className="w-5 h-5 text-sky-500" />
                  <span className="text-sky-700">Enviar arquivos</span>
                  <input type="file" className="hidden" multiple onChange={(e) => handleUploadFiles(e.target.files)} />
                </label>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar alterações'}
                </Button>
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleApprove} disabled={saving || !docs || docs.length === 0}>
                  <CheckCircle className="w-4 h-4 mr-1" /> Aprovar perfil
                </Button>
              </div>
              <ul className="mt-4 space-y-2">
                {(docs || []).length === 0 && (
                  <li className="text-gray-500">Nenhum documento enviado.</li>
                )}
                {(docs || []).map((d, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-gray-600" />
                    {d.url ? (
                      <a href={d.url} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline">{d.name}</a>
                    ) : (
                      <span>{d.name}</span>
                    )}
                    {d.size ? <span className="text-gray-400">({Math.round(d.size/1024)} KB)</span> : null}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-2">Os arquivos são enviados para o bucket "documents" do Supabase Storage.</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}