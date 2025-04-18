
import { useState } from 'react';
import { MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/sonner";

type ChatMessage = {
  sender: 'user' | 'bot';
  message: string;
};

const Chatbot = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'bot', message: 'Hi there! I\'m your SpeakSmart AI assistant. How can I help you today?' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  
  // Handle sending a chat message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatMessage.trim()) return;
    
    // Add user message
    const userMsg = chatMessage.trim();
    const updatedMessages = [...chatMessages, { sender: 'user', message: userMsg }];
    setChatMessages(updatedMessages);
    setChatMessage('');
    setChatLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: JSON.stringify({ 
          messages: updatedMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.message
          })) 
        })
      });

      if (error) throw error;

      // Add the bot response to chat messages
      const botResponse = data.message;
      setChatMessages(prev => [...prev, { sender: 'bot', message: botResponse }]);
    } catch (error) {
      console.error('Chatbot Error:', error);
      toast.error("Failed to get chatbot response");
    } finally {
      setChatLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="py-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">AI Chatbot</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Ask questions and get instant answers from our intelligent AI assistant
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-brand-500" />
                AI Chatbot
              </CardTitle>
              <CardDescription>
                Ask questions and get instant answers from our intelligent AI assistant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg h-[400px] flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {chatMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.sender === 'user' 
                              ? 'bg-brand-100 text-gray-800 dark:bg-brand-900 dark:text-gray-100' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                    
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                          <Loader2 className="h-5 w-5 animate-spin text-brand-500" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={chatLoading}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={chatLoading}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Chatbot;
