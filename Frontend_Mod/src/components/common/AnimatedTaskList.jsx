import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedTaskList = ({ 
  children, 
  className = "space-y-4",
  staggerChildren = 0.1 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {children}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnimatedTaskList;
