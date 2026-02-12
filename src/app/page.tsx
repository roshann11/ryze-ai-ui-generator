'use client';

import { ChatPanel } from '@/components/chat/chatPannel';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { LivePreview } from '@/components/preview/LivePreview';

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <header className="bg-neutral-900 text-white px-6 py-4 border-b border-neutral-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">AI UI Generator</h1>
            <p className="text-sm text-neutral-400">Ryze AI Assignment - Deterministic Component System</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-neutral-400">
              <span className="font-medium text-neutral-300">Model:</span> Claude Sonnet 4
            </div>
            <div className="text-xs text-neutral-400">
              <span className="font-medium text-neutral-300">Components:</span> 8 Fixed
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout - 3 Panels */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat */}
        <div className="w-1/3 min-w-[350px]">
          <ChatPanel />
        </div>

        {/* Middle: Code Editor */}
        <div className="w-1/3 min-w-[350px] border-r border-neutral-200">
          <CodeEditor />
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1">
          <LivePreview />
        </div>
      </div>
    </div>
  );
}