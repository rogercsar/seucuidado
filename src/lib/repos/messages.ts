import { supabase } from '../supabase';

export async function listMessages(chatId: string) {
  const { data, error } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function sendMessage(chatId: string, senderId: string, text: string) {
  const { data, error } = await supabase.from('messages').insert({ chat_id: chatId, sender_id: senderId, text }).select();
  if (error) throw error;
  return data?.[0];
}