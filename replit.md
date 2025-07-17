# CodeCollab - Real-time Code Collaboration Platform

## Overview

CodeCollab is a real-time collaborative code editor that allows multiple users to edit documents simultaneously with live cursors, chat functionality, and version history. The application is built with a modern full-stack architecture using React, Express, TypeScript, and WebSocket technology.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and build optimization
- **UI Framework**: Radix UI components with custom styling
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Communication**: WebSocket API for live collaboration

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints with WebSocket integration
- **Session Management**: Express sessions with PostgreSQL store
- **Error Handling**: Centralized error middleware

### Database & ORM
- **Database**: PostgreSQL (configured via DATABASE_URL)
- **ORM**: Drizzle ORM for type-safe database operations
- **Migration**: Drizzle Kit for schema management
- **Connection**: Neon serverless PostgreSQL adapter

## Key Components

### Real-time Collaboration System
- **WebSocket Server**: Handles real-time events (content changes, cursor movements, chat messages)
- **Document Synchronization**: Live content updates across all connected clients
- **Cursor Tracking**: Real-time cursor position sharing between collaborators
- **User Presence**: Online/offline status tracking

### Editor Features
- **Multi-language Support**: JavaScript, TypeScript, Python, HTML, CSS, JSON
- **Version Control**: Document version history with restore functionality
- **File Management**: Document creation, sharing, and organization
- **Mobile Responsive**: Adaptive UI for different screen sizes

### Chat System
- **Real-time Messaging**: WebSocket-based chat for each document
- **Typing Indicators**: Live typing status for active users
- **Message Persistence**: Chat history stored in database

### Authentication & Authorization
- **Mock Authentication**: Development user system (ready for real auth integration)
- **Document Permissions**: Owner-based access control
- **Share Links**: Public document sharing via unique URLs

## Data Flow

### Document Collaboration Flow
1. User connects to WebSocket server
2. Joins document room with user ID and document ID
3. Receives real-time updates for content changes, cursor movements, and chat messages
4. Broadcasts user actions to all other connected clients
5. Persists changes and messages to PostgreSQL database

### State Management Flow
1. TanStack Query handles server state caching and synchronization
2. WebSocket events update local state in real-time
3. Optimistic updates provide immediate UI feedback
4. Error states handled with toast notifications

## External Dependencies

### UI Components
- **Radix UI**: Accessible, unstyled component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Fast build tool with HMR support
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast JavaScript bundler for production builds

### Database & Real-time
- **Neon Database**: Serverless PostgreSQL provider
- **WebSocket (ws)**: Real-time bidirectional communication
- **Drizzle ORM**: Type-safe database operations

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: Hot module replacement with Vite dev server
- **Production**: Static file serving with Express
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### File Structure
```
├── client/          # React frontend application
├── server/          # Express backend server
├── shared/          # Shared types and schemas
├── migrations/      # Database migration files
└── dist/           # Built production files
```

### Key Features Ready for Extension
- Authentication system (currently uses mock users)
- File upload and attachment system
- Advanced code editor features (syntax highlighting, autocomplete)
- Document collaboration permissions and roles
- Real-time code execution and preview