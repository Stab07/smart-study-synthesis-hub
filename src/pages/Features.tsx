
import { ArrowRight, BookOpen, FileText, MessageSquare, Calculator, Headphones, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      icon: <FileText className="h-10 w-10 text-brand-500" />,
      title: 'Document Summarization',
      description: 'Instantly condense lengthy documents into clear, concise summaries that capture the key points and main ideas.',
      link: '/features/summarization'
    },
    {
      icon: <Headphones className="h-10 w-10 text-brand-500" />,
      title: 'Text to Speech',
      description: 'Convert any text to natural-sounding speech with customizable voices, speeds, and languages.',
      link: '/features/text-to-speech'
    },
    {
      icon: <Calculator className="h-10 w-10 text-brand-500" />,
      title: 'Math Interpretation',
      description: 'Extract, solve, and explain mathematical concepts and equations found in your documents.',
      link: '/features/math-interpretation'
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-brand-500" />,
      title: 'AI Chatbot',
      description: 'Ask questions about your documents and get instant, contextual answers from our intelligent assistant.',
      link: '/features/chatbot'
    },
    {
      icon: <BookOpen className="h-10 w-10 text-brand-500" />,
      title: 'Multi-format Support',
      description: 'Process PDFs, DOCs, PPTs, images, and more in one place with our universal document handling.',
      link: '/upload'
    },
    {
      icon: <Sparkles className="h-10 w-10 text-brand-500" />,
      title: 'All Features Combined',
      description: 'Experience all our AI tools in one integrated interface with a helpful AI assistant sidebar.',
      link: '/features/integrated'
    }
  ];

  return (
    <MainLayout>
      <div className="py-12 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">SpeakSmart AI Features</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover our powerful AI tools designed to enhance your learning experience
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-brand-100 dark:bg-brand-900 p-4 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-center">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {feature.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild className="w-full">
                    <Link to={feature.link} className="flex items-center justify-center">
                      Explore <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Features;
