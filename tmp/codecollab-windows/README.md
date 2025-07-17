# CodeCollab - Real-time Collaborative Code Editor

A modern collaborative code editor built with React, Express, and WebSocket technology. Multiple users can edit documents simultaneously with live cursors, chat functionality, and version history.

## Features

- ✅ **Real-time Collaboration**: Multiple users can edit the same document simultaneously
- ✅ **Live Cursors**: See where other users are typing in real-time
- ✅ **Syntax Highlighting**: Support for JavaScript, TypeScript, Python, HTML, CSS, and JSON
- ✅ **Chat System**: Built-in chat with typing indicators
- ✅ **Version History**: Track and restore previous versions of documents
- ✅ **Document Sharing**: Share documents via unique links
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Dark Theme**: VS Code-inspired dark theme

## Quick Start (Windows)

### Prerequisites
- Node.js 18+ (Download from [nodejs.org](https://nodejs.org/))
- VS Code or any code editor

### Installation

1. **Extract the zip file** to your desired location
2. **Open PowerShell as Administrator** in the project folder
3. **Install dependencies**:
   ```powershell
   npm install --legacy-peer-deps
   ```
4. **Start the development server**:
   ```powershell
   npm run dev
   ```
5. **Open your browser** to `http://localhost:5000`

### Testing Collaboration

1. Open multiple browser tabs to `http://localhost:5000`
2. Start typing in the code editor
3. See real-time updates across all tabs
4. Use the chat sidebar to communicate
5. Try the version history in the left sidebar

## Project Structure

```
codecollab-editor/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utility functions
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes and WebSocket handling
│   └── storage.ts         # In-memory data storage
├── shared/                 # Shared TypeScript types
│   └── schema.ts
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **TanStack Query** - Server state management
- **Wouter** - Lightweight routing

### Backend
- **Express.js** - Web server
- **WebSocket (ws)** - Real-time communication
- **TypeScript** - Type safety
- **In-memory storage** - Data persistence (dev mode)

## Common Issues & Solutions

### Installation Issues
```powershell
# If you get dependency conflicts
npm install --legacy-peer-deps --force

# If modules are corrupted
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install --legacy-peer-deps
```

### Port Issues
```powershell
# If port 5000 is in use, change it in server/index.ts
# Or kill the process using the port
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Node.js Version
Make sure you're using Node.js 18 or higher:
```powershell
node --version
```

## Development

### Adding New Features
1. **Frontend components**: Add to `client/src/components/`
2. **API endpoints**: Add to `server/routes.ts`
3. **WebSocket events**: Handle in `server/routes.ts` and `client/src/hooks/useCollaboration.ts`
4. **Database schema**: Modify `shared/schema.ts`

### Real-time Features
The app uses WebSocket for real-time features:
- Document content changes
- Cursor position tracking
- Chat messages
- User presence (online/offline)
- Typing indicators

## Deployment

For production deployment:
1. Build the project: `npm run build`
2. Start the server: `npm run start`
3. Configure a reverse proxy (nginx/Apache)
4. Set up SSL certificates
5. Use a proper database (PostgreSQL recommended)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Make sure all dependencies are installed correctly
3. Verify Node.js version compatibility
4. Try clearing npm cache: `npm cache clean --force`

Happy coding! 🚀