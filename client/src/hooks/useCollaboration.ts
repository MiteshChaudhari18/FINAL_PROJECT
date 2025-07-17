import { useState, useEffect, useRef } from 'react';
import type { Document, User, ChatMessage } from '@shared/schema';

interface CollaborationCursor {
  userId: number;
  user: User;
  line: number;
  column: number;
  color: string;
}

interface CollaborationMessage {
  type: 'content-change' | 'cursor-move' | 'user-join' | 'user-leave' | 'chat-message' | 'typing';
  payload: any;
  userId: number;
  documentId: number;
  timestamp: number;
}

export function useCollaboration(
  socket: WebSocket | null,
  document: Document | null,
  currentUser: User
) {
  const [content, setContent] = useState('');
  const [cursors, setCursors] = useState<CollaborationCursor[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Join document collaboration when socket connects
  useEffect(() => {
    if (socket && document && currentUser) {
      const joinMessage: CollaborationMessage = {
        type: 'user-join',
        payload: { userId: currentUser.id },
        userId: currentUser.id,
        documentId: document.id,
        timestamp: Date.now(),
      };
      
      socket.send(JSON.stringify(joinMessage));
    }
  }, [socket, document, currentUser]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message: CollaborationMessage = JSON.parse(event.data);
        
        switch (message.type) {
          case 'content-change':
            if (message.userId !== currentUser.id) {
              setContent(message.payload.content);
            }
            break;
            
          case 'cursor-move':
            if (message.userId !== currentUser.id) {
              setCursors(prev => {
                const filtered = prev.filter(cursor => cursor.userId !== message.userId);
                return [...filtered, {
                  userId: message.userId,
                  user: message.payload.user,
                  line: message.payload.cursor.line,
                  column: message.payload.cursor.column,
                  color: message.payload.user.color,
                }];
              });
            }
            break;
            
          case 'user-join':
            // Handle user joining
            console.log('User joined:', message.payload.userId);
            break;
            
          case 'user-leave':
            // Remove user's cursor
            setCursors(prev => prev.filter(cursor => cursor.userId !== message.userId));
            break;
            
          case 'chat-message':
            setChatMessages(prev => [...prev, {
              id: message.payload.id,
              documentId: message.documentId,
              authorId: message.userId,
              content: message.payload.content,
              createdAt: new Date(message.payload.createdAt),
            }]);
            break;
            
          case 'typing':
            setTypingUsers(prev => {
              const newSet = new Set(prev);
              if (message.payload.isTyping) {
                newSet.add(message.userId);
              } else {
                newSet.delete(message.userId);
              }
              return newSet;
            });
            break;
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => socket.removeEventListener('message', handleMessage);
  }, [socket, currentUser.id]);

  // Load initial chat messages
  useEffect(() => {
    if (document) {
      fetch(`/api/documents/${document.id}/messages`)
        .then(res => res.json())
        .then(messages => setChatMessages(messages))
        .catch(console.error);
    }
  }, [document]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    
    if (socket && document) {
      const message: CollaborationMessage = {
        type: 'content-change',
        payload: { content: newContent },
        userId: currentUser.id,
        documentId: document.id,
        timestamp: Date.now(),
      };
      
      socket.send(JSON.stringify(message));
    }
  };

  const handleCursorMove = (line: number, column: number) => {
    if (socket && document) {
      const message: CollaborationMessage = {
        type: 'cursor-move',
        payload: { 
          cursor: { line, column },
          user: currentUser,
        },
        userId: currentUser.id,
        documentId: document.id,
        timestamp: Date.now(),
      };
      
      socket.send(JSON.stringify(message));
    }
  };

  const sendChatMessage = (content: string) => {
    if (socket && document) {
      const message: CollaborationMessage = {
        type: 'chat-message',
        payload: { content },
        userId: currentUser.id,
        documentId: document.id,
        timestamp: Date.now(),
      };
      
      socket.send(JSON.stringify(message));
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (socket && document) {
      const message: CollaborationMessage = {
        type: 'typing',
        payload: { isTyping },
        userId: currentUser.id,
        documentId: document.id,
        timestamp: Date.now(),
      };
      
      socket.send(JSON.stringify(message));
    }
    
    if (isTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        handleTyping(false);
      }, 1000);
    }
  };

  return {
    content,
    setContent,
    cursors,
    chatMessages,
    typingUsers,
    handleContentChange,
    handleCursorMove,
    sendChatMessage,
    handleTyping,
  };
}
