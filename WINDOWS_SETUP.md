# CodeCollab Editor - Windows Setup Guide

## Quick Fix for Your Current Issue

The errors you're seeing are due to dependency version conflicts. Here's how to fix them:

### Step 1: Replace package.json
Replace your current `package.json` with the Windows-compatible version:

```bash
# Delete current package.json and use the Windows version
del package.json
copy package-windows.json package.json
```

### Step 2: Replace configuration files
Replace your configuration files with Windows-compatible versions:

```bash
# Replace vite config
del vite.config.ts
copy vite.config.windows.ts vite.config.ts

# Replace tailwind config
del tailwind.config.ts
copy tailwind.config.windows.js tailwind.config.js
```

### Step 3: Clean install
```bash
# Clean any existing node_modules
rmdir /s node_modules
del package-lock.json

# Install dependencies
npm install --legacy-peer-deps
```

### Step 4: Run the application
```bash
npm run dev
```

## Alternative: Manual Setup (If above doesn't work)

### 1. Create a new project from scratch
```bash
mkdir codecollab-editor
cd codecollab-editor
npm init -y
```

### 2. Install dependencies step by step
```bash
# Core dependencies
npm install express ws react react-dom wouter

# TypeScript and build tools
npm install -D typescript tsx vite @vitejs/plugin-react cross-env

# UI libraries
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-scroll-area @radix-ui/react-toast @radix-ui/react-tooltip

# Form handling
npm install react-hook-form @hookform/resolvers zod

# Styling
npm install tailwindcss postcss autoprefixer tailwindcss-animate
npm install -D @types/node @types/react @types/react-dom @types/express @types/ws

# Additional utilities
npm install clsx class-variance-authority lucide-react @tanstack/react-query
```

### 3. Initialize Tailwind CSS
```bash
npx tailwindcss init -p
```

### 4. Create project structure
```
codecollab-editor/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── server/
│   ├── index.ts
│   ├── routes.ts
│   └── storage.ts
├── shared/
│   └── schema.ts
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Running the Application

After successful installation:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   - Go to `http://localhost:5000`

3. **Test collaboration:**
   - Open multiple browser tabs
   - Start typing in the editor
   - See real-time collaboration in action

## Common Issues and Solutions

### Issue 1: "NODE_ENV not recognized"
**Solution:** Use `cross-env` (included in package-windows.json)

### Issue 2: Dependency conflicts
**Solution:** Use `--legacy-peer-deps` flag when installing

### Issue 3: TypeScript errors
**Solution:** Make sure all `@types/*` packages are installed

### Issue 4: Port already in use
**Solution:** Change the port in `server/index.ts` or kill the process using that port

## Project Features

Once running, you'll have:
- ✅ Real-time collaborative code editing
- ✅ Syntax highlighting for multiple languages
- ✅ Live chat with typing indicators
- ✅ User cursor tracking
- ✅ Document version history
- ✅ File sharing capabilities
- ✅ Responsive design

## Need Help?

If you encounter any issues:
1. Make sure Node.js (v18+) is installed
2. Use PowerShell or Command Prompt as Administrator
3. Clear npm cache: `npm cache clean --force`
4. Try deleting `node_modules` and reinstalling

The application should work perfectly on Windows with these configurations!