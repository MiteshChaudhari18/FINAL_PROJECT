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
graphql
Copy
Edit
CodeCollabEditor/
├── client/            # Frontend React application
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── pages/          # Pages: editor, invitations, 404
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility libraries
├── server/            # Backend Node.js server
│   ├── index.ts
│   ├── db.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── vite.ts
├── shared/            # Shared TypeScript schemas
│   └── schema.ts
├── tmp/               # Windows-specific setup assets
├── attached_assets/   # Logs & errors
├── .git/              # Git repository
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md          # You’re reading it!



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


