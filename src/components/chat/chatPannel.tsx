'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Send, Loader2, Sparkles } from 'lucide-react';

export const ChatPanel: React.FC = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, addMessage, isGenerating, setIsGenerating, currentCode, setCurrentCode, setCurrentExplanation, addToHistory } = useAppStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
    });

    setIsGenerating(true);

    try {
      // Call API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userRequest: userMessage,
          existingCode: currentCode || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate UI');
      }

      const result = await response.json();
      
      if (result.success) {
        const { plan, code, explanation } = result.data;

        // Update state
        setCurrentCode(code.code);
        setCurrentExplanation(explanation);

        // Add to history
        addToHistory({
          id: `gen-${Date.now()}`,
          userPrompt: userMessage,
          plan,
          code,
          timestamp: Date.now(),
        });

        // Add assistant message
        addMessage({
          role: 'assistant',
          content: explanation,
          metadata: {
            planId: plan.id,
            codeId: code.id,
          },
        });
      }
    } catch (error) {
      console.error('Error:', error);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error generating the UI. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-neutral-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-neutral-900">AI Assistant</h2>
        </div>
        <p className="text-sm text-neutral-600 mt-1">
          Describe your UI in natural language
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Start a conversation
            </h3>
            <p className="text-sm text-neutral-600 max-w-sm mx-auto">
              Describe the UI you want to create, and I'll generate it for you using our component library.
            </p>
            <div className="mt-6 space-y-2 text-left max-w-sm mx-auto">
              <p className="text-xs text-neutral-500 font-medium">Try examples:</p>
              <button
                onClick={() => setInput('Create a login form with email and password inputs')}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-700 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                "Create a login form with email and password inputs"
              </button>
              <button
                onClick={() => setInput('Build a dashboard with a navbar, sidebar, and data table')}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-700 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                "Build a dashboard with a navbar, sidebar, and data table"
              </button>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-neutral-100 text-neutral-900 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Generating UI...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-neutral-200">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your UI..."
            disabled={isGenerating}
            className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100"
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};