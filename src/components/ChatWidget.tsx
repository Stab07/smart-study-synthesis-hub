
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Upload, BrainCircuit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/sonner";
import { Badge } from '@/components/ui/badge';

type ChatMessage = {
  sender: 'user' | 'bot';
  message: string;
};

export const ChatWidget = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'bot', message: "Hi there! I'm your AI assistant powered by advanced retrieval-augmented generation. How can I help you today?" }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentContext, setDocumentContext] = useState<string[]>([]);
  
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          })),
          context: documentContext.length > 0 ? documentContext : undefined
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

  // Handle document upload for context
  const handleDocumentUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocumentFile(file);
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate progress for now
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      try {
        // In a real implementation, we would upload the file to the server
        // and process it for RAG context
        setTimeout(() => {
          clearInterval(interval);
          setUploadProgress(100);
          
          // Mock extracted text based on file type
          const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
          let mockContext: string[] = [];
          
          if (['pdf', 'doc', 'docx'].includes(fileExtension)) {
            mockContext = [
              "This document contains information about quantum physics and its applications.",
              "Quantum physics describes nature at the atomic and subatomic scales.",
              "The uncertainty principle is a fundamental concept in quantum mechanics.",
              "Quantum entanglement is a physical phenomenon that occurs when particles interact."
            ];
          } else if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
            mockContext = [
              "The image shows a diagram of atomic structure.",
              "There are labels pointing to electron orbitals.",
              "The legend indicates energy levels."
            ];
          } else {
            mockContext = [
              "This document contains textual information relevant to your query.",
              "Key concepts and terms have been extracted for context."
            ];
          }
          
          setDocumentContext(mockContext);
          
          // Add a system message about the context
          setChatMessages(prev => [
            ...prev, 
            { 
              sender: 'bot', 
              message: `I've analyzed your document "${file.name}" and extracted key information. I'll use this context to provide more relevant answers. What would you like to know about it?` 
            }
          ]);
          
          setIsUploading(false);
          toast.success(`Document "${file.name}" processed successfully`);
        }, 3000);
        
      } catch (error) {
        console.error("Error uploading document:", error);
        toast.error("Failed to process document");
        setIsUploading(false);
      }
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
            <div className="flex items-center space-x-2">
              <BrainCircuit className="h-4 w-4" />
              <h3 className="text-sm font-medium">RAG-enhanced AI Assistant</h3>
            </div>
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
          
          {isUploading && (
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Loader2 className="h-3 w-3 animate-spin" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span>Processing {documentFile?.name}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-brand-500 h-1.5 rounded-full transition-all" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 space-y-2">
            {documentContext.length > 0 && (
              <div className="flex items-center space-x-2 px-2">
                <Badge variant="outline" className="text-xs">
                  <Upload className="h-3 w-3 mr-1" />
                  Context: {documentFile?.name}
                </Badge>
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                ref={chatInputRef}
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1"
                disabled={chatLoading}
              />
              <Button type="button" size="icon" variant="outline" onClick={handleDocumentUpload} disabled={isUploading}>
                <Upload className="h-4 w-4" />
              </Button>
              <Button type="submit" size="icon" disabled={chatLoading}>
                <MessageSquare className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </form>
          </div>
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
