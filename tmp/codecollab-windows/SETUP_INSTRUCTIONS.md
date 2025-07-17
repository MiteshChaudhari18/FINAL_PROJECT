# Windows Setup Instructions

## Step-by-Step Setup Guide

### 1. Prerequisites
- Install **Node.js 18+** from [nodejs.org](https://nodejs.org/)
- Install **VS Code** from [code.visualstudio.com](https://code.visualstudio.com/)

### 2. Extract and Setup
1. Extract the zip file to your desired location (e.g., `C:\Projects\codecollab-editor`)
2. Open **PowerShell as Administrator**
3. Navigate to the project folder:
   ```powershell
   cd C:\Projects\codecollab-editor
   ```

### 3. Install Dependencies
```powershell
# Install all packages (use legacy-peer-deps to avoid conflicts)
npm install --legacy-peer-deps
```

### 4. Start the Application
```powershell
# Start development server
npm run dev
```

You should see:
```
[express] serving on port 5000
```

### 5. Open in Browser
- Go to `http://localhost:5000`
- Open multiple tabs to test collaboration

## If You Get Errors

### Error: "NODE_ENV not recognized"
✅ **Fixed**: The package.json includes `cross-env` to handle this

### Error: "ERESOLVE dependency conflict"
```powershell
# Force install with legacy peer deps
npm install --legacy-peer-deps --force
```

### Error: "Port 5000 already in use"
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID 1234 /F
```

### Error: "Cannot find module"
```powershell
# Clean install
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install --legacy-peer-deps
```

## Testing the Features

### Real-time Collaboration
1. Open `http://localhost:5000` in multiple browser tabs
2. Start typing in one tab
3. See changes appear in other tabs instantly

### Chat System
1. Use the chat sidebar on the right
2. Type messages and see them appear in all tabs
3. Watch for typing indicators

### Version History
1. Make some changes to the code
2. Check the "History" tab in the left sidebar
3. Try restoring a previous version

### Document Sharing
1. Click the "Share" button in the toolbar
2. Copy the link and open in a new tab
3. Test collaboration with the shared document

## Project Structure
```
codecollab-editor/
├── client/          # React frontend
├── server/          # Express backend  
├── shared/          # Shared types
├── package.json     # Dependencies
├── vite.config.ts   # Build configuration
└── tailwind.config.js # Styling
```

## Development Tips

### VS Code Extensions (Recommended)
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **Auto Rename Tag**

### Hot Reload
The app automatically refreshes when you save files. Make changes to:
- `client/src/` - Frontend React components
- `server/` - Backend API and WebSocket handling
- `shared/` - Type definitions

### Debugging
- **Frontend**: Use browser DevTools (F12)
- **Backend**: Check the PowerShell console output
- **WebSocket**: Monitor Network tab in DevTools

## Success Indicators

✅ **Working correctly** if you see:
- Multiple browser tabs sync in real-time
- Chat messages appear instantly
- User cursors show in different colors
- Version history saves and restores
- Share links work properly

## Next Steps

Once everything is working:
1. Explore the code structure
2. Try modifying components in `client/src/components/`
3. Add new features to the WebSocket handling
4. Customize the styling with Tailwind CSS

## Need Help?

If you encounter issues not covered here:
1. Check that Node.js version is 18+: `node --version`
2. Make sure you're using PowerShell as Administrator
3. Try clearing npm cache: `npm cache clean --force`
4. Restart your computer if permission issues persist

The application should work perfectly on Windows with these instructions!