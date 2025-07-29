import { GoogleGenAI } from "@google/genai";
import { taskService } from './taskService';
import { TASK_STATUS, TASK_PRIORITY } from '../utils/taskUtils';

// Initialize Gemini AI with new @google/genai package
// console.log(import.meta.env.example.VITE_GEMINI_API_KEY)
const ai = new GoogleGenAI({
  apiKey: "AIzaSyD5SGlWvLV44raPg-Jbepk8P_Wz54OeEK4"
});

class AIService {
  constructor() {
    this.ai = ai;
    this.conversationHistory = [];
  }

  // System prompt to give context about the task manager
  getSystemPrompt() {
    return `You are a smart personal assistant for a task management application. You can help users:

1. CREATE tasks with title, description, status, priority, and due date
2. VIEW/LIST existing tasks with optional filters
3. UPDATE/EDIT tasks (change title, description, status, priority, due date)
4. DELETE tasks
5. ANALYZE task patterns and provide insights
6. SUGGEST task optimizations and productivity tips

Task Status Options: ${Object.values(TASK_STATUS).join(', ')}
Task Priority Options: ${Object.values(TASK_PRIORITY).join(', ')}

When responding to user requests:
- Be concise and helpful
- For task operations, return a structured JSON response with action type and parameters
- For general queries, provide helpful suggestions
- Always confirm actions before executing them
- Be proactive in suggesting improvements

Current date: ${new Date().toISOString().split('T')[0]}

Respond in JSON format for actionable requests:
{
  "action": "create|view|update|delete|analyze|chat",
  "parameters": {...},
  "message": "Human-readable response",
  "confirmation_needed": boolean
}`;
  }

  // Parse and execute AI commands
  async processCommand(userInput, currentTasks = []) {
    try {
      const systemPrompt = this.getSystemPrompt();
      const contextPrompt = `Current tasks count: ${currentTasks.length}
Recent tasks: ${JSON.stringify(currentTasks.slice(0, 3), null, 2)}

User request: "${userInput}"

Please analyze this request and provide a structured response.`;

      const response = await this.ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `${systemPrompt}\n\n${contextPrompt}`,
      });
      
      const text = response.text;

      // Try to parse JSON response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.warn('Failed to parse AI response as JSON:', parseError);
      }

      // Fallback to text response
      return {
        action: 'chat',
        message: text,
        confirmation_needed: false
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        action: 'error',
        message: 'Sorry, I encountered an error processing your request. Please try again.',
        error: error.message
      };
    }
  }

  // Smart task suggestions based on user behavior
  async getSmartSuggestions(tasks, recentActivities = []) {
    try {
      const prompt = `Based on the following task data, provide 2-4 smart suggestions to improve productivity:

Tasks: ${JSON.stringify(tasks, null, 2)}
Recent Activities: ${JSON.stringify(recentActivities, null, 2)}

Focus on:
1. Overdue tasks that need attention
2. Task prioritization improvements
3. Time management suggestions
4. Pattern recognition in task completion
5. Workload balancing

Return a JSON array of suggestions:
[
  {
    "type": "priority|deadline|organization|productivity",
    "title": "Short suggestion title",
    "description": "Detailed explanation",
    "actionable": true/false
  }
]`;

      const response = await this.ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });
      
      const text = response.text;

      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.warn('Failed to parse suggestions:', parseError);
      }

      return [];
    } catch (error) {
      console.error('Smart Suggestions Error:', error);
      return [];
    }
  }

  // Execute task operations based on AI commands
  async executeTaskOperation(aiResponse, tasks) {
    const { action, parameters } = aiResponse;

    try {
      switch (action) {
        case 'create':
          return await taskService.createTask(parameters);

        case 'update':
          const { taskId, ...updateData } = parameters;
          return await taskService.updateTask(taskId, updateData);

        case 'delete':
          return await taskService.deleteTask(parameters.taskId);

        case 'view':
          // Filter tasks based on parameters
          return this.filterTasks(tasks, parameters);

        case 'analyze':
          return this.analyzeTasks(tasks);

        default:
          return { success: false, message: 'Unknown action' };
      }
    } catch (error) {
      console.error('Task Operation Error:', error);
      return { success: false, message: error.message };
    }
  }

  // Filter tasks based on AI parameters
  filterTasks(tasks, filters) {
    let filteredTasks = [...tasks];

    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => 
        task.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.priority) {
      filteredTasks = filteredTasks.filter(task => 
        task.priority.toLowerCase() === filters.priority.toLowerCase()
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.dueToday) {
      const today = new Date().toISOString().split('T')[0];
      filteredTasks = filteredTasks.filter(task => 
        task.dueDate && task.dueDate.split('T')[0] === today
      );
    }

    if (filters.overdue) {
      const now = new Date();
      filteredTasks = filteredTasks.filter(task => 
        task.dueDate && new Date(task.dueDate) < now && task.status !== 'completed'
      );
    }

    return {
      success: true,
      tasks: filteredTasks,
      count: filteredTasks.length
    };
  }

  // Analyze tasks and provide insights
  analyzeTasks(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    
    const now = new Date();
    const overdue = tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed'
    ).length;

    const priorityBreakdown = {
      urgent: tasks.filter(t => t.priority === 'urgent').length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    };

    const insights = [];

    if (overdue > 0) {
      insights.push(`You have ${overdue} overdue task${overdue > 1 ? 's' : ''} that need immediate attention.`);
    }

    if (pending > inProgress) {
      insights.push(`Consider starting some of your ${pending} pending tasks to maintain momentum.`);
    }

    if (priorityBreakdown.urgent > 0) {
      insights.push(`Focus on your ${priorityBreakdown.urgent} urgent task${priorityBreakdown.urgent > 1 ? 's' : ''} first.`);
    }

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    insights.push(`Your current completion rate is ${completionRate}%.`);

    return {
      success: true,
      analytics: {
        total,
        completed,
        pending,
        inProgress,
        overdue,
        completionRate,
        priorityBreakdown
      },
      insights
    };
  }

  // Parse natural language task input
  parseTaskFromNaturalLanguage(input) {
    const taskData = {
      title: '',
      description: '',
      priority: TASK_PRIORITY.MEDIUM,
      status: TASK_STATUS.TODO,
      dueDate: null
    };

    // Extract title (first part of the input)
    const words = input.split(' ');
    taskData.title = input;

    // Priority keywords
    const priorityKeywords = {
      urgent: ['urgent', 'asap', 'emergency', 'critical'],
      high: ['high', 'important', 'priority'],
      low: ['low', 'minor', 'whenever']
    };

    for (const [priority, keywords] of Object.entries(priorityKeywords)) {
      if (keywords.some(keyword => input.toLowerCase().includes(keyword))) {
        taskData.priority = priority;
        break;
      }
    }

    // Due date extraction (basic)
    if (input.toLowerCase().includes('today')) {
      taskData.dueDate = new Date().toISOString().split('T')[0];
    } else if (input.toLowerCase().includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      taskData.dueDate = tomorrow.toISOString().split('T')[0];
    }

    return taskData;
  }
}

export const aiService = new AIService();
