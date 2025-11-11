import { supabase } from '../supabase';

export async function listProfessionals(query?: { search?: string; city?: string; specialty?: string }) {
  let req = supabase.from('professionals').select('*').eq('approved', true);
  if (query?.city) req = req.ilike('city', `%${query.city}%`);
  if (query?.specialty) req = req.ilike('specialty', `%${query.specialty}%`);
  const { data, error } = await req;
  if (error) throw error;
  return data || [];
}

export async function approveProfessional(id: string) {
  const { data, error } = await supabase.from('professionals').update({ approved: true }).eq('id', id).select();
  if (error) throw error;
  return data?.[0];
}