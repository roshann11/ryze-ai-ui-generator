'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Eye, AlertCircle, RotateCcw } from 'lucide-react';

// Import all UI components for the preview
import * as UIComponents from '@/components/ui';

export const LivePreview: React.FC = () => {
  const { currentCode, history, rollbackToVersion } = useAppStore();
  const [PreviewComponent, setPreviewComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentCode) {
      setPreviewComponent(null);
      setError(null);
      return;
    }

    try {
      // Transform code for preview rendering
      // Remove import statements and export default
      let transformedCode = currentCode
        .replace(/import.*from.*['"@/components/ui]['"];?\n?/g, '')
        .replace(/import\s+React.*from.*['"]react['"];?\n?/g, '')
        .replace(/import.*useState.*from.*['"]react['"];?\n?/g, '')
        .replace(/export default function/g, 'return function')
        .replace(/export default/g, 'return');

      // Create a function that returns the component
      const componentFunction = new Function(
        'React',
        'useState',
        'useEffect',
        ...Object.keys(UIComponents),
        transformedCode
      );

      // Execute with dependencies
      const Component = componentFunction(
        React,
        useState,
        useEffect,
        ...Object.values(UIComponents)
      );

      setPreviewComponent(() => Component);
      setError(null);
    } catch (err) {
      console.error('Preview error:', err);
      setError(err instanceof Error ? err.message : 'Failed to render preview');
      setPreviewComponent(null);
    }
  }, [currentCode]);

  return (
    <div className="flex flex-col h-full bg-neutral-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-neutral-700" />
            <h2 className="text-lg font-semibold text-neutral-900">Live Preview</h2>
          </div>
          
          {/* Version History */}
          {history.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600">Version:</span>
              <select
                onChange={(e) => rollbackToVersion(e.target.value)}
                className="px-3 py-1 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Latest</option>
                {history.map((gen, index) => (
                  <option key={gen.id} value={gen.id}>
                    v{history.length - index} - {new Date(gen.timestamp).toLocaleTimeString()}
                  </option>
                ))}
              </select>
              <button
                onClick={() => window.location.reload()}
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Refresh preview"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-6">
        {error ? (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-900">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Preview Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        ) : PreviewComponent ? (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 min-h-[400px]">
            <PreviewComponent />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-400">
            <div className="text-center">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No preview available</p>
              <p className="text-xs mt-2">Generate UI to see live preview</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};