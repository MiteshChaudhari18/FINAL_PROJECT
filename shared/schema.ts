import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  color: text("color").notNull(),
  isOnline: boolean("is_online").notNull().default(false),
  lastSeen: timestamp("last_seen").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull().default(""),
  language: text("language").notNull().default("javascript"),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  isPublic: boolean("is_public").notNull().default(false),
  shareLink: text("share_link").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documentVersions = pgTable("document_versions", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => documents.id).notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => documents.id).notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documentCollaborators = pgTable("document_collaborators", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => documents.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  displayName: true,
  color: true,
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  name: true,
  content: true,
  language: true,
  ownerId: true,
  isPublic: true,
});

export const insertDocumentVersionSchema = createInsertSchema(documentVersions).pick({
  documentId: true,
  content: true,
  authorId: true,
  description: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  documentId: true,
  authorId: true,
  content: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type DocumentVersion = typeof documentVersions.$inferSelect;
export type InsertDocumentVersion = z.infer<typeof insertDocumentVersionSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type DocumentCollaborator = typeof documentCollaborators.$inferSelect;
