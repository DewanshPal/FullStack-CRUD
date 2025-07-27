import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  } else if (isTomorrow(dateObj)) {
    return 'Tomorrow';
  } else if (isYesterday(dateObj)) {
    return 'Yesterday';
  } else {
    return format(dateObj, 'MMM dd, yyyy');
  }
};

export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm');
};

export const formatTimeAgo = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const formatTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'HH:mm');
};

export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return dateObj < new Date() && !isToday(dateObj);
};

export const getDueDateStatus = (dueDate, status) => {
  if (!dueDate || status === 'completed') return 'normal';
  
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  const now = new Date();
  
  if (dateObj < now && !isToday(dateObj)) {
    return 'overdue';
  } else if (isToday(dateObj)) {
    return 'today';
  } else if (isTomorrow(dateObj)) {
    return 'tomorrow';
  } else {
    return 'normal';
  }
};