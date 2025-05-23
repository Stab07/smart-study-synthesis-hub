
import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "@/components/ui/sonner";
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';

const Summarization = () => {
  const [originalText, setOriginalText] = useState('');
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  
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
  
  return (
    <MainLayout>
      <div className="py-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Text Summarization</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Extract key points from lengthy documents using our AI-powered summarization tool
            </p>
          </div>
          
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
        </div>
      </div>
    </MainLayout>
  );
};

export default Summarization;
