import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from './ui';
import type { ChatMessage } from '../types';

interface ChatbotProps {
  className?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Hello! I\'m your Property Management Assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date().toISOString(),
      type: 'text',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    'Show property status',
    'Check maintenance requests',
    'View recent payments',
    'Schedule an inspection',
    'Add new tenant',
    'Generate report',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      isUser: true,
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): ChatMessage => {
    const input = userInput.toLowerCase();
    let response = '';

    if (input.includes('property') || input.includes('properties')) {
      response = 'I can help you with property management! You currently have 3 properties in your portfolio. Would you like to see a summary or specific details about any property?';
    } else if (input.includes('maintenance')) {
      response = 'You have 3 pending maintenance requests: 1 leaky faucet (medium priority), 1 AC issue (high priority), and 1 broken window (urgent). Would you like me to show you the details?';
    } else if (input.includes('tenant') || input.includes('tenants')) {
      response = 'You currently have 1 active tenant. I can help you add new tenants, view tenant information, or manage lease agreements. What would you like to do?';
    } else if (input.includes('payment') || input.includes('rent')) {
      response = 'Your recent payment summary shows 1 completed payment of $2,800 and 1 pending payment of $2,800. Would you like to see more details or generate a payment report?';
    } else if (input.includes('report') || input.includes('analytics')) {
      response = 'I can generate various reports for you: Revenue reports, Occupancy reports, Maintenance reports, or Custom analytics. Which type would you prefer?';
    } else if (input.includes('hello') || input.includes('hi')) {
      response = 'Hello! I\'m here to help you manage your properties efficiently. You can ask me about properties, tenants, maintenance requests, payments, or generate reports. What would you like to know?';
    } else {
      response = 'I understand you\'re asking about property management. I can help you with properties, tenants, maintenance requests, payments, and reports. Could you please be more specific about what you need?';
    }

    return {
      id: Date.now().toString(),
      message: response,
      isUser: false,
      timestamp: new Date().toISOString(),
      type: 'text',
    };
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="bg-emerald-800 text-white p-4 rounded-full shadow-lg hover:bg-emerald-900 transition-colors duration-200"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg shadow-2xl border border-gray-200 w-80 h-96 flex flex-col mb-4"
          >
            <div className="bg-emerald-800 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot size={20} />
                <span className="font-medium">Property Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        message.isUser
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {message.isUser ? <User size={12} /> : <Bot size={12} />}
                    </div>
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        message.isUser
                          ? 'bg-emerald-800 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.message}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">
                      <Bot size={12} />
                    </div>
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
                <div className="space-y-1">
                  {quickActions.slice(0, 3).map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      className="w-full text-left text-xs p-2 bg-gray-50 hover:bg-gray-100 rounded text-gray-700 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  size="sm"
                  className="!p-2"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;