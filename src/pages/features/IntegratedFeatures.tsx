
import { useState, useRef } from 'react';
import { MessageSquare, Headphones, FileText, ArrowRight, Loader2, Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import MainLayout from '@/components/layout/MainLayout';
import { toast } from "@/components/ui/sonner";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar';
import { supabase } from '@/integrations/supabase/client';

type ChatMessage = {
  sender: 'user' | 'bot';
  message: string;
};

const IntegratedFeatures = () => {
  const [activeTab, setActiveTab] = useState('tts');
  
  // Text-to-speech state
  const [ttsText, setTtsText] = useState('');
  const [ttsLoading, setTtsLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [audioElem, setAudioElem] = useState<HTMLAudioElement | null>(null);
  
  // Summarization state
  const [originalText, setOriginalText] = useState('');
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  
  // Chatbot state
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'bot', message: 'Hi there! I\'m your SpeakSmart AI assistant. How can I help you today?' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  
  // Handle TTS conversion
  const handleTextToSpeech = async () => {
    if (!ttsText.trim()) {
      toast("Please enter some text to convert to speech");
      return;
    }
    
    setTtsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: JSON.stringify({ text: ttsText, voice: 'alloy' })
      });

      if (error) throw error;

      // Create audio from base64
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], 
        { type: 'audio/mp3' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      
      setAudioSrc(audioUrl);
      
      // Create and play audio element
      const audio = new Audio(audioUrl);
      audio.volume = volume;
      setAudioElem(audio);
      
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
      
      toast.success("Text converted to speech successfully!");
    } catch (error) {
      console.error('Text to Speech Error:', error);
      toast.error("Failed to convert text to speech");
    } finally {
      setTtsLoading(false);
    }
  };
  
  // Toggle play/pause for TTS audio
  const togglePlayPause = () => {
    if (!audioElem) return;
    
    if (isPlaying) {
      audioElem.pause();
      setIsPlaying(false);
    } else {
      audioElem.play();
      setIsPlaying(true);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioElem) {
      audioElem.volume = newVolume;
    }
  };
  
  // Handle text summarization
  const handleSummarize = async () => {
    if (!originalText.trim()) {
      toast("Please enter some text to summarize");
      return;
    }
    
    setSummaryLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('summarize', {
        body: JSON.stringify({ text: originalText })
      });

      if (error) throw error;

      if (data.summary) {
        setSummary(data.summary);
        toast.success("Text summarized successfully!");
      } else {
        throw new Error("No summary received from API");
      }
    } catch (error) {
      console.error('Summarization Error:', error);
      toast.error("Failed to summarize text");
    } finally {
      setSummaryLoading(false);
    }
  };
  
  // Handle sending a chat message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatMessage.trim()) return;
    
    // Add user message
    const userMsg = chatMessage.trim();
    const updatedMessages = [...chatMessages, { sender: 'user' as const, message: userMsg }];
    setChatMessages(updatedMessages);
    setChatMessage('');
    setChatLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: JSON.stringify({ 
          messages: updatedMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.message
          })),
          context: activeTab === 'tts' ? ttsText : originalText // Context based on active tab
        })
      });

      if (error) throw error;

      // Add the bot response to chat messages
      const botResponse = data.message;
      setChatMessages(prev => [...prev, { sender: 'bot' as const, message: botResponse }]);
    } catch (error) {
      console.error('Chatbot Error:', error);
      toast.error("Failed to get chatbot response");
    } finally {
      setChatLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-800 min-h-screen">
        <SidebarProvider defaultOpen={true}>
          <div className="flex w-full min-h-[calc(100vh-4rem)]">
            <Sidebar>
              <SidebarHeader>
                <div className="flex items-center gap-2 px-2">
                  <MessageSquare className="h-5 w-5 text-brand-500" />
                  <h3 className="text-lg font-semibold">AI Assistant</h3>
                </div>
              </SidebarHeader>
              
              <SidebarContent>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {chatMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[90%] rounded-lg p-3 ${
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
              </SidebarContent>
              
              <SidebarFooter>
                <form onSubmit={handleSendMessage} className="p-2 flex gap-2">
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
              </SidebarFooter>
            </Sidebar>
            
            <SidebarInset>
              <div className="p-6">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    SpeakSmart AI Tools
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Use our powerful AI tools to enhance your learning experience
                  </p>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
                  <TabsList className="grid grid-cols-2 mb-8">
                    <TabsTrigger value="tts">
                      <Headphones className="h-4 w-4 mr-2" />
                      Text to Speech
                    </TabsTrigger>
                    <TabsTrigger value="summarization">
                      <FileText className="h-4 w-4 mr-2" />
                      Summarization
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Text to Speech Content */}
                  <TabsContent value="tts" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Headphones className="h-5 w-5 text-brand-500" />
                          Text to Speech Conversion
                        </CardTitle>
                        <CardDescription>
                          Convert any text into natural-sounding speech with our advanced text-to-speech technology.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Textarea 
                          placeholder="Enter text to convert to speech..."
                          className="min-h-[200px]"
                          value={ttsText}
                          onChange={(e) => setTtsText(e.target.value)}
                        />
                        
                        {audioSrc && (
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-4">
                            <div className="flex items-center justify-between">
                              <Button 
                                onClick={togglePlayPause}
                                variant="outline"
                              >
                                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                              </Button>
                              <div className="flex items-center space-x-2">
                                <Volume2 className="h-4 w-4" />
                                <Slider
                                  value={[volume]}
                                  max={1}
                                  step={0.01}
                                  onValueChange={handleVolumeChange}
                                  className="w-20"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          onClick={handleTextToSpeech} 
                          className="w-full"
                          disabled={ttsLoading || !ttsText.trim()}
                        >
                          {ttsLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Converting...
                            </>
                          ) : (
                            <>
                              <Headphones className="h-4 w-4 mr-2" />
                              Convert to Speech
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  {/* Summarization Content */}
                  <TabsContent value="summarization" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-brand-500" />
                          Text Summarization
                        </CardTitle>
                        <CardDescription>
                          Extract key points from lengthy documents using our AI-powered summarization tool.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium mb-2">Original Text</h3>
                            <Textarea 
                              placeholder="Enter or paste text to summarize..."
                              className="min-h-[300px]"
                              value={originalText}
                              onChange={(e) => setOriginalText(e.target.value)}
                            />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-2">Summary</h3>
                            <div className="min-h-[300px] bg-gray-50 dark:bg-gray-800 border rounded-md p-3">
                              {summaryLoading ? (
                                <div className="flex items-center justify-center h-full">
                                  <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
                                </div>
                              ) : summary ? (
                                <p className="text-gray-700 dark:text-gray-300">{summary}</p>
                              ) : (
                                <p className="text-gray-400 dark:text-gray-500 italic">Your summary will appear here...</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          onClick={handleSummarize} 
                          className="w-full"
                          disabled={summaryLoading || !originalText.trim()}
                        >
                          {summaryLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Summarizing...
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4 mr-2" />
                              Summarize Text
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </MainLayout>
  );
};

export default IntegratedFeatures;
