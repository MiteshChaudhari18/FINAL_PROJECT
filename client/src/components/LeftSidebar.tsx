import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FolderOpen, History, FileText, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { Document, DocumentVersion } from '@shared/schema';

interface LeftSidebarProps {
  document: Document;
  onRestoreVersion: (content: string) => void;
}

export default function LeftSidebar({ document, onRestoreVersion }: LeftSidebarProps) {
  const [selectedTab, setSelectedTab] = useState<'files' | 'history'>('files');

  // Fetch document versions
  const { data: versions = [], isLoading } = useQuery({
    queryKey: ['/api/documents', document.id, 'versions'],
    enabled: !!document.id,
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min ago`;
    return 'Just now';
  };

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'javascript':
      case 'typescript':
        return '🟨';
      case 'python':
        return '🐍';
      case 'html':
        return '🔴';
      case 'css':
        return '🎨';
      case 'json':
        return '📄';
      default:
        return '📄';
    }
  };

  return (
    <aside className="bg-[var(--editor-sidebar)] w-64 border-r border-gray-600 flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-600">
        <div className="flex">
          <button
            onClick={() => setSelectedTab('files')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              selectedTab === 'files'
                ? 'bg-[var(--editor-bg)] text-white border-b-2 border-[var(--vscode-blue)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FolderOpen className="w-4 h-4 inline mr-2" />
            Explorer
          </button>
          <button
            onClick={() => setSelectedTab('history')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              selectedTab === 'history'
                ? 'bg-[var(--editor-bg)] text-white border-b-2 border-[var(--vscode-blue)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4 inline mr-2" />
            History
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <ScrollArea className="flex-1">
        {selectedTab === 'files' ? (
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center">
              <FolderOpen className="w-4 h-4 mr-2" />
              Files
            </h3>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 py-2 px-3 bg-[var(--editor-bg)] rounded cursor-pointer">
                <span className="text-lg">{getLanguageIcon(document.language)}</span>
                <span className="text-sm text-white flex-1">{document.name}</span>
                <Badge variant="outline" className="text-xs">
                  {document.language}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center">
              <History className="w-4 h-4 mr-2" />
              Version History
            </h3>
            {isLoading ? (
              <div className="text-gray-400 text-sm">Loading versions...</div>
            ) : versions.length === 0 ? (
              <div className="text-gray-400 text-sm">No versions yet</div>
            ) : (
              <div className="space-y-2">
                {versions.map((version: DocumentVersion) => (
                  <div key={version.id} className="bg-gray-700 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-300">
                        {formatTime(version.createdAt)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        v{version.id}
                      </Badge>
                    </div>
                    {version.description && (
                      <p className="text-xs text-gray-400 mb-2">
                        {version.description}
                      </p>
                    )}
                    <Button
                      onClick={() => onRestoreVersion(version.content)}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Restore
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
