
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Headphones, BookOpen, Upload, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="border-b bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Headphones className="h-8 w-8 text-brand-500" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">SpeakSmart AI</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                to="/" 
                className={`px-3 py-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'text-brand-500 dark:text-brand-400' 
                    : 'text-gray-500 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/upload" 
                className={`px-3 py-2 text-sm font-medium ${
                  isActive('/upload') 
                    ? 'text-brand-500 dark:text-brand-400' 
                    : 'text-gray-500 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400'
                }`}
              >
                Upload
              </Link>
              <div className="relative group">
                <Link 
                  to="/features"
                  className={`px-3 py-2 text-sm font-medium flex items-center ${
                    isActive('/features') 
                      ? 'text-brand-500 dark:text-brand-400' 
                      : 'text-gray-500 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400'
                  }`}
                >
                  Features <ChevronDown className="ml-1 h-4 w-4" />
                </Link>
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link to="/features/text-to-speech" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Text to Speech
                  </Link>
                  <Link to="/features/summarization" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Summarization
                  </Link>
                  <Link to="/features/math-interpretation" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Math Interpretation
                  </Link>
                  <Link to="/features/chatbot" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    AI Chatbot
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm">Sign In</Button>
            <Button size="sm">Sign Up</Button>
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-brand-500 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'text-brand-500 bg-gray-50' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/upload" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/upload') 
                  ? 'text-brand-500 bg-gray-50' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Upload
            </Link>
            <div className="px-3 py-2">
              <p className={`text-base font-medium ${
                isActive('/features') 
                  ? 'text-brand-500' 
                  : 'text-gray-700'
              }`}>
                Features
              </p>
              <div className="mt-2 pl-3 space-y-1">
                <Link 
                  to="/features/text-to-speech" 
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/features/text-to-speech') 
                      ? 'text-brand-500 bg-gray-50' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Text to Speech
                </Link>
                <Link 
                  to="/features/summarization" 
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/features/summarization') 
                      ? 'text-brand-500 bg-gray-50' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Summarization
                </Link>
                <Link 
                  to="/features/math-interpretation" 
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/features/math-interpretation') 
                      ? 'text-brand-500 bg-gray-50' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Math Interpretation
                </Link>
                <Link 
                  to="/features/chatbot" 
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/features/chatbot') 
                      ? 'text-brand-500 bg-gray-50' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  AI Chatbot
                </Link>
              </div>
            </div>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">Guest User</div>
                <div className="text-sm font-medium text-gray-500">Sign in to access your account</div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              <Button variant="outline" className="w-full justify-center" onClick={() => setIsOpen(false)}>
                Sign In
              </Button>
              <Button className="w-full justify-center mt-2" onClick={() => setIsOpen(false)}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
