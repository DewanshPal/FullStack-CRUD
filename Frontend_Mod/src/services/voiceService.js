class VoiceService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    this.onResult = null;
    this.onError = null;
    this.onStart = null;
    this.onEnd = null;
    

    if (this.isSupported) {
      console.log(this.isSupported);
      this.initializeRecognition();
    }
  }

  initializeRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configuration
    this.recognition.continuous = false;
    this.recognition.interimResults = true; // Enable interim results for better UX
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    // Event handlers
    this.recognition.onstart = () => {
      console.log('Speech recognition started');
      this.isListening = true;
      if (this.onStart) this.onStart();
    };

    this.recognition.onresult = (event) => {
      console.log('Speech recognition result received');
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript && this.onResult) {
        this.onResult(finalTranscript.trim());
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      
      // Handle different error types
      let errorMessage = 'Speech recognition failed';
      switch (event.error) {
        case 'network':
          errorMessage = 'Network error. Please check your internet connection and try again.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone permissions.';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your microphone connection.';
          break;
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service not allowed. Please try again.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      if (this.onError) this.onError(errorMessage);
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended');
      this.isListening = false;
      if (this.onEnd) this.onEnd();
    };

    this.recognition.onnomatch = () => {
      console.log('No speech match found');
      if (this.onError) this.onError('No speech was recognized. Please try again.');
    };
  }

  startListening() {
    if (!this.isSupported) {
      throw new Error('Speech recognition is not supported in this browser');
    }

    if (this.isListening) {
      console.log('Speech recognition is already active');
      return;
    }

    // Check for HTTPS or localhost (required for speech recognition)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      throw new Error('Speech recognition requires HTTPS or localhost');
    }

    try {
      console.log('Starting speech recognition...');
      this.recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      this.isListening = false;
      
      // Handle specific errors
      if (error.name === 'InvalidStateError') {
        // Recognition is already started, stop and restart
        this.recognition.stop();
        setTimeout(() => {
          try {
            this.recognition.start();
          } catch (retryError) {
            throw new Error('Failed to restart speech recognition');
          }
        }, 100);
      } else {
        throw error;
      }
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      console.log('Stopping speech recognition...');
      this.recognition.stop();
    }
  }

  // Request microphone permissions
  async requestMicrophonePermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Close the stream as we just needed to check permissions
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  // Check if microphone is available and permissions are granted
  async checkMicrophoneAccess() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { available: false, error: 'MediaDevices API not supported' };
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      
      if (audioInputs.length === 0) {
        return { available: false, error: 'No microphone found' };
      }

      // Test microphone access
      const hasPermission = await this.requestMicrophonePermission();
      
      return { 
        available: hasPermission, 
        error: hasPermission ? null : 'Microphone permission denied',
        devices: audioInputs.length
      };
    } catch (error) {
      return { available: false, error: error.message };
    }
  }

  setLanguage(lang) {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  // Text-to-Speech functionality
  speak(text, options = {}) {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice options
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      utterance.lang = options.lang || 'en-US';

      // Set voice if available
      if (options.voice) {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => voice.name === options.voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      // Event handlers
      if (options.onStart) utterance.onstart = options.onStart;
      if (options.onEnd) utterance.onend = options.onEnd;
      if (options.onError) utterance.onerror = options.onError;

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis is not supported in this browser');
    }
  }

  // Get available voices
  getVoices() {
    if ('speechSynthesis' in window) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  }

  // Stop any ongoing speech
  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Check if browser supports speech recognition
  isSpeechRecognitionSupported() {
    return this.isSupported;
  }

  // Check if browser supports speech synthesis
  isSpeechSynthesisSupported() {
    return 'speechSynthesis' in window;
  }

  // Voice command patterns for task management
  parseVoiceCommand(transcript) {
    const command = transcript.toLowerCase().trim();
    
    // Create task patterns
    //first ex: create a new task: "Create a new task to finish the report"
    //second ex: create a task: "add the finish report"
    //third ex: create task: "task laundary"
    const createPatterns = [
      /^(create|add|new)\s+task\s+(.+)$/i,
      /^(create|add|new)\s+(.+)$/i,
      /^task\s+(.+)$/i
    ];

    // View/List task patterns
    //Match variants like "show all tasks", "list pending tasks", "what tasks do I have", etc.
    const viewPatterns = [
      /^(show|list|view|get)\s+(all\s+)?tasks?$/i,
      /^(show|list|view|get)\s+(pending|completed|in.progress)\s+tasks?$/i,
      /^what\s+tasks?\s+do\s+i\s+have$/i
    ];

    // Update task patterns
    //Rename, mark as complete, etc.
    //Match variants like "update task groceries", "mark report as completed"
    const updatePatterns = [
      /^(update|edit|change|modify)\s+task\s+(.+)$/i,
      /^(complete|finish|done)\s+task\s+(.+)$/i,
      /^mark\s+(.+)\s+as\s+(completed|done|finished)$/i
    ];

    // Delete task patterns
    //Match variants like "delete task groceries", "remove report"
    const deletePatterns = [
      /^(delete|remove)\s+task\s+(.+)$/i,
      /^(delete|remove)\s+(.+)$/i
    ];

    // Status/Priority patterns
    //Match variants like "urgent task", "high priority task", etc.
    const priorityPatterns = [
      /^(urgent|high|important|critical)/i,
      /^(low|minor)/i
    ];

    // Time patterns
    const timePatterns = [
      /today|tomorrow|this\s+week|next\s+week/i
    ];

    // Parse create commands
    for (const pattern of createPatterns) {
      const match = command.match(pattern);
      if (match) {
        return {
          action: 'create',
          taskTitle: match[2] || match[1],
          originalCommand: transcript
        };
      }
    }

    // Parse view commands
    for (const pattern of viewPatterns) {
      const match = command.match(pattern);
      if (match) {
        const filter = match[2] ? match[2].replace(/\s+/g, '-') : null;
        return {
          action: 'view',
          filter: filter,
          originalCommand: transcript
        };
      }
    }

    // Parse update commands
    for (const pattern of updatePatterns) {
      const match = command.match(pattern);
      if (match) {
        return {
          action: 'update',
          taskTitle: match[2] || match[1],
          status: command.includes('complete') || command.includes('done') ? 'completed' : null,
          originalCommand: transcript
        };
      }
    }

    // Parse delete commands
    for (const pattern of deletePatterns) {
      const match = command.match(pattern);
      if (match) {
        return {
          action: 'delete',
          taskTitle: match[2] || match[1],
          originalCommand: transcript
        };
      }
    }

    // Default to AI processing if no specific pattern matches
    return {
      action: 'ai_process',
      command: transcript,
      originalCommand: transcript
    };
  }

  // Convert voice command to task operation
  voiceCommandToTask(parsedCommand) {
    const { action, taskTitle, filter, status } = parsedCommand;

    switch (action) {
      case 'create':
        return {
          operation: 'create',
          data: {
            title: taskTitle,
            description: '',
            status: 'pending',
            priority: 'medium'
          }
        };

      case 'view':
        return {
          operation: 'filter',
          data: { status: filter }
        };

      case 'update':
        return {
          operation: 'update',
          data: { status: status || 'in-progress' },
          searchTitle: taskTitle
        };

      case 'delete':
        return {
          operation: 'delete',
          searchTitle: taskTitle
        };

      default:
        return {
          operation: 'ai_process',
          data: parsedCommand
        };
    }
  }
}

export const voiceService = new VoiceService();
