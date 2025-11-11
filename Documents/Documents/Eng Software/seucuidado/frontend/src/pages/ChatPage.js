import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Heart } from "lucide-react";
import { api } from "@/App";
import { toast } from "sonner";

const ChatPage = ({ user }) => {
  const navigate = useNavigate();
  const { otherUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages?other_user_id=${otherUserId}`);
      setMessages(response.data);
      
      // Get other user info from first message if available
      if (response.data.length > 0 && !otherUser) {
        // Mock other user data (in real app, fetch from /users endpoint)
        setOtherUser({
          id: otherUserId,
          name: "Profissional",
          picture: "https://i.pravatar.cc/150?img=5"
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await api.post("/messages", {
        receiver_id: otherUserId,
        content: newMessage
      });
      
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erro ao enviar mensagem");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              data-testid="back-button"
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            {otherUser && (
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 ring-2 ring-sky-100">
                  <AvatarImage src={otherUser.picture} />
                  <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold">{otherUser.name}</div>
                  <div className="text-xs text-green-600">• Online</div>
                </div>
              </div>
            )}
          </div>
          
          <Heart className="w-6 h-6 text-sky-400 fill-sky-400" />
        </div>
      </header>

      {/* Chat Container */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="h-[calc(100vh-200px)] flex flex-col rounded-2xl shadow-xl border-2 border-white">
          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isMe = msg.sender_id === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    data-testid={`message-${msg.id}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        isMe
                          ? "bg-gradient-to-r from-sky-400 to-emerald-400 text-white rounded-br-sm"
                          : "bg-white border-2 border-gray-100 text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      <p className="break-words">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isMe ? "text-sky-100" : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Send className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Nenhuma mensagem ainda</p>
                  <p className="text-sm">Envie uma mensagem para iniciar a conversa</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <CardHeader className="border-t bg-gray-50/50 p-4">
            <div className="flex gap-3">
              <Input
                data-testid="message-input"
                type="text"
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 h-12 rounded-xl border-2 border-gray-200 focus:border-sky-400"
              />
              <Button
                data-testid="send-button"
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white h-12 px-6 rounded-xl"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;