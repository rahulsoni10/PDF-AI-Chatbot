import React, { useState, useRef, useEffect } from 'react';
import { Upload, Send } from 'lucide-react';
import { extractTextFromPDF, getAnswerFromAI } from './utils/pdfUtils';

interface Message {
  text: string;
  isBot: boolean;
}

function App() {
  const [pdfContent, setPdfContent] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const text = await extractTextFromPDF(buffer);
      setPdfContent(text);
      setMessages([
        {
          text: 'PDF uploaded successfully! You can now ask questions about its content.',
          isBot: true,
        },
      ]);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setMessages([
        { text: 'Error processing PDF. Please try again.', isBot: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !pdfContent) {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Please upload a PDF document first.',
          isBot: true,
        },
      ]);
      return;
    }

    // Add user message
    const userMessage = { text: question, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const answer = await getAnswerFromAI(pdfContent, question);
      setMessages((prev) => [
        ...prev,
        {
          text: answer,
          isBot: true,
        },
      ]);
    } catch (error) {
      console.error('Error getting answer:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I didn't understand your question. Do you want to connect with a live agent?",
          isBot: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-semibold text-gray-800">PDF Chatbot</h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Upload size={20} />
              {isLoading ? 'Processing...' : 'Upload PDF'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md h-[400px] mb-6 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  message.isBot ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    message.isBot ? 'bg-blue-100' : 'bg-gray-100'
                  }`}
                >
                  {message.isBot ? <Send size={20} /> : <Upload size={20} />}
                </div>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot ? 'bg-blue-100' : 'bg-gray-100'
                  }`}
                >
                  <p className="text-sm text-gray-800">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about the PDF..."
                disabled={isLoading || !pdfContent}
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !pdfContent || !question.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Send size={20} />
                {isLoading ? 'Processing...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;