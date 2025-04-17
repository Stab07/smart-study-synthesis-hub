
import { Heart, Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">SpeakSmart AI</h3>
            <p className="mt-4 text-base text-gray-500">
              Educational AI tool helping students learn through summarization, text-to-speech, 
              math interpretation, and conversational assistance.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Features</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/features/text-to-speech" className="text-base text-gray-500 hover:text-brand-500">
                  Text to Speech
                </Link>
              </li>
              <li>
                <Link to="/features/summarization" className="text-base text-gray-500 hover:text-brand-500">
                  Document Summarization
                </Link>
              </li>
              <li>
                <Link to="/features/math-interpretation" className="text-base text-gray-500 hover:text-brand-500">
                  Math Interpretation
                </Link>
              </li>
              <li>
                <Link to="/features/chatbot" className="text-base text-gray-500 hover:text-brand-500">
                  AI Chatbot
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/privacy" className="text-base text-gray-500 hover:text-brand-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-500 hover:text-brand-500">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-500 hover:text-brand-500">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-500 flex items-center">
            &copy; {new Date().getFullYear()} SpeakSmart AI. Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for students.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
