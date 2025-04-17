
import { useState } from 'react';
import { MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import MainLayout from '@/components/layout/MainLayout';

const Chatbot = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot', message: string }[]>([
    { sender: 'bot', message: 'Hi there! I\'m your SpeakSmart AI assistant. How can I help you today?' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  
  // Handle sending a chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatMessage.trim()) return;
    
    // Add user message
    const userMsg = chatMessage.trim();
    setChatMessages(prev => [...prev, { sender: 'user', message: userMsg }]);
    setChatMessage('');
    setChatLoading(true);
    
    // Simulate API call for demo purposes
    setTimeout(() => {
      let response = "";
      
      if (userMsg.toLowerCase().includes('summarize') || userMsg.toLowerCase().includes('summary')) {
        response = "I can help summarize your documents! Simply upload a document or paste text, and I'll create a concise summary highlighting the key points.";
      } else if (userMsg.toLowerCase().includes('speak') || userMsg.toLowerCase().includes('audio') || userMsg.toLowerCase().includes('voice')) {
        response = "With SpeakSmart AI, you can convert any text to natural-sounding speech. Perfect for listening to documents on the go!";
      } else if (userMsg.toLowerCase().includes('math') || userMsg.toLowerCase().includes('equation')) {
        response = "SpeakSmart AI can recognize and explain mathematical concepts in your documents. It identifies equations and provides step-by-step explanations.";
      } else {
        response = "Thanks for your message! SpeakSmart AI helps students learn more effectively through AI-powered summarization, text-to-speech conversion, math interpretation, and conversational assistance. How can I assist you today?";
      }
      
      setChatMessages(prev => [...prev, { sender: 'bot', message: response }]);
      setChatLoading(false);
    }, 1500);
  };
  
  return (
    <MainLayout>
      <div className="py-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">AI Chatbot</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Ask questions about your documents and get instant answers from our intelligent AI assistant
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-brand-500" />
                AI Chatbot
              </CardTitle>
              <CardDescription>
                Ask questions about your documents and get instant answers from our intelligent AI assistant.
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
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-0"></div>
                            <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-150"></div>
                            <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-300"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask a question about your document..."
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
