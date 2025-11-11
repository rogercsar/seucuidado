-- Seed de exemplo para a tabela appointments
-- IMPORTANTE: Substitua REPLACE_WITH_USER_ID pelo ID do usuário logado
-- e REPLACE_WITH_PROFESSIONAL_ID_X pelos IDs de profissionais existentes.
-- Execute este script no SQL editor do seu projeto Supabase.

-- Próximo agendamento
INSERT INTO public.appointments (user_id, professional_id, scheduled_at, status, price)
VALUES ('REPLACE_WITH_USER_ID', REPLACE_WITH_PROFESSIONAL_ID_1, NOW() + INTERVAL '2 days', 'scheduled', 150);

-- Agendamento passado concluído
INSERT INTO public.appointments (user_id, professional_id, scheduled_at, status, price)
VALUES ('REPLACE_WITH_USER_ID', REPLACE_WITH_PROFESSIONAL_ID_2, NOW() - INTERVAL '10 days', 'completed', 120);

-- Agendamento cancelado (não aparece em Próximos)
INSERT INTO public.appointments (user_id, professional_id, scheduled_at, status, price)
VALUES ('REPLACE_WITH_USER_ID', REPLACE_WITH_PROFESSIONAL_ID_1, NOW() + INTERVAL '5 days', 'canceled', 100);