# Task Manager Frontend

A modern React frontend for the Task Manager MERN stack application with real-time features.

## Features

- **Authentication**: Login, register, profile management
- **Task Management**: Create, read, update, delete tasks with filters
- **Real-time Updates**: WebSocket integration for live activity feed
- **Dashboard**: Overview with statistics and recent tasks
- **Activity Tracking**: Real-time activity feed for all user actions
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Clean, professional interface with smooth animations

## Tech Stack

- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **Date-fns** - Date utility library

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common UI components
│   ├── dashboard/      # Dashboard-specific components
│   ├── layout/         # Layout components
│   └── tasks/          # Task-related components
├── context/            # React Context providers
├── pages/              # Page components
├── services/           # API service functions
├── utils/              # Utility functions
└── App.jsx            # Main application component
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   ```
   Update the environment variables in `.env` to match your backend configuration.

3. **Start development server**:
   ```bash
   npm run dev
   ```

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:5000/api)
- `VITE_SOCKET_URL` - WebSocket server URL (default: http://localhost:5000)

## Key Features

### Authentication
- JWT-based authentication with automatic token refresh
- Protected routes with redirect to login
- User profile management with password change

### Task Management
- CRUD operations for tasks
- Task filtering by status, priority, and search
- Real-time task updates via WebSocket
- Task status quick toggle
- Due date tracking with overdue indicators

### Real-time Features
- Live activity feed showing all user actions
- Real-time task updates across browser tabs
- WebSocket connection management with auto-reconnect

### Dashboard
- Task statistics overview
- Progress visualization
- Recent and upcoming tasks
- Activity feed integration

## API Integration

The frontend integrates with the backend through:

- **REST API**: For CRUD operations and authentication
- **WebSocket**: For real-time updates and activity feed
- **Axios Interceptors**: For automatic token refresh and error handling

## Responsive Design

- Mobile-first approach
- Responsive navigation with mobile menu
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements

## Build and Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

1. Follow the existing code structure and naming conventions
2. Use TypeScript-style JSDoc comments for better documentation
3. Ensure responsive design for all new components
4. Test real-time features with multiple browser tabs
5. Maintain consistent error handling and user feedback