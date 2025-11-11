import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const appointmentId = searchParams.get('appointment_id');

  if (!appointmentId) {
    return NextResponse.redirect(new URL('/dashboard?payment_error=1', req.url));
  }

  try {
    // Atualizar o appointment para "scheduled" após pagamento
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'scheduled' })
      .eq('id', appointmentId);

    if (error) throw error;

    // Redirecionar para dashboard com sucesso
    return NextResponse.redirect(new URL('/dashboard?payment_success=1', req.url));
  } catch (e) {
    console.error('Erro ao atualizar status do pagamento:', e);
    return NextResponse.redirect(new URL('/dashboard?payment_error=1', req.url));
  }
}