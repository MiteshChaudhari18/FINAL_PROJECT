import { Share, Code, Users, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Document, User } from "@shared/schema";
import InviteButton from "./InviteButton";


interface ToolbarProps {
  document: Document;
  collaborators: User[];
  isConnected: boolean;
  onLanguageChange: (language: string) => void;
}

<InviteButton />

export default function Toolbar({ document, collaborators, isConnected, onLanguageChange }: ToolbarProps) {
  const { toast } = useToast();

  const handleShare = () => {
    if (document.shareLink) {
      const shareUrl = `${window.location.origin}/share/${document.shareLink}`;
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied",
        description: "Share link copied to clipboard",
      });
    }
  };

  const onlineCollaborators = collaborators.filter(user => user.isOnline);

  return (
    <header className="bg-[var(--editor-toolbar)] border-b border-gray-600 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Code className="text-[var(--vscode-blue)] text-xl" />
          <h1 className="text-lg font-semibold">CodeCollab</h1>
        </div>
        <div className="flex items-center space-x-1 text-sm">
          <span>{document.name}</span>
          <div className="w-2 h-2 bg-[var(--online-green)] rounded-full ml-2" title="Auto-saved" />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Select value={document.language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-32 bg-[var(--editor-sidebar)] border-gray-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {onlineCollaborators.slice(0, 3).map((user) => (
              <div 
                key={user.id}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 border-[var(--editor-toolbar)]"
                style={{ backgroundColor: user.color }}
                title={user.displayName}
              >
                {user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
            ))}
            {onlineCollaborators.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-xs font-semibold border-2 border-[var(--editor-toolbar)]">
                +{onlineCollaborators.length - 3}
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleShare}
            className="bg-[var(--vscode-blue)] hover:bg-blue-600"
            size="sm"
          >
            <Share className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-black/50">
            <Users className="w-3 h-3 mr-1" />
            {onlineCollaborators.length} online
          </Badge>
          <Badge variant="secondary" className="bg-black/50">
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 mr-1" />
                Disconnected
              </>
            )}
          </Badge>
        </div>
      </div>
    </header>
  );
}
