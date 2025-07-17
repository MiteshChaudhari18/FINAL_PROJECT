import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Document, User } from '@shared/schema';

interface CollaborationCursor {
  userId: number;
  user: User;
  line: number;
  column: number;
  color: string;
}

interface CodeEditorProps {
  document: Document;
  content: string;
  onContentChange: (content: string) => void;
  onCursorMove: (line: number, column: number) => void;
  cursors: CollaborationCursor[];
  collaborators: User[];
}

export default function CodeEditor({ 
  document, 
  content, 
  onContentChange, 
  onCursorMove, 
  cursors, 
  collaborators 
}: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  const [cursorPosition, setCursorPosition] = useState({ line: 0, column: 0 });

  // Handle content changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    onContentChange(newContent);
  };

  // Handle cursor movement
  const handleCursorMove = (e: React.MouseEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = textarea.value.substring(0, cursorPos);
    const lines = textBeforeCursor.split('\n');
    const line = lines.length - 1;
    const column = lines[lines.length - 1].length;
    
    setCursorPosition({ line, column });
    onCursorMove(line, column);
  };

  // Simple syntax highlighting
  const highlightSyntax = (code: string) => {
    if (document.language === 'javascript' || document.language === 'typescript') {
      return code
        .replace(/(\/\/.*$)/gm, '<span class="syntax-comment">$1</span>')
        .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="syntax-string">$1$2$1</span>')
        .replace(/\b(const|let|var|function|class|if|else|for|while|return|import|export|default|async|await|try|catch|throw|new|this|super|extends|implements|interface|type|enum|namespace|module|declare|public|private|protected|static|readonly|abstract)\b/g, '<span class="syntax-keyword">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="syntax-number">$1</span>')
        .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="syntax-function">$1</span>');
    }
    return code;
  };

  // Calculate line numbers
  const lineNumbers = content.split('\n').map((_, index) => index + 1);

  return (
    <main className="flex-1 flex flex-col">
      {/* Editor Tabs */}
      <div className="bg-[var(--editor-toolbar)] border-b border-gray-600 px-4 py-1">
        <div className="flex space-x-1">
          <div className="bg-[var(--editor-bg)] px-4 py-2 rounded-t text-sm border-t-2 border-[var(--vscode-blue)]">
            <span className="text-yellow-400 mr-2">📄</span>
            {document.name}
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 relative bg-[var(--editor-bg)] flex">
        {/* Line Numbers */}
        <div className="w-12 bg-[var(--editor-bg)] border-r border-gray-600 text-gray-400 text-sm font-mono select-none py-4 px-2">
          {lineNumbers.map((num) => (
            <div key={num} className="h-5 leading-5 text-right pr-2">
              {num}
            </div>
          ))}
        </div>

        {/* Editor Content */}
        <div className="flex-1 relative">
          {/* Syntax Highlighted Background */}
          <div 
            className="absolute inset-0 p-4 font-mono text-sm leading-5 whitespace-pre-wrap break-words pointer-events-none text-transparent"
            dangerouslySetInnerHTML={{ __html: highlightSyntax(content) }}
          />
          
          {/* Collaboration Cursors */}
          {cursors.map((cursor) => (
            <div
              key={cursor.userId}
              className="collaboration-cursor absolute"
              style={{
                left: `${16 + cursor.column * 8.4}px`,
                top: `${16 + cursor.line * 20}px`,
                backgroundColor: cursor.color,
              }}
            >
              <div 
                className="collaboration-cursor-label"
                style={{ backgroundColor: cursor.color }}
              >
                {cursor.user.displayName}
              </div>
            </div>
          ))}
          
          {/* Actual Textarea */}
          <textarea
            ref={editorRef}
            value={content}
            onChange={handleChange}
            onKeyUp={handleCursorMove}
            onMouseUp={handleCursorMove}
            className="w-full h-full p-4 bg-transparent text-white font-mono text-sm leading-5 resize-none outline-none caret-white"
            placeholder="Start typing your code..."
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>

        {/* Status Indicators */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <div className="bg-black/50 px-3 py-1 rounded text-xs">
            <span className="text-gray-400">Ln {cursorPosition.line + 1}, Col {cursorPosition.column + 1}</span>
          </div>
          <div className="bg-black/50 px-3 py-1 rounded text-xs">
            <span className="text-gray-400">{document.language}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
