
import { useState } from 'react';
import { Headphones, Loader2, Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { toast } from "@/components/ui/sonner";
import MainLayout from '@/components/layout/MainLayout';

const TextToSpeech = () => {
  const [ttsText, setTtsText] = useState('');
  const [ttsLoading, setTtsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  
  // Handle TTS conversion
  const handleTextToSpeech = () => {
    if (!ttsText.trim()) {
      toast("Please enter some text to convert to speech");
      return;
    }
    
    setTtsLoading(true);
    
    // Simulate API call for demo purposes
    setTimeout(() => {
      setTtsLoading(false);
      toast.success("Text converted to speech successfully!");
      // In a real implementation, you would get an audio URL from your API
      // and set it to the audio element's src
      setIsPlaying(true);
    }, 2000);
  };
  
  // Handle audio playback controls
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
              
              {/* Audio Player (shows after conversion) */}
              {isPlaying && (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(currentTime)}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(duration)}</span>
                    </div>
                    
                    <Slider
                      value={[currentTime]}
                      max={duration}
                      step={0.1}
                      onValueChange={handleSeek}
                      className="w-full"
                    />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        <Slider
                          value={[volume]}
                          max={1}
                          step={0.01}
                          onValueChange={handleVolumeChange}
                          className="w-20"
                        />
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full p-2"
                        onClick={handlePlayPause}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      
                      <div className="flex items-center">
                        <Badge variant="outline" className="flex items-center">
                          1.0x
                        </Badge>
                      </div>
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
