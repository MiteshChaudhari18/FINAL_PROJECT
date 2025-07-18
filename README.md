📘 CodeCollabEditor
CodeCollabEditor is a modern, real-time collaborative code editing platform.
It allows multiple users to edit code together, chat in real-time, and manage invitations — all in a beautiful, responsive web interface.

preview of project 
img1.png in repo
img2.png in repo
img3.png in repo

Built with:
✨ React + TypeScript + Vite + TailwindCSS (Frontend)
🚀 Node.js + WebSockets + TypeScript (Backend)

🌟 Features
✅ Real-time collaborative code editing
✅ Invitation-based access control
✅ Integrated chat sidebar for collaboration
✅ Responsive, mobile-friendly UI
✅ Type-safe client-server communication using shared schemas
✅ Cross-platform support with scripts for Windows and Linux

📂 Project Structure

CodeCollabEditor/
│
├── client/                      # 🌐 Frontend (React + Vite)
│   ├── index.html               # App entry HTML
│   └── src/                     # React source code
│       ├── App.tsx              # Root React component
│       ├── main.tsx             # Entry point (ReactDOM)
│       ├── index.css            # Global styles
│       │
│       ├── components/          # UI components
│       │   ├── ChatSidebar.tsx
│       │   ├── CodeEditor.tsx
│       │   ├── InviteButton.tsx
│       │   ├── LeftSidebar.tsx
│       │   ├── Toolbar.tsx
│       │   └── ui/              # Primitive UI components
│       │
│       ├── hooks/               # Reusable React hooks
│       │   ├── use-mobile.tsx
│       │   ├── use-toast.ts
│       │   ├── useCollaboration.ts
│       │   └── useWebSocket.ts
│       │
│       ├── lib/                 # Utilities & helpers
│       │   ├── queryClient.ts
│       │   └── utils.ts
│       │
│       └── pages/               # Application pages
│           ├── editor.tsx
│           └── not-found.tsx
│
├── server/                      # 🖥️ Backend (Node.js + WebSockets)
│   ├── index.ts                 # Server entry point
│   ├── routes.ts                # API endpoints
│   ├── storage.ts               # File/database storage
│   └── vite.ts                  # Vite SSR integration
│
├── shared/                      # 🔄 Shared Types & Schemas
│   └── schema.ts                # Shared TypeScript types
│
├── tmp/                         # 🪟 Windows setup helpers
│   └── (empty or scripts/docs here)
│
├── .gitignore                   # Git ignored files
├── package.json                 # npm scripts & dependencies
├── package-lock.json            # npm lockfile
├── package-windows.json         # Alternative Windows-specific package file
│
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # TailwindCSS config
├── tailwind.config.windows.ts   # Optional Windows-tailored config
├── postcss.config.js            # PostCSS config
├── drizzle.config.ts            # (optional: DB config if used)
├── components.json              # Component config (optional, maybe storybook?)
│
├── vite.config.ts               # Vite build config
├── vite.config.windows.ts       # Vite config for Windows
│
├── README.md                    # Project documentation
├── WINDOWS_SETUP.md             # Windows setup guide
├── DEPLOYMENT_GUIDE.md          # Deployment instructions




🧰 Tech Stack
🖋️ Frontend
React + Vite for fast builds

TailwindCSS for styling

TypeScript for type safety

Custom UI library based on shadcn/ui

🔗 Backend
Node.js with WebSocket server

REST API for invitations and collaboration session management

Type-safe schemas for consistent data



🧪 Development Mode
Start both frontend and backend in development mode:

bash
Copy
Edit
npm run dev
The app will open at: http://localhost:5173


📝 Documentation
DEPLOYMENT_GUIDE.md — Deployment instructions for servers.

WINDOWS_SETUP.md — Windows-specific notes.

replit.md — Running the app on Replit.

💻 Screenshots
img.png
img2.png
img3.png

🧹 Troubleshooting
If you face issues with dependencies:

bash
Copy
Edit
rm -rf node_modules package-lock.json
npm install
Or refer to logs in: attached_assets/


