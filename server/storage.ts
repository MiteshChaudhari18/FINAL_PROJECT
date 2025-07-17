import { 
  users, 
  documents, 
  documentVersions, 
  chatMessages, 
  documentCollaborators,
  type User, 
  type InsertUser,
  type Document,
  type InsertDocument,
  type DocumentVersion,
  type InsertDocumentVersion,
  type ChatMessage,
  type InsertChatMessage,
  type DocumentCollaborator
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserOnlineStatus(id: number, isOnline: boolean): Promise<void>;
  
  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentByShareLink(shareLink: string): Promise<Document | undefined>;
  updateDocument(id: number, updates: Partial<Document>): Promise<void>;
  getUserDocuments(userId: number): Promise<Document[]>;
  
  // Version operations
  createVersion(version: InsertDocumentVersion): Promise<DocumentVersion>;
  getDocumentVersions(documentId: number): Promise<DocumentVersion[]>;
  
  // Chat operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(documentId: number): Promise<ChatMessage[]>;
  
  // Collaborator operations
  addCollaborator(documentId: number, userId: number): Promise<void>;
  getDocumentCollaborators(documentId: number): Promise<User[]>;
  removeCollaborator(documentId: number, userId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private documents: Map<number, Document> = new Map();
  private documentVersions: Map<number, DocumentVersion> = new Map();
  private chatMessages: Map<number, ChatMessage> = new Map();
  private documentCollaborators: Map<number, DocumentCollaborator> = new Map();
  
  private userIdCounter = 1;
  private documentIdCounter = 1;
  private versionIdCounter = 1;
  private messageIdCounter = 1;
  private collaboratorIdCounter = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.userIdCounter++,
      ...insertUser,
      isOnline: true,
      lastSeen: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUserOnlineStatus(id: number, isOnline: boolean): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.isOnline = isOnline;
      user.lastSeen = new Date();
      this.users.set(id, user);
    }
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const document: Document = {
      id: this.documentIdCounter++,
      name: insertDocument.name,
      content: insertDocument.content || '',
      language: insertDocument.language || 'javascript',
      ownerId: insertDocument.ownerId,
      isPublic: insertDocument.isPublic || false,
      shareLink: `doc-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.documents.set(document.id, document);
    return document;
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentByShareLink(shareLink: string): Promise<Document | undefined> {
    return Array.from(this.documents.values()).find(doc => doc.shareLink === shareLink);
  }

  async updateDocument(id: number, updates: Partial<Document>): Promise<void> {
    const document = this.documents.get(id);
    if (document) {
      const updatedDocument = { ...document, ...updates, updatedAt: new Date() };
      this.documents.set(id, updatedDocument);
    }
  }

  async getUserDocuments(userId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.ownerId === userId);
  }

  async createVersion(insertVersion: InsertDocumentVersion): Promise<DocumentVersion> {
    const version: DocumentVersion = {
      id: this.versionIdCounter++,
      documentId: insertVersion.documentId,
      content: insertVersion.content,
      authorId: insertVersion.authorId,
      description: insertVersion.description || null,
      createdAt: new Date(),
    };
    this.documentVersions.set(version.id, version);
    return version;
  }

  async getDocumentVersions(documentId: number): Promise<DocumentVersion[]> {
    return Array.from(this.documentVersions.values())
      .filter(version => version.documentId === documentId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: this.messageIdCounter++,
      ...insertMessage,
      createdAt: new Date(),
    };
    this.chatMessages.set(message.id, message);
    return message;
  }

  async getChatMessages(documentId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.documentId === documentId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async addCollaborator(documentId: number, userId: number): Promise<void> {
    const existing = Array.from(this.documentCollaborators.values())
      .find(collab => collab.documentId === documentId && collab.userId === userId);
    
    if (!existing) {
      const collaborator: DocumentCollaborator = {
        id: this.collaboratorIdCounter++,
        documentId,
        userId,
        joinedAt: new Date(),
      };
      this.documentCollaborators.set(collaborator.id, collaborator);
    }
  }

  async getDocumentCollaborators(documentId: number): Promise<User[]> {
    const collaboratorIds = Array.from(this.documentCollaborators.values())
      .filter(collab => collab.documentId === documentId)
      .map(collab => collab.userId);
    
    return collaboratorIds.map(id => this.users.get(id)).filter(Boolean) as User[];
  }

  async removeCollaborator(documentId: number, userId: number): Promise<void> {
    const collaborator = Array.from(this.documentCollaborators.values())
      .find(collab => collab.documentId === documentId && collab.userId === userId);
    
    if (collaborator) {
      this.documentCollaborators.delete(collaborator.id);
    }
  }
}

export const storage = new MemStorage();
