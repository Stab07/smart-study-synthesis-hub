
import { useState } from 'react';
import { Headphones, Loader2, Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { toast } from "@/components/ui/sonner";
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';

const TextToSpeech = () => {
  const [ttsText, setTtsText] = useState('');
  const [ttsLoading, setTtsLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [audioElem, setAudioElem] = useState<HTMLAudioElement | null>(null);
  
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
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioElem) {
      audioElem.volume = newVolume;
    }
  };
  
  return (
    <MainLayout>
      <div className="py-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Text to Speech Conversion</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Convert any text into natural-sounding speech with our advanced text-to-speech technology
            </p>
          </div>
          
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
        </div>
      </div>
    </MainLayout>
  );
};

export default TextToSpeech;
