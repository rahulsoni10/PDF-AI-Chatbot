import React from 'react';
import { MessageCircle, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export function ChatMessage({ message, isBot }: ChatMessageProps) {
  return (
    <div className={`flex items-start gap-2 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`p-2 rounded-full ${isBot ? 'bg-blue-100' : 'bg-gray-100'}`}>
        {isBot ? <MessageCircle size={20} /> : <User size={20} />}
      </div>
      <div className={`max-w-[80%] p-3 rounded-lg ${
        isBot ? 'bg-blue-100' : 'bg-gray-100'
      }`}>
        <p className="text-sm text-gray-800">{message}</p>
      </div>
    </div>
  );
}