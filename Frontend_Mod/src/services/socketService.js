import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.userId = null;
    this.isConnecting = false;
  }

  connect(userId) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    if (this.isConnecting) {
      console.log('Connection already in progress');
      return;
    }

    this.isConnecting = true;
    this.userId = userId;

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';
    console.log('🔌 Connecting to socket server:', SOCKET_URL);
    
    // Disconnect existing socket if any
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    try {
      this.socket = io(SOCKET_URL, {
        auth: {
          token: localStorage.getItem('token'),
          userId: userId,
        },
        transports: ['polling', 'websocket'], // Start with polling first
        upgrade: true,
        rememberUpgrade: false,
        timeout: 20000,
        forceNew: true
      });

      this.setupEventHandlers();
    } catch (error) {
      console.error('❌ Error creating socket connection:', error);
      this.isConnecting = false;
    }
  }

  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to server with socket ID:', this.socket.id);
      this.isConnecting = false;
      
      // Join user room for personalized updates
      if (this.userId) {
        try {
          this.socket.emit('join-user-room', this.userId);
          console.log(`📡 Requested to join user room: user_${this.userId}`);
        } catch (error) {
          console.error('❌ Error joining user room:', error);
        }
      }
    });

    this.socket.on('room-joined', (data) => {
      console.log('✅ Successfully joined room:', data);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
      this.isConnecting = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message);
      this.isConnecting = false;
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
      // Re-join user room on reconnection
      if (this.userId) {
        try {
          this.socket.emit('join-user-room', this.userId);
          console.log(`📡 Rejoined user room: user_${this.userId}`);
        } catch (error) {
          console.error('❌ Error rejoining user room:', error);
        }
      }
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error.message);
    });

    // Task event handlers
    this.socket.on('task-create', (task) => {
      console.log('📋 Received task-create event:', task);
    });

    this.socket.on('task-update', (task) => {
      console.log('📋 Received task-update event:', task);
    });

    this.socket.on('task-delete', (taskId) => {
      console.log('📋 Received task-delete event:', taskId);
    });

    this.socket.on('new-activity', (activity) => {
      console.log('📝 Received new-activity event:', activity);
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket');
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
    this.userId = null;
    this.isConnecting = false;
  }

  // Activity-related events
  onActivityUpdate(callback) {
    this.on('activity-update', callback);
  }

  onNewActivity(callback) {
    this.on('new-activity', callback);
  }

  // Task-related events
  onTaskUpdate(callback) {
    this.on('task-update', callback);
  }

  onTaskCreate(callback) {
    this.on('task-create', callback);
  }

  onTaskDelete(callback) {
    this.on('task-delete', callback);
  }

  // Generic event listener
  on(event, callback) {
    if (!this.socket) {
      console.warn('⚠️ Socket not initialized for event:', event);
      return;
    }

    console.log('👂 Setting up listener for:', event);
    this.socket.on(event, callback);
    
    // Store listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (!this.socket) return;

    if (callback) {
      this.socket.off(event, callback);
      
      // Remove from stored listeners
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(callback);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    } else {
      // Remove all listeners for this event
      this.socket.off(event);
      this.listeners.delete(event);
    }
  }

  // Emit events
  emit(event, data) {
    if (this.socket?.connected) {
      console.log('📡 Emitting event:', event, data);
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ Cannot emit event - socket not connected:', event);
    }
  }

  // Check connection status
  isConnected() {
    return this.socket?.connected || false;
  }
}

export default new SocketService();