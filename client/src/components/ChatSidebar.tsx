import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Document, User, ChatMessage } from '@shared/schema';

interface ChatSidebarProps {
  document: Document;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  typingUsers: Set<number>;
  currentUser: User;
  collaborators: User[];
}

export default function ChatSidebar({ 
  document, 
  messages, 
  onSendMessage, 
  typingUsers, 
  currentUser, 
  collaborators 
}: ChatSidebarProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getUserById = (id: number) => {
    return collaborators.find(user => user.id === id) || currentUser;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const onlineCollaborators = collaborators.filter(user => user.isOnline);

  return (
    <aside className="bg-[var(--editor-sidebar)] w-80 border-l border-gray-600 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-600">
        <h3 className="text-sm font-semibold flex items-center">
          <MessageCircle className="w-4 h-4 mr-2" />
          Team Chat
          <Badge className="ml-auto bg-[var(--online-green)] text-white">
            {onlineCollaborators.length} online
          </Badge>
        </h3>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.map((message) => {
            const author = getUserById(message.authorId);
            const isCurrentUser = message.authorId === currentUser.id;
            
            return (
              <div key={message.id} className="flex items-start space-x-2">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{ backgroundColor: author.color }}
                >
                  {getInitials(author.displayName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">
                      {isCurrentUser ? 'You' : author.displayName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 break-words">
                    {message.content}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {typingUsers.size > 0 && (
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                ...
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
              </div>
              <span className="text-xs">
                {Array.from(typingUsers).map(id => getUserById(id).displayName).join(', ')} 
                {typingUsers.size === 1 ? ' is' : ' are'} typing...
              </span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-600">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-[var(--editor-bg)] border-gray-600 text-white placeholder-gray-400 focus:border-[var(--vscode-blue)]"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-[var(--vscode-blue)] hover:bg-blue-600"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
