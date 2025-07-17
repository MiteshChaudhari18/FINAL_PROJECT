import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertDocumentSchema, insertChatMessageSchema, insertDocumentVersionSchema } from "@shared/schema";
import { z } from "zod";

interface WebSocketClient extends WebSocket {
  userId?: number;
  documentId?: number;
  cursor?: { line: number; column: number };
}

interface CollaborationMessage {
  type: 'content-change' | 'cursor-move' | 'user-join' | 'user-leave' | 'chat-message' | 'typing';
  payload: any;
  userId: number;
  documentId: number;
  timestamp: number;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time collaboration
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const documentClients = new Map<number, Set<WebSocketClient>>();
  
  // WebSocket connection handling
  wss.on('connection', (ws: WebSocketClient, req) => {
    console.log('New WebSocket connection');
    
    ws.on('message', async (data) => {
      try {
        const message: CollaborationMessage = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'user-join':
            ws.userId = message.userId;
            ws.documentId = message.documentId;
            
            if (!documentClients.has(message.documentId)) {
              documentClients.set(message.documentId, new Set());
            }
            documentClients.get(message.documentId)!.add(ws);
            
            await storage.addCollaborator(message.documentId, message.userId);
            await storage.updateUserOnlineStatus(message.userId, true);
            
            // Broadcast user join to other collaborators
            broadcastToDocument(message.documentId, {
              type: 'user-join',
              payload: { userId: message.userId },
              userId: message.userId,
              documentId: message.documentId,
              timestamp: Date.now(),
            }, ws);
            break;
            
          case 'content-change':
            // Update document content
            await storage.updateDocument(message.documentId, {
              content: message.payload.content,
            });
            
            // Broadcast change to other collaborators
            broadcastToDocument(message.documentId, message, ws);
            break;
            
          case 'cursor-move':
            ws.cursor = message.payload.cursor;
            broadcastToDocument(message.documentId, message, ws);
            break;
            
          case 'chat-message':
            // Save chat message
            const chatMessage = await storage.createChatMessage({
              documentId: message.documentId,
              authorId: message.userId,
              content: message.payload.content,
            });
            
            // Broadcast to all collaborators
            broadcastToDocument(message.documentId, {
              ...message,
              payload: { ...message.payload, id: chatMessage.id, createdAt: chatMessage.createdAt },
            });
            break;
            
          case 'typing':
            broadcastToDocument(message.documentId, message, ws);
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', async () => {
      if (ws.userId && ws.documentId) {
        // Remove from document clients
        const clients = documentClients.get(ws.documentId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            documentClients.delete(ws.documentId);
          }
        }
        
        // Update user status
        await storage.updateUserOnlineStatus(ws.userId, false);
        
        // Broadcast user leave
        broadcastToDocument(ws.documentId, {
          type: 'user-leave',
          payload: { userId: ws.userId },
          userId: ws.userId,
          documentId: ws.documentId,
          timestamp: Date.now(),
        }, ws);
      }
    });
  });
  
  function broadcastToDocument(documentId: number, message: CollaborationMessage, sender?: WebSocketClient) {
    const clients = documentClients.get(documentId);
    if (clients) {
      clients.forEach(client => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  }
  
  // User routes
  app.post('/api/users', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });
  
  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Document routes
  app.post('/api/documents', async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);
      res.json(document);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.get('/api/documents/:id', async (req, res) => {
    try {
      const document = await storage.getDocument(parseInt(req.params.id));
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/documents/share/:shareLink', async (req, res) => {
    try {
      const document = await storage.getDocumentByShareLink(req.params.shareLink);
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/users/:userId/documents', async (req, res) => {
    try {
      const documents = await storage.getUserDocuments(parseInt(req.params.userId));
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Version routes
  app.post('/api/documents/:id/versions', async (req, res) => {
    try {
      const versionData = insertDocumentVersionSchema.parse({
        ...req.body,
        documentId: parseInt(req.params.id),
      });
      const version = await storage.createVersion(versionData);
      res.json(version);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.get('/api/documents/:id/versions', async (req, res) => {
    try {
      const versions = await storage.getDocumentVersions(parseInt(req.params.id));
      res.json(versions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Chat routes
  app.get('/api/documents/:id/messages', async (req, res) => {
    try {
      const messages = await storage.getChatMessages(parseInt(req.params.id));
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Collaborator routes
  app.get('/api/documents/:id/collaborators', async (req, res) => {
    try {
      const collaborators = await storage.getDocumentCollaborators(parseInt(req.params.id));
      res.json(collaborators);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  return httpServer;
}
