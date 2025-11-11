import { supabase } from './supabase';

export function chatChannel(chatId: string) {
  return supabase.channel(`chat_${chatId}`, {
    config: {
      broadcast: { ack: true },
      presence: { key: chatId },
    },
  });
}