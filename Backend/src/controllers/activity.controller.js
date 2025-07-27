import { asyncHandler } from '../utilities/asyncHandler.js';
import Activity from '../models/activity.model.js';

//this is actually a utility function not a controller function beacuse it is not directly interacting with database instead serving to a different controller
 const logActivity = async ({req, userId, taskId, action, description }) => {
    const activity = await Activity.create({
      Assignedby: userId,
      task: taskId,
      action,
      description
    });

    // Emit real-time event via socket.io
    const io = req.app.get('getSocketIO')();
    if (io) {
      try {
        io.to(`user_${userId}`).emit('new-activity', activity);
        console.log(`Emitted new-activity event for user ${userId}`);
      } catch (socketError) {
        console.error('Socket emission error:', socketError);
        // Don't throw error - activity logging should still succeed even if socket fails
      }
    }

    return activity;
  };


 //.populate() is used when you have a reference to another document (like a foreign key in SQL), and you want to automatically fetch the linked document's data.
 const getAllActivities = asyncHandler(async (req, res) => {
  console.log(req.user._id)
    const activities = await Activity.find({ Assignedby: req.user._id }) // or omit for admin
      .populate('task','title description') 
      .sort({ createdAt: -1 });
    console.log(activities);
    res.status(200).json(activities);
  });

   const clearActivities = asyncHandler(async (req, res) => {
    await Activity.deleteMany({ Assignedby: req.user._id });
  
    res.status(200).json({ message: "Activity logs cleared" });
  });
  
export { logActivity,getAllActivities,clearActivities }