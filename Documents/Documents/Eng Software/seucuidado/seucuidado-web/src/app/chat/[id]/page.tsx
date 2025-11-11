"use client";
import { ChatBox } from '../../../components/ui/ChatBox';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, Heart } from 'lucide-react';

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();

  // Mock other user data
  const otherUser = {
    name: "Profissional de Teste",
    picture: "https://i.pravatar.cc/150?img=5",
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="rounded-full p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img src={otherUser.picture} alt={otherUser.name} className="w-10 h-10 rounded-full ring-2 ring-sky-100" />
              <div>
                <div className="font-bold">{otherUser.name}</div>
                <div className="text-xs text-green-600">• Online</div>
              </div>
            </div>
          </div>
          <Heart className="w-6 h-6 text-sky-400 fill-sky-400" />
        </div>
      </header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="card h-[calc(100vh-160px)] flex flex-col">
          <ChatBox chatId={String(id)} />
        </div>
      </div>
    </main>
  );
}