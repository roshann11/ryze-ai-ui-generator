import { create } from 'zustand';
import { ChatMessage, GenerationHistory } from '@/types';

interface AppState {
  // Chat state
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;

  // Generation state
  currentCode: string;
  setCurrentCode: (code: string) => void;
  
  // History for rollback
  history: GenerationHistory[];
  addToHistory: (generation: GenerationHistory) => void;
  rollbackToVersion: (id: string) => void;

  // UI state
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  
  currentExplanation: string;
  setCurrentExplanation: (explanation: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Chat state
  messages: [],
  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },
  clearMessages: () => set({ messages: [] }),

  // Generation state
  currentCode: '',
  setCurrentCode: (code) => set({ currentCode: code }),

  // History
  history: [],
  addToHistory: (generation) => {
    set((state) => ({
      history: [...state.history, generation],
    }));
  },
  rollbackToVersion: (id) => {
    const generation = get().history.find((h) => h.id === id);
    if (generation) {
      set({
        currentCode: generation.code.code,
        currentExplanation: generation.code.explanation,
      });
    }
  },

  // UI state
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  
  currentExplanation: '',
  setCurrentExplanation: (explanation) => set({ currentExplanation: explanation }),
}));