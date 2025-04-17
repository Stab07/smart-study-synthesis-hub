
# SpeakSmart AI - Educational AI Tool

SpeakSmart AI is a comprehensive educational tool that helps students learn more effectively through AI-powered summarization, text-to-speech conversion, math interpretation, and conversational assistance.

## Features

- **Document Summarization**: Extract key points from lengthy documents
- **Text to Speech**: Convert text to natural-sounding audio
- **Math Interpretation**: Recognize and explain mathematical concepts
- **AI Chatbot**: Ask questions about your documents and get instant answers
- **Multi-format Support**: Process PDFs, DOCs, PPTs, images, and more

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone this repository
```
git clone https://github.com/yourusername/speaksmart-ai.git
cd speaksmart-ai
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Main application pages
- `/src/hooks` - Custom React hooks
- `/src/utils` - Utility functions and helpers

## Backend Integration

For full functionality, you'll need to integrate with:

1. **OpenAI/Hugging Face API** for summarization
2. **Mathpix API** or SymPy for math interpretation
3. **Coqui TTS** or Mozilla TTS for text-to-speech
4. **LangChain** or RAG for chatbot functionality

## Future Roadmap

- Flashcard generation
- Quiz mode
- Notes-to-slide converter
- Voice input for chatbot

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
