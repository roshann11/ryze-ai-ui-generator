'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Eye, RotateCcw, Loader2 } from 'lucide-react';

export const LivePreview: React.FC = () => {
  const { currentCode, history, rollbackToVersion } = useAppStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentCode || !iframeRef.current) return;

    setIsLoading(true);
    
    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) {
      setIsLoading(false);
      return;
    }

    
    const cleanCode = currentCode
      .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '')
      .replace(/export\s+default\s+/g, '');

    
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useEffect } = React;
    
    // UI Components Library
    const Button = ({ variant = 'primary', size = 'md', children, onClick, fullWidth, disabled }) => {
      const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
        ghost: 'text-blue-600 hover:bg-blue-50'
      };
      const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3 text-lg' };
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className={\`\${variants[variant]} \${sizes[size]} \${fullWidth ? 'w-full' : ''} font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500\`}
        >
          {children}
        </button>
      );
    };

    const Card = ({ title, description, children, padding = 'md', variant = 'default' }) => {
      const paddings = { sm: 'p-4', md: 'p-6', lg: 'p-8' };
      const variants = {
        default: 'bg-white border border-gray-200',
        bordered: 'bg-white border-2 border-gray-300',
        elevated: 'bg-white shadow-lg'
      };
      return (
        <div className={\`rounded-lg \${variants[variant]} \${paddings[padding]}\`}>
          {title && <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>}
          {description && <p className="text-gray-600 mb-4">{description}</p>}
          <div>{children}</div>
        </div>
      );
    };

    const Input = ({ label, type = 'text', placeholder, value, onChange, fullWidth, error, disabled }) => (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={\`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors \${fullWidth ? 'w-full' : ''} \${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} disabled:bg-gray-100 disabled:cursor-not-allowed\`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );

    const Table = ({ columns, data, striped, hoverable }) => (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, i) => (
              <tr key={i} className={\`\${striped && i % 2 ? 'bg-gray-50' : 'bg-white'} \${hoverable ? 'hover:bg-gray-100' : ''} transition-colors\`}>
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    const Modal = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
      useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
      }, [isOpen]);

      if (!isOpen) return null;

      const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
      
      return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className={\`relative bg-white rounded-lg shadow-xl \${sizes[size]} w-full\`}>
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">{children}</div>
              {footer && (
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                  {footer}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

    const Sidebar = ({ children, width = 'md', position = 'left', isOpen = true }) => {
      const widths = { sm: 'w-64', md: 'w-80', lg: 'w-96' };
      const positionStyles = position === 'left' ? 'left-0' : 'right-0';
      if (!isOpen) return null;
      return (
        <aside className={\`fixed top-0 \${positionStyles} h-full bg-white border-r border-gray-200 \${widths[width]} overflow-y-auto\`}>
          <div className="p-6">{children}</div>
        </aside>
      );
    };

    const Navbar = ({ brand, children, variant = 'light' }) => {
      const variants = {
        light: 'bg-white border-b border-gray-200 text-gray-900',
        dark: 'bg-gray-900 text-white'
      };
      return (
        <nav className={\`px-6 py-4 \${variants[variant]}\`}>
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {brand && <div className="text-xl font-bold">{brand}</div>}
            <div className="flex items-center gap-4">{children}</div>
          </div>
        </nav>
      );
    };

    const Chart = ({ type, data, title, height = 300 }) => {
      const maxValue = Math.max(...data.map(d => d.value));

      const renderBarChart = () => (
        <div className="flex items-end justify-around h-full gap-2 px-4">
          {data.map((point, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                style={{ height: \`\${(point.value / maxValue) * 100}%\` }}
              />
              <span className="text-xs text-gray-600 text-center">{point.label}</span>
            </div>
          ))}
        </div>
      );

      return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
          <div style={{ height: \`\${height}px\` }}>
            {type === 'bar' && renderBarChart()}
          </div>
        </div>
      );
    };

    // User's Generated Component
    ${cleanCode}

    // Render
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<GeneratedUI />);

    // Signal loaded
    window.parent.postMessage({ type: 'preview-loaded' }, '*');
  </script>
</body>
</html>`;

    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();

    // Listen for load complete
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'preview-loaded') {
        setIsLoading(false);
      }
    };
    window.addEventListener('message', handleMessage);

    // Fallback timeout
    const timeout = setTimeout(() => setIsLoading(false), 2000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timeout);
    };
  }, [currentCode]);

  return (
    <div className="flex flex-col h-full bg-neutral-50">
      <div className="px-6 py-4 bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-neutral-700" />
            <h2 className="text-lg font-semibold text-neutral-900">Live Preview</h2>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
          </div>
          {history.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600">Version:</span>
              <select
                onChange={(e) => e.target.value && rollbackToVersion(e.target.value)}
                className="px-3 py-1 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                defaultValue=""
              >
                <option value="">Latest</option>
                {history.map((gen, i) => (
                  <option key={gen.id} value={gen.id}>
                    v{history.length - i} - {new Date(gen.timestamp).toLocaleTimeString()}
                  </option>
                ))}
              </select>
              <button 
                onClick={() => window.location.reload()} 
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 p-6">
        {currentCode ? (
          <iframe
            ref={iframeRef}
            className="w-full h-full bg-white rounded-lg border border-neutral-200 shadow-sm"
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin"
          />
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