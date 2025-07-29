# 📋 TaskManager - MERN Stack with AI Integration

A modern, feature-rich task management application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring real-time updates, AI-powered assistance, voice commands, and comprehensive task management capabilities.


## 🚀 Features

### 🔐 **Authentication & User Management**
- **Secure Registration & Login**: JWT-based authentication with bcrypt password hashing
- **User Profile Management**: Update username, email, and profession details
- **Password Management**: Change passwords with old password verification
- **Session Management**: HTTP-only cookies for refresh tokens, automatic token refresh
- **Protected Routes**: Role-based access control for all application features

### 📋 **Comprehensive Task Management**
- **Full CRUD Operations**: Create, read, update, delete tasks with rich metadata
- **Task Status System**: Track tasks through `pending`, `in-progress`, and `completed` states
- **Priority Levels**: Organize tasks with `low`, `medium`, `high`, and `urgent` priorities
- **Due Date Management**: Set deadlines with overdue detection and visual indicators
- **Advanced Filtering**: Filter tasks by status, priority, and search through titles/descriptions
- **Quick Actions**: One-click status toggling and bulk operations

### 🤖 **AI-Powered Personal Assistant**
- **Google Gemini Integration**: Advanced AI using Google's latest Gemini model via @google/genai
- **Intelligent Task Suggestions**: AI analyzes your tasks and provides smart recommendations
- **Natural Language Processing**: Create, update, and manage tasks through conversational AI
- **Voice Commands**: Speech-to-text integration with Web Speech API
- **Smart Automation**: AI suggests task improvements, deadline adjustments, and productivity tips
- **Voice Indicators**: Real-time visual feedback for voice command processing

### 📊 **Dashboard & Analytics**
- **Real-time Statistics**: Live task counts, completion rates, and progress tracking
- **Visual Progress Bars**: Dynamic progress visualization with completion percentages  
- **Upcoming Tasks**: Smart highlighting of tasks due today, tomorrow, and overdue items
- **Recent Activity**: Comprehensive activity feed tracking all user actions
- **Personalized Greetings**: Time-based welcome messages with user-specific insights

### 🔄 **Real-time Updates**
- **WebSocket Integration**: Socket.io for instant cross-device synchronization
- **Live Activity Feed**: Real-time notifications for all task operations
- **Multi-tab Sync**: Changes reflect instantly across all open browser tabs
- **Auto-reconnection**: Robust connection management with automatic retry logic
- **Background Updates**: Seamless updates without page refreshes

### 🎨 **Modern UI/UX Design**
- **Dark/Light Mode**: Comprehensive theme switching with system preference detection
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Responsive Design**: Mobile-first approach with perfect tablet and desktop layouts
- **Professional Styling**: Clean, modern interface with Tailwind CSS
- **Accessibility**: WCAG compliant design with keyboard navigation support
- **Loading States**: Skeleton screens and spinners for better user experience

### 📱 **Activity Tracking**
- **Comprehensive Logging**: Track all user actions and task modifications
- **Activity Timeline**: Chronological view of all task-related activities
- **Action Types**: Detailed logging for created, updated, deleted, and completed tasks
- **Bulk Operations**: Clear all activities and batch activity management
- **Real-time Updates**: Live activity feed with instant notifications

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

## 🎨 UI/UX Features

### **Design System**
- **Modern Color Palette**: Primary blues, success greens, warning yellows, danger reds
- **Typography**: Hierarchical text styling with proper contrast ratios
- **Spacing**: Consistent spacing scale using Tailwind CSS utilities
- **Border Radius**: Rounded corners for modern, friendly appearance
- **Shadows**: Subtle elevation system for depth and hierarchy

### **Animations & Interactions**
- **Page Transitions**: Smooth routing animations with Framer Motion
- **Task Card Animations**: Staggered entry animations and hover effects
- **Loading States**: Skeleton screens and progressive loading indicators
- **Micro-interactions**: Button hover states, form validation feedback
- **Modal Animations**: Slide-in modals with backdrop blur effects

### **Responsive Behavior**
- **Mobile First**: Optimized for mobile devices with touch-friendly interactions
- **Tablet Support**: Perfect layout for iPad and Android tablets
- **Desktop Enhancement**: Expanded layouts with sidebar navigation
- **Touch Gestures**: Swipe actions for mobile task management

## 🔒 Security Features

### **Authentication Security**
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **JWT Tokens**: Signed JSON Web Tokens with expiration times
- **HTTP-Only Cookies**: Secure refresh token storage preventing XSS attacks
- **Token Refresh**: Automatic token renewal without user intervention
- **Session Management**: Proper login/logout flow with token cleanup

### **API Security** 
- **CORS Configuration**: Properly configured cross-origin resource sharing
- **Input Validation**: Server-side validation for all user inputs
- **Authentication Middleware**: Protected routes requiring valid JWT tokens
- **Error Handling**: Secure error responses without sensitive information exposure
- **Rate Limiting**: Protection against brute force attacks (configurable)

### **Data Protection**
- **User Isolation**: Users can only access their own tasks and activities
- **Ownership Validation**: Server-side checks for resource ownership
- **Sanitized Responses**: Clean API responses without sensitive data
- **Environment Variables**: Secure configuration management

## 🚀 Performance Optimizations

### **Frontend Performance**
- **Code Splitting**: Lazy loading of route components
- **Bundle Optimization**: Vite's tree-shaking and optimization
- **Image Optimization**: Efficient asset loading and caching
- **State Management**: Optimized React Context usage
- **Memoization**: React.memo and useMemo for expensive computations

### **Backend Performance** 
- **Database Indexing**: Optimized MongoDB queries with proper indexes
- **Aggregation Pipelines**: Efficient data processing for statistics
- **Connection Pooling**: MongoDB connection management
- **Async Operations**: Non-blocking I/O operations throughout
- **Error Handling**: Graceful error handling without crashes

### **Real-time Performance**
- **Socket.io Optimization**: Efficient WebSocket connection management
- **Room-based Updates**: Targeted updates to specific users
- **Connection Resilience**: Auto-reconnection with exponential backoff
- **Event Batching**: Efficient handling of multiple simultaneous events

## 🧪 Testing & Development

### **Development Tools**
- **Hot Reload**: Instant frontend updates during development
- **API Testing**: Built-in error handling and logging for debugging  
- **Socket Debugging**: Real-time WebSocket connection monitoring
- **Environment Switching**: Easy development/production environment switching

### **Code Quality**
- **ESLint Configuration**: Consistent code style and error detection
- **Prettier Integration**: Automatic code formatting
- **Error Boundaries**: React error boundaries for graceful failure handling
- **Logging**: Comprehensive logging for debugging and monitoring

## 🔮 Future Enhancements

### **Planned Features**
- **Team Collaboration**: Multi-user task sharing and assignment
- **File Attachments**: Upload and attach files to tasks
- **Calendar Integration**: Google Calendar and Outlook synchronization
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Productivity insights and time tracking
- **Custom Themes**: User-customizable color schemes and layouts
- **Offline Support**: Progressive Web App with offline capabilities
- **Advanced AI**: More sophisticated AI suggestions and automation

### **Technical Improvements**
- **GraphQL API**: More efficient data fetching with GraphQL
- **Microservices**: Scalable microservice architecture
- **Docker Containerization**: Easy deployment with Docker
- **CI/CD Pipeline**: Automated testing and deployment
- **Performance Monitoring**: Application performance insights
- **Advanced Caching**: Redis integration for improved performance

## 🤝 Contributing

We welcome contributions to TaskManager! Please follow these guidelines:

### **Getting Started**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the existing code style
4. Test your changes thoroughly
5. Commit with descriptive messages (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### **Development Guidelines**
- Follow the existing code structure and naming conventions
- Write clean, commented code with proper documentation
- Ensure responsive design for all new UI components
- Test real-time features across multiple browser tabs
- Maintain consistent error handling and user feedback
- Update README.md for any new features or changes

### **Code Style**
- **Frontend**: Use ESLint and Prettier configurations provided
- **Backend**: Follow Node.js best practices and Express.js conventions
- **Naming**: Use descriptive variable and function names
- **Comments**: Add JSDoc comments for complex functions
- **TypeScript**: TypeScript migration contributions welcome

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
