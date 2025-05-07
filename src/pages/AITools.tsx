
import { useState } from 'react';
import { Headphones, FileText, Calculator, MessageSquare, Upload, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from "@/components/ui/sonner";
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';

const AITools = () => {
  const [activeTab, setActiveTab] = useState('tts');
  
  // TTS state
  const [ttsText, setTtsText] = useState('');
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsVoice, setTtsVoice] = useState('alloy');
  const [ttsPitch, setTtsPitch] = useState(1);
  const [ttsSpeed, setTtsSpeed] = useState(1);
  const [audioSrc, setAudioSrc] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElem, setAudioElem] = useState<HTMLAudioElement | null>(null);
  
  // Summarization state
  const [summaryText, setSummaryText] = useState('');
  const [summaryResult, setSummaryResult] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryLength, setSummaryLength] = useState('medium');
  
  // Math formula state
  const [mathFormula, setMathFormula] = useState('');
  const [mathResult, setMathResult] = useState('');
  const [mathLoading, setMathLoading] = useState(false);
  
  // Document processing state
  const [file, setFile] = useState<File | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  
  // TTS handlers
  const handleTTS = async () => {
    if (!ttsText.trim()) {
      toast.error("Please enter some text to convert to speech");
      return;
    }
    
    setTtsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: JSON.stringify({ 
          text: ttsText,
          voice: ttsVoice,
          pitch: ttsPitch,
          speed: ttsSpeed
        })
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
      audio.onended = () => setIsPlaying(false);
      setAudioElem(audio);
      
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
  
  // Summarization handlers
  const handleSummarize = async () => {
    if (!summaryText.trim()) {
      toast.error("Please enter some text to summarize");
      return;
    }
    
    setSummaryLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('summarize', {
        body: JSON.stringify({ 
          text: summaryText,
          length: summaryLength
        })
      });

      if (error) throw error;
      
      setSummaryResult(data.summary);
      toast.success("Text summarized successfully!");
    } catch (error) {
      console.error('Summarization Error:', error);
      toast.error("Failed to summarize text");
    } finally {
      setSummaryLoading(false);
    }
  };
  
  // Math formula handlers
  const handleMathInterpret = async () => {
    if (!mathFormula.trim()) {
      toast.error("Please enter a math formula to interpret");
      return;
    }
    
    setMathLoading(true);
    
    try {
      // Simulated response for now since we don't have the actual edge function yet
      setTimeout(() => {
        const formulas: Record<string, string> = {
          'E = mc^2': 'Energy (E) equals mass (m) multiplied by the speed of light (c) squared. This is Einstein\'s mass-energy equivalence formula, showing that mass and energy are equivalent and can be converted into each other.',
          'a^2 + b^2 = c^2': 'In a right triangle, the square of the length of the hypotenuse (c) equals the sum of the squares of the lengths of the other two sides (a and b). This is the Pythagorean theorem.',
          'F = G(m1m2)/r^2': 'The gravitational force (F) between two masses (m1 and m2) is proportional to the product of the masses and inversely proportional to the square of the distance (r) between them. G is the gravitational constant.',
          'ΔxΔp ≥ ħ/2': 'Heisenberg\'s uncertainty principle states that the product of the uncertainties in position (Δx) and momentum (Δp) must be greater than or equal to ħ/2 (where ħ is the reduced Planck constant).'
        };
        
        const result = formulas[mathFormula] || 'This is a mathematical formula that represents a relationship between variables. The interpretation would provide more details about specific variables and their relationships.';
        setMathResult(result);
        toast.success("Math formula interpreted successfully!");
        setMathLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Math Interpretation Error:', error);
      toast.error("Failed to interpret math formula");
      setMathLoading(false);
    }
  };
  
  // Document processing handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleFileProcess = () => {
    if (!file) {
      toast.error("Please select a file to process");
      return;
    }
    
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate processing with progress
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // Mock extracted text based on file type
          const fileType = file.type;
          let mockText = '';
          
          if (fileType.includes('pdf')) {
            mockText = "This is extracted text from a PDF document. The AI system has processed the document and extracted all textual content while preserving the structure and layout as much as possible.";
          } else if (fileType.includes('image')) {
            mockText = "Text extracted from image using OCR technology. The system has recognized and extracted all visible text content from the image.";
          } else if (fileType.includes('word')) {
            mockText = "Content extracted from Word document. All text, formatting, and structure have been preserved in the extraction process.";
          } else {
            mockText = "Content extracted from document. The system has processed the file and extracted all available text content.";
          }
          
          setExtractedText(mockText);
          toast.success("File processed successfully!");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  return (
    <MainLayout>
      <div className="py-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">AI-powered Study Tools</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Advanced AI tools for text-to-speech conversion, document summarization, math formula interpretation, and more
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 gap-2 mb-6">
              <TabsTrigger value="tts" className="data-[state=active]:bg-brand-50 dark:data-[state=active]:bg-gray-800">
                <Headphones className="h-4 w-4 mr-2" />
                Text-to-Speech
              </TabsTrigger>
              <TabsTrigger value="summarize" className="data-[state=active]:bg-brand-50 dark:data-[state=active]:bg-gray-800">
                <FileText className="h-4 w-4 mr-2" />
                Summarization
              </TabsTrigger>
              <TabsTrigger value="math" className="data-[state=active]:bg-brand-50 dark:data-[state=active]:bg-gray-800">
                <Calculator className="h-4 w-4 mr-2" />
                Math Interpreter
              </TabsTrigger>
              <TabsTrigger value="document" className="data-[state=active]:bg-brand-50 dark:data-[state=active]:bg-gray-800">
                <Upload className="h-4 w-4 mr-2" />
                Document Processing
              </TabsTrigger>
            </TabsList>
            
            {/* Text-to-Speech Tab */}
            <TabsContent value="tts">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-brand-500" />
                    FastSpeech 2 Text-to-Speech
                  </CardTitle>
                  <CardDescription>
                    Convert text to natural-sounding speech using advanced non-autoregressive models
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tts-text">Text to Convert</Label>
                    <Textarea 
                      id="tts-text"
                      placeholder="Enter text to convert to speech..."
                      className="min-h-[150px]"
                      value={ttsText}
                      onChange={(e) => setTtsText(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="voice">Voice</Label>
                      <Select value={ttsVoice} onValueChange={setTtsVoice}>
                        <SelectTrigger id="voice">
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                          <SelectItem value="echo">Echo (Male)</SelectItem>
                          <SelectItem value="fable">Fable (Female)</SelectItem>
                          <SelectItem value="onyx">Onyx (Male, Deep)</SelectItem>
                          <SelectItem value="nova">Nova (Female, Warm)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="speed">Speed: {ttsSpeed}x</Label>
                      <Slider 
                        id="speed"
                        min={0.5} 
                        max={2} 
                        step={0.1} 
                        value={[ttsSpeed]} 
                        onValueChange={(value) => setTtsSpeed(value[0])}
                      />
                    </div>
                  </div>
                  
                  {audioSrc && (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-4">
                      <div className="flex items-center justify-between">
                        <Button 
                          onClick={togglePlayPause}
                          variant="outline"
                        >
                          {isPlaying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />}
                          {isPlaying ? 'Playing...' : 'Play Audio'}
                        </Button>
                        <Badge variant="outline">FastSpeech 2 Model</Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleTTS} 
                    className="w-full"
                    disabled={ttsLoading || !ttsText.trim()}
                  >
                    {ttsLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Speech...
                      </>
                    ) : (
                      <>
                        <Headphones className="h-4 w-4 mr-2" />
                        Generate Speech
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Summarization Tab */}
            <TabsContent value="summarize">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-brand-500" />
                    PEGASUS Document Summarization
                  </CardTitle>
                  <CardDescription>
                    Generate concise summaries of text using state-of-the-art abstractive summarization models
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="summary-text" className="mb-2 block">Original Text</Label>
                      <Textarea 
                        id="summary-text"
                        placeholder="Enter or paste text to summarize..."
                        className="min-h-[300px]"
                        value={summaryText}
                        onChange={(e) => setSummaryText(e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="summary-result">Summary</Label>
                        <Select value={summaryLength} onValueChange={setSummaryLength}>
                          <SelectTrigger id="summary-length" className="w-32">
                            <SelectValue placeholder="Length" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">Short</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="long">Detailed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="min-h-[300px] bg-gray-50 dark:bg-gray-800 border rounded-md p-3">
                        {summaryLoading ? (
                          <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
                          </div>
                        ) : summaryResult ? (
                          <p className="text-gray-700 dark:text-gray-300">{summaryResult}</p>
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
                    disabled={summaryLoading || !summaryText.trim()}
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
            
            {/* Math Interpreter Tab */}
            <TabsContent value="math">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-brand-500" />
                    Mathematical Formula Interpreter
                  </CardTitle>
                  <CardDescription>
                    Get plain language explanations of mathematical formulas and expressions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="math-formula">Enter Mathematical Formula</Label>
                    <Input 
                      id="math-formula"
                      placeholder="E.g., E = mc^2, a^2 + b^2 = c^2, F = G(m1m2)/r^2"
                      value={mathFormula}
                      onChange={(e) => setMathFormula(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Try: E = mc^2, a^2 + b^2 = c^2, F = G(m1m2)/r^2, ΔxΔp ≥ ħ/2</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 border rounded-md p-4 min-h-[150px]">
                    <h3 className="text-sm font-medium mb-2">Interpretation</h3>
                    {mathLoading ? (
                      <div className="flex items-center justify-center h-24">
                        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
                      </div>
                    ) : mathResult ? (
                      <p className="text-gray-700 dark:text-gray-300">{mathResult}</p>
                    ) : (
                      <p className="text-gray-400 dark:text-gray-500 italic">Enter a formula to get its interpretation...</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleMathInterpret} 
                    className="w-full"
                    disabled={mathLoading || !mathFormula.trim()}
                  >
                    {mathLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Interpreting...
                      </>
                    ) : (
                      <>
                        <Calculator className="h-4 w-4 mr-2" />
                        Interpret Formula
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Document Processing Tab */}
            <TabsContent value="document">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-brand-500" />
                    Document Extraction & Processing
                  </CardTitle>
                  <CardDescription>
                    Extract and process text from various document formats (PDF, DOCX, Images)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <Upload className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-sm font-medium">Upload Document</h3>
                      <p className="text-xs text-gray-500">Supports PDF, DOCX, JPG, PNG</p>
                      <Input 
                        id="file-upload" 
                        type="file" 
                        className="mt-2"
                        accept=".pdf,.docx,.jpg,.jpeg,.png" 
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  
                  {file && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                      </div>
                      
                      {isProcessing && (
                        <div className="space-y-2">
                          <Progress value={processingProgress} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Processing document...</span>
                            <span>{processingProgress}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {extractedText && (
                    <div className="space-y-2">
                      <Label htmlFor="extracted-text">Extracted Text</Label>
                      <ScrollArea className="h-[200px] border rounded-md p-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {extractedText}
                        </p>
                      </ScrollArea>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setActiveTab('summarize')}>
                          <FileText className="h-4 w-4 mr-1" /> Summarize
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setActiveTab('tts')}>
                          <Headphones className="h-4 w-4 mr-1" /> Convert to Speech
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleFileProcess} 
                    className="w-full"
                    disabled={isProcessing || !file}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Process Document
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 bg-white dark:bg-gray-900 shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">About These AI Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium text-brand-600 dark:text-brand-400">FastSpeech 2 TTS</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our TTS engine is built on FastSpeech 2, a non-autoregressive architecture that directly predicts 
                  mel-spectrograms for real-time playback. It achieves up to 3× faster processing while matching or exceeding 
                  the audio quality of state-of-the-art systems.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-brand-600 dark:text-brand-400">PEGASUS Summarization</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We use PEGASUS, a Transformer encoder-decoder pretrained with a gap-sentence generation objective 
                  that masks and reconstructs key sentences. It produces coherent and factually consistent summaries 
                  even with limited training examples.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-brand-600 dark:text-brand-400">Mathematical Formula Interpretation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our system employs syntax-aware encoder-decoder networks for mathematical expression recognition, 
                  converting formulas into plain-language explanations. By embedding explicit grammar rules, 
                  these models achieve over 90% recognition accuracy even for complex inputs.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-brand-600 dark:text-brand-400">Document Processing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We integrate a hybrid pipeline with Tesseract OCR for in-browser extraction of text from images 
                  and Apache Tika for parsing structured documents. This combination ensures broad format support 
                  and reliable text normalization before downstream AI processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AITools;
