
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, FileText, MessageSquare, Calculator, Headphones, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';

const Index = () => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-brand-500" />,
      title: 'Document Summarization',
      description: 'Instantly condense lengthy documents into clear, concise summaries.'
    },
    {
      icon: <Headphones className="h-8 w-8 text-brand-500" />,
      title: 'Text to Speech',
      description: 'Convert text to natural-sounding audio with customizable voices.'
    },
    {
      icon: <Calculator className="h-8 w-8 text-brand-500" />,
      title: 'Math Interpretation',
      description: 'Extract, solve, and explain mathematical concepts and equations.'
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-brand-500" />,
      title: 'AI Chatbot',
      description: 'Ask questions and get instant help related to your documents.'
    },
    {
      icon: <FileText className="h-8 w-8 text-brand-500" />,
      title: 'Multi-format Support',
      description: 'Process PDFs, DOCs, PPTs, images, and more in one place.'
    },
    {
      icon: <Sparkles className="h-8 w-8 text-brand-500" />,
      title: 'Study Tools',
      description: 'Create flashcards, quizzes, and study guides from your material.'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block">Learning made smarter</span>
                  <span className="block text-brand-500">with SpeakSmart AI</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0 md:mt-5 md:text-xl">
                  Transform how you study with AI-powered summarization, text-to-speech,
                  math interpretation, and intelligent document assistance.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => navigate('/upload')}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    >
                      Start Learning
                      <ArrowRight className={`ml-2 h-4 w-4 transition-transform ${isHovering ? 'translate-x-1' : ''}`} />
                    </Button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => navigate('/features')}
                    >
                      Explore Features
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-brand-50 dark:bg-gray-800 flex items-center justify-center">
            <div className="relative w-3/4 h-3/4">
              <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-brand-200 rounded-lg animate-float opacity-70"></div>
              <div className="absolute top-1/3 right-1/4 w-1/4 h-1/4 bg-brand-300 rounded-lg animate-float opacity-80" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-1/4 left-1/3 w-1/5 h-1/5 bg-brand-400 rounded-lg animate-float opacity-90" style={{ animationDelay: '1s' }}></div>
              <div className="absolute inset-1/4 bg-white dark:bg-gray-700 shadow-xl rounded-xl p-8 flex items-center justify-center">
                <Headphones className="h-20 w-20 text-brand-500 animate-pulse-light" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-brand-500 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Unlock Your Learning Potential
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Our AI-powered tools help you comprehend, listen, solve, and interact with your study materials.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 dark:bg-gray-800 rounded-lg px-6 pb-8 h-full transform transition duration-500 hover:scale-105 hover:shadow-lg">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-brand-500 rounded-md shadow-lg">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">{feature.title}</h3>
                      <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-500">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to transform your learning?</span>
            <span className="block text-brand-100">Start using SpeakSmart AI today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button 
                size="lg" 
                className="bg-white text-brand-600 hover:bg-brand-50 border-transparent"
                onClick={() => navigate('/upload')}
              >
                Get Started
              </Button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-white border-white hover:bg-brand-600"
                onClick={() => navigate('/features')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
