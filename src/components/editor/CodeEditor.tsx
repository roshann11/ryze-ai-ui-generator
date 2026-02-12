'use client';

import React from 'react';
import Editor from '@monaco-editor/react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Code2, Copy, Check } from 'lucide-react';

export const CodeEditor: React.FC = () => {
  const { currentCode, setCurrentCode } = useAppStore();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-neutral-400" />
          <h2 className="text-lg font-semibold text-white">Generated Code</h2>
        </div>
        <button
          onClick={handleCopy}
          disabled={!currentCode}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1">
        {currentCode ? (
          <Editor
            height="100%"
            defaultLanguage="typescript"
            value={currentCode}
            onChange={(value) => setCurrentCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500">
            <div className="text-center">
              <Code2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No code generated yet</p>
              <p className="text-xs mt-2">Start a conversation to generate UI code</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};