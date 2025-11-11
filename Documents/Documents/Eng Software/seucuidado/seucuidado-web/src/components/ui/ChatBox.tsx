import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { chatChannel } from '../../lib/realtime';

export const ChatBox: React.FC<{ chatId: string; senderId?: string }> = ({ chatId, senderId }) => {
  const [messages, setMessages] = useState<Array<{ id: string; text: string; me?: boolean }>>([
    { id: '1', text: 'Olá! Como posso ajudar?', me: false },
  ]);
  const [input, setInput] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    const channel = chatChannel(chatId);
    channel.on('broadcast', { event: 'message' }, (payload: any) => {
      const text = payload?.payload?.text as string;
      if (text) setMessages((m) => [...m, { id: String(Date.now()), text }]);
    });
    channel.subscribe();
    channelRef.current = channel;
    return () => {
      channel.unsubscribe();
    };
  }, [chatId]);

  function send() {
    if (!input.trim()) return;
    setMessages((m) => [...m, { id: String(Date.now()), text: input, me: true }]);
    channelRef.current?.send({ type: 'broadcast', event: 'message', payload: { text: input, senderId } });
    setInput('');
  }

  return (
    <div className="card w-full max-w-2xl">
      <div ref={ref} className="p-4 h-64 overflow-y-auto space-y-2">
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[75%] px-3 py-2 rounded-xl ${m.me ? 'ml-auto bg-primary text-white' : 'bg-snow'}`}>{m.text}</div>
        ))}
      </div>
      <div className="p-3 flex gap-2">
        <input className="flex-1 border rounded-xl px-3 py-2" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Digite uma mensagem" />
        <Button onClick={send}>Enviar</Button>
      </div>
    </div>
  );
};