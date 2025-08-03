# 📋 TaskManager - MERN Stack with AI Integration

A modern, feature-rich task management application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring real-time updates, AI-powered assistance, voice commands, and comprehensive task management capabilities.

## 🛠️ Tech Stack

### **Frontend**
- **React 18.3.1** - Modern React with hooks and context
- **Vite** - Lightning-fast build tool and development server
- **React Router DOM 7.7.0** - Client-side routing with nested routes
- **Tailwind CSS 3.4.1** - Utility-first CSS framework with custom color schemes
- **Framer Motion 12.23.11** - Production-ready motion library for animations
- **Axios 1.10.0** - HTTP client with interceptors and request/response transformation
- **Socket.io Client 4.8.1** - Real-time bidirectional event-based communication
- **React Hot Toast 2.5.2** - Beautiful, accessible toast notifications
- **Lucide React 0.525.0** - Customizable SVG icon library
- **@google/genai 1.11.0** - Google Gemini AI integration
- **Date-fns 4.1.0** - Modern date utility library

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js 4.21.2** - Fast, unopinionated web framework
- **MongoDB with Mongoose 8.12.1** - NoSQL database with elegant ODM
- **Socket.io 4.8.1** - Real-time communication server
- **JWT (jsonwebtoken 9.0.2)** - JSON Web Token implementation
- **bcryptjs 3.0.2** - Password hashing and salting
- **Cookie Parser 1.4.7** - HTTP cookie parsing middleware
- **CORS 2.8.5** - Cross-Origin Resource Sharing support
- **dotenv 16.4.7** - Environment variable management

### **AI & Voice Integration**
- **Google Gemini AI** - Advanced language model for task assistance
- **Web Speech API** - Browser-native speech recognition
- **Natural Language Processing** - Intent recognition and command parsing
- **Voice Error Handling** - Microphone permissions and network error management

## 📁 Project Structure

```
TaskManager/
├── Backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/       # Business logic & API endpoints
│   │   │   ├── auth.controller.js      # Authentication & user management
│   │   │   ├── task.controller.js      # Task CRUD operations
│   │   │   └── activity.controller.js  # Activity logging & retrieval
│   │   ├── models/            # Mongoose data models
│   │   │   ├── user.model.js          # User schema with auth methods
│   │   │   ├── task.model.js          # Task schema with validations
│   │   │   └── activity.model.js      # Activity logging schema
│   │   ├── routes/            # Express route definitions
│   │   │   ├── user.route.js          # Authentication routes
│   │   │   ├── task.routes.js         # Task management routes
│   │   │   └── activity.routes.js     # Activity feed routes
│   │   ├── middleware/        # Custom middleware
│   │   │   └── auth.middleware.js     # JWT validation & user extraction
│   │   ├── utilities/         # Helper functions
│   │   │   ├── asyncHandler.js        # Async error handling wrapper
│   │   │   └── generateToken.js       # JWT token generation
│   │   └── db/               # Database configuration
│   │       └── db.js                  # MongoDB connection setup
│   ├── app.js                # Express application setup
│   ├── index.js              # Server entry point with Socket.io
│   └── package.json          # Backend dependencies
│
└── Frontend_Mod/             # React frontend application
    ├── src/
    │   ├── components/       # Reusable UI components
    │   │   ├── auth/         # Authentication components
    │   │   │   └── ProtectedRoute.jsx # Route protection wrapper
    │   │   ├── common/       # Shared UI components
    │   │   │   ├── Modal.jsx             # Animated modal component
    │   │   │   ├── LoadingSpinner.jsx    # Loading state indicators
    │   │   │   ├── ConfirmDialog.jsx     # Confirmation dialogs
    │   │   │   └── AnimatedTaskList.jsx  # Task list with animations
    │   │   ├── dashboard/    # Dashboard-specific components
    │   │   │   ├── StatsCard.jsx         # Statistics display cards
    │   │   │   └── RecentTasks.jsx       # Recent tasks overview
    │   │   ├── tasks/        # Task management components
    │   │   │   ├── TaskCard.jsx          # Individual task display
    │   │   │   ├── TaskForm.jsx          # Task creation/editing form
    │   │   │   └── TaskFilters.jsx       # Task filtering interface
    │   │   ├── activities/   # Activity feed components
    │   │   │   └── ActivityFeed.jsx      # Real-time activity display
    │   │   ├── ai/          # AI assistant components
    │   │   │   ├── AIChat.jsx            # AI chat interface
    │   │   │   ├── SmartSuggestions.jsx  # AI-powered task suggestions
    │   │   │   └── VoiceIndicator.jsx    # Voice command feedback
    │   │   └── layout/       # Application layout
    │   │       ├── Layout.jsx            # Main layout wrapper
    │   │       └── Navbar.jsx            # Navigation component
    │   ├── context/          # React Context providers
    │   │   ├── AuthContext.jsx           # Authentication state management
    │   │   ├── TaskContext.jsx           # Task state management
    │   │   ├── ThemeContext.jsx          # Theme switching logic
    │   │   └── AIContext.jsx             # AI assistant state
    │   ├── pages/            # Main application pages
    │   │   ├── Login.jsx                 # User authentication
    │   │   ├── Register.jsx              # User registration
    │   │   ├── Dashboard.jsx             # Main dashboard view
    │   │   ├── Tasks.jsx                 # Task management page
    │   │   ├── Activities.jsx            # Activity feed page
    │   │   └── Profile.jsx               # User profile management
    │   ├── services/         # API service layer
    │   │   ├── authService.js            # Authentication API calls
    │   │   ├── taskService.js            # Task management API calls
    │   │   ├── activityService.js        # Activity feed API calls
    │   │   ├── aiService.js              # AI integration services
    │   │   ├── voiceService.js           # Voice recognition services
    │   │   ├── socketService.js          # WebSocket management
    │   │   └── axiosInstance.js          # HTTP client configuration
    │   ├── utils/            # Utility functions
    │   │   ├── taskUtils.js              # Task-related helper functions
    │   │   └── dateUtils.js              # Date formatting utilities
    │   ├── App.jsx           # Main application component
    │   ├── main.jsx          # Application entry point
    │   └── index.css         # Tailwind CSS imports & custom styles
    ├── public/               # Static assets
    ├── package.json          # Frontend dependencies
    ├── tailwind.config.js    # Tailwind CSS configuration
    ├── vite.config.js        # Vite build configuration
    └── .env.example          # Environment variables template
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)  
- **npm** or **yarn** package manager
- **Google Gemini API Key** (for AI features)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/taskmanager.git
cd TaskManager
```

### 2. Backend Setup
```bash
cd Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# Add your MongoDB URI, JWT secrets, and other configurations
```

**Backend Environment Variables (.env):**
```env
# Database Configuration
MONGO_DB_URI=mongodb://localhost:27017
DB_NAME=TaskManagerdb

# JWT Configuration
ACCESSTOKENSECRET=your_access_token_secret_here
REFRESHTOKENSECRET=your_refresh_token_secret_here
ACCESSTOKENEXPIRY=15m
REFRESHTOKENEXPIRY=7d

# Server Configuration
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd ../Frontend_Mod

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
```

**Frontend Environment Variables (.env):**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:8000

# Google Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Environment
NODE_ENV=development
```

### 4. Database Setup
Make sure MongoDB is running on your system:
```bash
# Start MongoDB service (varies by OS)
# Ubuntu/Debian:
sudo systemctl start mongod

# macOS (with Homebrew):
brew services start mongodb-community

# Windows: Start MongoDB as a service or run mongod.exe
```

### 5. Start Development Servers
```bash
# Terminal 1 - Backend
cd Backend
npm start

# Terminal 2 - Frontend  
cd Frontend_Mod
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Socket.io**: WebSocket connection on port 8000

## 🎯 Usage Guide

### **Getting Started**
1. **Register**: Create a new account with username, email, password, and profession
2. **Login**: Authenticate with your credentials to access the dashboard
3. **Dashboard**: View your task statistics, recent activities, and AI suggestions
4. **Create Tasks**: Use the "New Task" button or AI chat to create tasks
5. **Voice Commands**: Click the microphone icon to use voice commands

### **Task Management**
- **Create**: Click "New Task" or use AI chat with natural language
- **Update**: Click edit icon on any task card or use voice commands
- **Delete**: Click trash icon with confirmation dialog
- **Filter**: Use the filter bar to sort by status, priority, or search
- **Status Toggle**: Click the circle icon to mark tasks complete

### **AI Assistant Features**
- **Smart Suggestions**: AI analyzes your tasks and suggests improvements
- **Natural Language**: "Create a task to review project proposal by tomorrow"
- **Voice Commands**: "Mark task completed" or "Show me overdue tasks"
- **Task Optimization**: AI suggests better due dates and priority levels

### **Voice Commands Examples**
- "Create a new task called 'Team meeting preparation'"
- "Show me all high priority tasks"
- "Mark the first task as completed"
- "What tasks are due today?"
- "Change task priority to urgent"

## 🔧 API Endpoints

### **Authentication Routes** (`/api/auth`)
```http
POST   /register          # User registration
POST   /login             # User authentication  
POST   /logout            # User logout
POST   /refresh           # Token refresh
GET    /me                # Get user profile
PUT    /cup               # Change user password
PUT    /uud               # Update user details
```

### **Task Management Routes** (`/api/tasks`)  
```http
POST   /ct                # Create task
GET    /gat               # Get all tasks (with filters)
GET    /gtbi/:id          # Get task by ID
PUT    /ut/:id            # Update task
DELETE /dt/:id            # Delete task
GET    /gts               # Get task statistics
GET    /gut               # Get upcoming tasks
```

### **Activity Routes** (`/api/activities`)
```http
GET    /gaa               # Get all activities
DELETE /ca                # Clear all activities
```

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the excellent React framework
- **MongoDB** - For the flexible NoSQL database
- **Google** - For the powerful Gemini AI API
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations and transitions
- **Socket.io** - For real-time communication capabilities
- **Open Source Community** - For the countless libraries and tools

## 📞 Contact & Support

- **Developer**: [Your Name]
- **Email**: your.email@example.com
- **GitHub**: [@DewanshPal/](https://github.com/DewanshPal/)
- **LinkedIn**: [dewansh-pal-aa3279222](www.linkedin.com/in/dewansh-pal-aa3279222)

### **Getting Help**
- 🐛 **Bug Reports**: Use GitHub Issues with detailed reproduction steps
- 💡 **Feature Requests**: Open a GitHub Issue with the enhancement label
- 🤔 **Questions**: Start a GitHub Discussion or reach out via email
- 📖 **Documentation**: Check the README and inline code comments

---

**Built with ❤️ using the MERN stack and modern web technologies**

*TaskManager - Empowering productivity through intelligent task management*
