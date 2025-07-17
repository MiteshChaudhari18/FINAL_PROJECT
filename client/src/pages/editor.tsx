import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import CodeEditor from "@/components/CodeEditor";
import ChatSidebar from "@/components/ChatSidebar";
import LeftSidebar from "@/components/LeftSidebar";
import Toolbar from "@/components/Toolbar";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useCollaboration } from "@/hooks/useCollaboration";
import type { Document, User } from "@shared/schema";

// Mock user for demo - in real app this would come from authentication
const MOCK_USER: User = {
  id: 1,
  username: "john_doe",
  email: "john@example.com",
  displayName: "John Doe",
  color: "#3B82F6",
  isOnline: true,
  lastSeen: new Date(),
};

export default function Editor() {
  const params = useParams();
  const { toast } = useToast();
  const [document, setDocument] = useState<Document | null>(null);
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Determine document ID from params
  const documentId = params.documentId ? parseInt(params.documentId) : null;
  const shareLink = params.shareLink;

  // Fetch document data
  const { data: documentData, isLoading: isDocumentLoading } = useQuery({
    queryKey: shareLink 
      ? ['/api/documents/share', shareLink]
      : documentId 
      ? ['/api/documents', documentId]
      : [],
    enabled: !!(shareLink || documentId),
  });

  // Fetch collaborators
  const { data: collaboratorsData } = useQuery({
    queryKey: document ? ['/api/documents', document.id, 'collaborators'] : [],
    enabled: !!document,
  });

  // WebSocket connection
  const { socket, isConnected } = useWebSocket();

  // Collaboration features
  const {
    content,
    setContent,
    cursors,
    handleContentChange,
    handleCursorMove,
    sendChatMessage,
    chatMessages,
    typingUsers,
  } = useCollaboration(socket, document, MOCK_USER);

  // Handle document loading
  useEffect(() => {
    if (documentData && !isDocumentLoading) {
      setDocument(documentData);
      setContent(documentData.content);
      setIsLoading(false);
    }
  }, [documentData, isDocumentLoading, setContent]);

  // Handle collaborators loading
  useEffect(() => {
    if (collaboratorsData) {
      setCollaborators(collaboratorsData);
    }
  }, [collaboratorsData]);

  // Create new document if no ID provided
  useEffect(() => {
    if (!documentId && !shareLink) {
      const createNewDocument = async () => {
        try {
          const response = await fetch('/api/documents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Untitled Document',
              content: '// Welcome to CodeCollab!\n// Start typing to collaborate in real-time\n\n',
              language: 'javascript',
              ownerId: MOCK_USER.id,
              isPublic: true,
            }),
          });
          
          if (response.ok) {
            const newDocument = await response.json();
            setDocument(newDocument);
            setContent(newDocument.content);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Failed to create document:', error);
          toast({
            title: "Error",
            description: "Failed to create new document",
            variant: "destructive",
          });
        }
      };

      createNewDocument();
    }
  }, [documentId, shareLink, setContent, toast]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--editor-bg)]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--editor-bg)]">
        <div className="text-white">Document not found</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--editor-bg)] text-white">
      <Toolbar 
        document={document}
        collaborators={collaborators}
        isConnected={isConnected}
        onLanguageChange={(language) => {
          setDocument({ ...document, language });
          // TODO: Update document language in backend
        }}
      />
      
      <div className="flex-1 flex">
        <LeftSidebar 
          document={document}
          onRestoreVersion={(content) => {
            setContent(content);
            handleContentChange(content);
          }}
        />
        
        <CodeEditor
          document={document}
          content={content}
          onContentChange={handleContentChange}
          onCursorMove={handleCursorMove}
          cursors={cursors}
          collaborators={collaborators}
        />
        
        <ChatSidebar
          document={document}
          messages={chatMessages}
          onSendMessage={sendChatMessage}
          typingUsers={typingUsers}
          currentUser={MOCK_USER}
          collaborators={collaborators}
        />
      </div>
    </div>
  );
}
