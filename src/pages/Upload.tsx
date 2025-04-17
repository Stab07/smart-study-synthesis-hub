
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, FileType, CheckCircle, X, FilePlus, File, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import MainLayout from '@/components/layout/MainLayout';

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [activeTab, setActiveTab] = useState('file');

  const acceptedFileTypes = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'text/plain'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      const validFiles = fileList.filter(file => acceptedFileTypes.includes(file.type));
      
      if (validFiles.length !== fileList.length) {
        toast({
          title: "Invalid file type",
          description: "Only PDF, DOC, DOCX, PPT, PPTX, JPG, PNG and TXT files are supported.",
          variant: "destructive"
        });
      }
      
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const fileList = Array.from(e.dataTransfer.files);
      const validFiles = fileList.filter(file => acceptedFileTypes.includes(file.type));
      
      if (validFiles.length !== fileList.length) {
        toast({
          title: "Invalid file type",
          description: "Only PDF, DOC, DOCX, PPT, PPTX, JPG, PNG and TXT files are supported.",
          variant: "destructive"
        });
      }
      
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const simulateUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          
          // This would typically be where you'd navigate to results with the document ID
          navigate('/results/demo-123');
          
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'file' && files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    if (activeTab === 'url' && !urlInput) {
      toast({
        title: "No URL provided",
        description: "Please enter a valid URL to a document.",
        variant: "destructive"
      });
      return;
    }
    
    if (activeTab === 'text' && !textInput) {
      toast({
        title: "No text provided",
        description: "Please enter some text to process.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Processing started",
      description: activeTab === 'file' ? 
        `Processing ${files.length} file(s)` : 
        activeTab === 'url' ? 
          "Processing document from URL" : 
          "Processing text input"
    });
    
    simulateUpload();
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <File className="h-5 w-5 text-red-500" />;
    if (type.includes('word')) return <File className="h-5 w-5 text-blue-500" />;
    if (type.includes('presentation')) return <File className="h-5 w-5 text-orange-500" />;
    if (type.includes('image')) return <File className="h-5 w-5 text-purple-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  return (
    <MainLayout>
      <div className="py-10 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Upload Your Study Materials
            </h1>
            <p className="mt-3 text-xl text-gray-500 dark:text-gray-300">
              Upload your documents to summarize, convert to speech, interpret math, and chat with AI
            </p>
          </div>

          <div className="mt-12 bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden">
            <Tabs defaultValue="file" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="file" className="data-[state=active]:bg-brand-50 dark:data-[state=active]:bg-gray-800">
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="url" className="data-[state=active]:bg-brand-50 dark:data-[state=active]:bg-gray-800">
                  URL
                </TabsTrigger>
                <TabsTrigger value="text" className="data-[state=active]:bg-brand-50 dark:data-[state=active]:bg-gray-800">
                  Text Input
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="file" className="p-6">
                <form onSubmit={handleSubmit}>
                  <div 
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-brand-500 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
                    />
                    <FileUp className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Drag and drop your files here, or <span className="text-brand-500">browse</span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Supports PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, TXT
                    </p>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Files</h3>
                      <ul className="mt-3 divide-y divide-gray-200 dark:divide-gray-700">
                        {files.map((file, index) => (
                          <li key={index} className="py-3 flex items-center justify-between">
                            <div className="flex items-center">
                              {getFileIcon(file.type)}
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate">
                                {file.name}
                              </span>
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                ({(file.size / 1024).toFixed(2)} KB)
                              </span>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeFile(index)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={uploading || files.length === 0}
                    >
                      {uploading ? 'Processing...' : 'Process Files'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="url" className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Document URL
                    </label>
                    <input
                      type="url"
                      id="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/document.pdf"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 shadow-sm focus:border-brand-500 focus:ring focus:ring-brand-500 focus:ring-opacity-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Enter the URL of a PDF, DOC, DOCX, or web page
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={uploading || !urlInput}
                  >
                    {uploading ? 'Processing...' : 'Process URL'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="text" className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Text to Process
                    </label>
                    <textarea
                      id="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      rows={8}
                      placeholder="Paste or type the text you want to process..."
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 shadow-sm focus:border-brand-500 focus:ring focus:ring-brand-500 focus:ring-opacity-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={uploading || !textInput}
                  >
                    {uploading ? 'Processing...' : 'Process Text'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            {uploading && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Processing...</p>
                <Progress value={uploadProgress} className="h-2" />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Analyzing document</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{uploadProgress}%</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">AI Analysis</span> - We'll analyze your document and extract the key content
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Summarization</span> - Create a concise summary of the content
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Speech Generation</span> - Convert the text to natural-sounding speech
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Math Processing</span> - Recognize and explain mathematical content
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Upload;
