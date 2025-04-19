
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/sonner";

type ChatMessage = {
  sender: 'user' | 'bot';
  message: string;
};

export const ChatWidget = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'bot', message: "Hi there! I'm your AI assistant. How can I help you today?" }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Handle sending a chat message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatMessage.trim()) return;
    
    const userMsg: ChatMessage = { sender: 'user', message: chatMessage.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatMessage('');
    setChatLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: JSON.stringify({ 
          messages: [...chatMessages, userMsg].map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.message
          }))
        })
      });

      if (error) throw error;

      const botResponse: ChatMessage = { sender: 'bot', message: data.message };
      setChatMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chatbot Error:', error);
      toast.error("Failed to get chatbot response");
    } finally {
      setChatLoading(false);
    }
  };

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Focus chat input when chat opens
  useEffect(() => {
    if (chatOpen && chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [chatOpen]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${chatOpen ? 'w-80 sm:w-96' : 'w-auto'}`}>
      {chatOpen ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col h-96 fixed right-6 bottom-6 w-80 sm:w-96">
          <div className="bg-brand-500 text-white px-4 py-3 flex justify-between items-center">
            <h3 className="text-sm font-medium">AI Assistant</h3>
            <button 
              onClick={() => setChatOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4" ref={chatContainerRef}>
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`${
                    msg.sender === 'user' 
                      ? 'bg-brand-100 dark:bg-brand-900 ml-auto' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  } rounded-lg p-3 max-w-[80%] ${
                    msg.sender === 'user' ? 'ml-auto' : ''
                  }`}
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {msg.message}
                  </p>
                </div>
              ))}
              
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    <div className="animate-pulse flex space-x-2">
                      <div className="h-2 w-2 bg-gray-400 rounded-full" />
                      <div className="h-2 w-2 bg-gray-400 rounded-full" />
                      <div className="h-2 w-2 bg-gray-400 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="flex space-x-2">
              <Input
                ref={chatInputRef}
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1"
                disabled={chatLoading}
              />
              <Button type="submit" size="icon" disabled={chatLoading}>
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          onClick={() => setChatOpen(true)}
          size="icon"
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
