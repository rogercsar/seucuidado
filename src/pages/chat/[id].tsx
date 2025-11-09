import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button';
import { Send } from 'lucide-react';
import { useRouter } from 'next/router';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface Message {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  chat_id?: string; // chat_id é opcional na interface, pois vem do insert, mas não necessariamente do select
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const router = useRouter();
  const { id: chatId } = router.query;
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
      if (error) console.error('Error fetching messages:', error);
      else setMessages(data as Message[] || []);
    };
    fetchMessages();
  }, [chatId]);

  // Subscribe to new messages
  useEffect(() => {
    if (!chatId) return;
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
          setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !chatId) return;

    const { error } = await supabase
      .from('messages')
      .insert([{ content: newMessage, user_id: user.id, chat_id: chatId }]);

    if (error) console.error('Error sending message:', error);
    else setNewMessage('');
  };

  if (!user) {
    return <p>Por favor, faça login para acessar o chat.</p>;
  }

  return (
    <div className="flex flex-col h-[70vh] bg-white dark:bg-dark-bg/50 rounded-lg shadow-soft">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="font-poppins font-semibold">Chat com Profissional</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.user_id === user.id ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-xs p-3 rounded-lg ${msg.user_id === user.id ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="w-full p-2 bg-neutral dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button type="submit" size="icon" className="ml-2">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
