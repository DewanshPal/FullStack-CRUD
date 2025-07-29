import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Clock, 
  AlertTriangle, 
  Target, 
  TrendingUp,
  X
} from 'lucide-react';
import { useAI } from '../../context/AIContext';

const SmartSuggestions = ({ className = '' }) => {
  const { smartSuggestions, sendChatMessage } = useAI();

  if (!smartSuggestions || smartSuggestions.length === 0) {
    return null;
  }

  const getIconForType = (type) => {
    switch (type) {
      case 'priority':
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'deadline':
        return <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'organization':
        return <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'productivity':
        return <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />;
      default:
        return <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
    }
  };

  const getBgColorForType = (type) => {
    switch (type) {
      case 'priority':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30';
      case 'deadline':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30';
      case 'organization':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30';
      case 'productivity':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30';
      default:
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30';
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    if (suggestion.actionable) {
      await sendChatMessage(`Help me with: ${suggestion.title}`);
    }
  };

  return (
    <motion.div 
      className={`space-y-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Lightbulb className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          🧠 Smart Suggestions
        </h3>
      </div>

      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {smartSuggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${getBgColorForType(suggestion.type)}`}
              onClick={() => handleSuggestionClick(suggestion)}
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              whileHover={{ 
                scale: 1.02, 
                x: 5,
                transition: { duration: 0.2 }
              }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              layout
            >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIconForType(suggestion.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {suggestion.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {suggestion.description}
                </p>
                {suggestion.actionable && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 border border-primary-200 dark:border-primary-700">
                      Click to get help
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>

      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          💡 These suggestions are generated based on your task patterns and productivity insights.
        </p>
      </div>
    </motion.div>
  );
};

export default SmartSuggestions;
