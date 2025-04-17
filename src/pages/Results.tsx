
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, MessageSquare, X, BookOpen, Calculator, Download, Share2, Clock, Bookmark, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import MainLayout from '@/components/layout/MainLayout';

const Results = () => {
  const { docId } = useParams<{ docId: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot', message: string }[]>([]);
  const [activeTab, setActiveTab] = useState('summary');
  const [isLoading, setIsLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Mock data
  const documentData = {
    title: "Introduction to Quantum Physics",
    originalText: `Quantum physics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science.

Classical physics, the description of physics that existed before the theory of relativity and quantum mechanics, describes many aspects of nature at an ordinary (macroscopic) scale, while quantum physics explains the aspects of nature at small (atomic and subatomic) scales, for which classical mechanics is insufficient.

Most theories in classical physics can be derived from quantum mechanics as an approximation valid at large (macroscopic) scale. Quantum mechanics is essential to understanding the behavior of systems at atomic length scales and smaller.

The photoelectric effect, the discovery that certain materials emit electrons when illuminated by light of a certain frequency, was one of the significant experimental findings that led to the development of quantum mechanics.

One of the central principles of quantum mechanics is the wave-particle duality. This principle states that all particles exhibit both wave and particle properties. A central conceptual paradox of quantum mechanics is that the particle and wave aspects of a quantum system cannot be observed simultaneously.

The Schrödinger equation is a linear partial differential equation that governs the wave function of a quantum-mechanical system. It is a key result in quantum mechanics, and its discovery was a significant landmark in the development of the subject.

The equation is named after Erwin Schrödinger, who postulated the equation in 1925, and published it in 1926. It forms the basis for the wave mechanics formulation of quantum mechanics.`,
    summary: "Quantum physics describes nature at atomic and subatomic scales where classical physics is insufficient. It's based on principles like wave-particle duality and is governed by the Schrödinger equation. Quantum mechanics led to fields like quantum chemistry and quantum information science. The photoelectric effect was a key finding that contributed to its development. While classical physics works at macroscopic scales, quantum mechanics is essential for understanding atomic-level behaviors.",
    mathContent: [
      {
        equation: "E = hν",
        explanation: "The energy (E) of a photon equals Planck's constant (h) multiplied by the frequency (ν) of the electromagnetic wave."
      },
      {
        equation: "ΔxΔp ≥ ħ/2",
        explanation: "Heisenberg's uncertainty principle states that the product of the uncertainties in position (Δx) and momentum (Δp) must be greater than or equal to ħ/2 (where ħ is the reduced Planck constant)."
      },
      {
        equation: "iħ ∂Ψ/∂t = ĤΨ",
        explanation: "The Schrödinger equation describes how the quantum state of a physical system changes over time, where Ψ is the wave function and Ĥ is the Hamiltonian operator."
      }
    ],
    keyTerms: ["Quantum mechanics", "Wave-particle duality", "Schrödinger equation", "Photoelectric effect", "Quantum states", "Superposition"]
  };

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Audio controls
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Chat functionality
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      // Add user message
      setChatMessages(prev => [...prev, { sender: 'user', message: chatMessage.trim() }]);
      
      // Simulate bot response
      setTimeout(() => {
        let botResponse = "I'm analyzing your question about quantum physics. ";
        
        if (chatMessage.toLowerCase().includes("wave") || chatMessage.toLowerCase().includes("particle")) {
          botResponse += "Wave-particle duality is a central concept in quantum mechanics, suggesting that every particle can be described as both a particle and a wave.";
        } else if (chatMessage.toLowerCase().includes("schrödinger") || chatMessage.toLowerCase().includes("schrodinger") || chatMessage.toLowerCase().includes("equation")) {
          botResponse += "The Schrödinger equation is a mathematical equation that describes how the quantum state of a physical system changes over time.";
        } else if (chatMessage.toLowerCase().includes("uncertainty") || chatMessage.toLowerCase().includes("heisenberg")) {
          botResponse += "Heisenberg's Uncertainty Principle states that we cannot simultaneously know the exact position and momentum of a particle.";
        } else {
          botResponse += "Quantum physics describes the behavior of matter and energy at the atomic and subatomic levels. Is there a specific aspect you'd like to learn more about?";
        }
        
        setChatMessages(prev => [...prev, { sender: 'bot', message: botResponse }]);
      }, 1000);
      
      // Clear input
      setChatMessage('');
    }
  };

  useEffect(() => {
    // Scroll to bottom of chat when new messages arrive
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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-brand-500 animate-spin" />
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Processing your document...</h2>
          <p className="mt-2 text-gray-500">This may take a moment</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{documentData.title}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Document ID: {docId}</p>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
              
              {/* Audio Player */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Audio Player</h2>
                <audio 
                  ref={audioRef}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Placeholder audio
                />
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(currentTime)}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(duration)}</span>
                  </div>
                  
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="w-full"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={toggleMute}
                        className="text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400"
                      >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </button>
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        className="w-20"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={skipBackward}
                        className="text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400"
                      >
                        <SkipBack className="h-6 w-6" />
                      </button>
                      <button 
                        onClick={handlePlayPause}
                        className="bg-brand-500 text-white rounded-full p-2 hover:bg-brand-600"
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </button>
                      <button 
                        onClick={skipForward}
                        className="text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400"
                      >
                        <SkipForward className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="flex items-center">
                      <Badge variant="outline" className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        1.0x
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content Tabs */}
              <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 w-full justify-start">
                  <TabsTrigger value="summary" className="data-[state=active]:bg-brand-50 dark:data-[state=active]:bg-gray-800">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="original" className="data-[state=active]:bg-brand-50 dark:data-[state=active]:bg-gray-800">
                    <FileText className="h-4 w-4 mr-2" />
                    Original Text
                  </TabsTrigger>
                  <TabsTrigger value="math" className="data-[state=active]:bg-brand-50 dark:data-[state=active]:bg-gray-800">
                    <Calculator className="h-4 w-4 mr-2" />
                    Math Content
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Document Summary</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {documentData.summary}
                  </p>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Key Terms</h4>
                    <div className="flex flex-wrap gap-2">
                      {documentData.keyTerms.map((term, index) => (
                        <Badge key={index} variant="secondary">{term}</Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="original" className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Original Document Text</h3>
                  <ScrollArea className="h-[400px] overflow-auto rounded-md border p-4 bg-white dark:bg-gray-900">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {documentData.originalText}
                    </p>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="math" className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Mathematical Content</h3>
                  <div className="space-y-6">
                    {documentData.mathContent.map((item, index) => (
                      <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
                        <div className="text-center py-2 text-lg font-medium text-brand-600 dark:text-brand-400">
                          {item.equation}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                          {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Chat widget */}
      <div className={`fixed bottom-6 right-6 z-50 ${chatOpen ? 'w-80 sm:w-96' : 'w-auto'}`}>
        {chatOpen ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col h-96">
            <div className="bg-brand-500 text-white px-4 py-3 flex justify-between items-center">
              <h3 className="text-sm font-medium">Document Assistant</h3>
              <button 
                onClick={() => setChatOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <ScrollArea ref={chatContainerRef} className="flex-1 p-4">
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Hi! I'm your document assistant. Ask me any questions about this content.
                  </p>
                </div>
                
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
              </div>
            </ScrollArea>
            
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-700 p-3">
              <div className="flex space-x-2">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask a question about the document..."
                  className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <Button type="submit" size="icon">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                    <path d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.16789 7.90002 9.32895 7.83099 9.44448 7.70896C9.56001 7.58693 9.62501 7.41666 9.62501 7.24002C9.62501 7.06338 9.56001 6.89311 9.44448 6.77108C9.32895 6.64905 9.16789 6.58002 9 6.58002H4.84553V7.10002Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <Button
            onClick={() => setChatOpen(true)}
            className="w-12 h-12 rounded-full shadow-lg"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        )}
      </div>
    </MainLayout>
  );
};

export default Results;
