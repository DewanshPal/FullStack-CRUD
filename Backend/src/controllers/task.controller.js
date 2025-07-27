import Task from "../models/task.model.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { logActivity } from "./activity.controller.js";
//create a task
const createTask = asyncHandler(async(req,res)=>{
    const {title,description,status,priority,dueDate} = req.body;

    const task = await Task.create({
        title,
        description,
        status,
        priority,
        dueDate,
        owner : req.user._id
    });

    // Emit real-time event for task creation
    const io = req.app.get('getSocketIO')();
    if (io) {
        try {
            io.to(`user_${req.user._id}`).emit('task-create', task);
            console.log(`Emitted task-create event for user ${req.user._id}`);
        } catch (socketError) {
            console.error('Socket emission error:', socketError);
        }
    }

    return res.status(201).json(task);
});

const getAllTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { status, priority, search } = req.query;

  // Build the query object
  const query = { owner: userId };

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const tasks = await Task.find(query).sort({ createdAt: -1 });

  return res.status(200).json({ tasks: tasks });
})

const getTaskById = asyncHandler(async(req,res)=>
{
    const userId = req.user._id;
    const taskId = req.params.id;
    console.log(taskId);
    
    const task = await Task.findById(taskId);
    console.log(task);
    
    if(!task)
    {
        res.status(404);
        throw new Error('Task not found');
    }

    if(task.owner.toString() !== userId.toString())
    {
        res.status(403);
        throw new Error('Not authorized to access the task')
    }

    res.status(200).json(task);
});

//updating and deleting the task will create the activity log in database
const updateTask = asyncHandler(async(req,res)=>
{
    const {title , description , status, priority} = req.body
    const taskId = req.params.id;
    console.log(taskId);
    const task = await Task.findById(taskId)
    console.log(task);
    if(!task)
    {
        res.status(403)
        throw new Error(403,"Task not found")
    }

    // Define field mappings for cleaner updates and logging
    const fieldUpdates = {
        title: { oldValue: task.title, newValue: title },
        description: { oldValue: task.description, newValue: description },
        status: { oldValue: task.status, newValue: status },
        priority: { oldValue: task.priority, newValue: priority }
    };

    // Track changes and update task
    const changes = [];
    Object.entries(fieldUpdates).forEach(([field, { oldValue, newValue }]) => {
        // Only update if newValue is provided and different from oldValue
        if (newValue !== undefined && newValue !== null && oldValue !== newValue) {
            changes.push(`${field} from "${oldValue}" to "${newValue}"`);
            task[field] = newValue;
        }
    });
    
    console.log('Task after update:', task.toObject());

    await task.save({validateBeforeSave:false})

    // Log activity only if there were changes
    if (changes.length > 0) {
        const description = `Updated task's ${changes.join(', ')}`;
        await logActivity({
            req,
            userId: req.user._id,
            taskId: task._id,
            action: 'updated',
            description: description
        });
    }

    // Emit real-time event for task update
    const io = req.app.get('getSocketIO')();
    if (io) {
        try {
            io.to(`user_${req.user._id}`).emit('task-update', task);
            console.log(`Emitted task-update event for user ${req.user._id}`);
        } catch (socketError) {
            console.error('Socket emission error:', socketError);
        }
    }
      
    return res.status(200).json({
        message: "Task Updated Successfully",
        task: task
    })
})

const deleteTask = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const taskId = req.params.id;
  
    const task = await Task.findById(taskId);
  
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }
  
    if (task.owner.toString() !== userId.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this task");
    }
  
    await task.deleteOne();
    
    await logActivity({
      req,
      userId: req.user._id,
      taskId: task._id,
      action: "deleted",
      description: `Deleted task titled "${task.title}"`,
    });

    // Emit real-time event for task deletion
    const io = req.app.get('getSocketIO')();
    if (io) {
        try {
            io.to(`user_${req.user._id}`).emit('task-delete', task._id);
            console.log(`Emitted task-delete event for user ${req.user._id}`);
        } catch (socketError) {
            console.error('Socket emission error:', socketError);
            // Don't throw error - deletion should still succeed even if socket fails
        }
    }
  
    return res.status(200).json({ message: "Task Deleted Successfully" });
  });  

//aggregate data pipelines $lookup(for join) , $addfields , $project()
const getTaskStats = asyncHandler(async(req, res)=>{
    const userId = req.user._id;

    const stats = await Task.aggregate([

        //only this users tasks
        {$match : {owner: userId}},
        //group by count
        // {
        //     $group:
        //     {
        //         _id:'$status',
        //         count:{
        //             $sum:1
        //         }
        //     }
        // },
        {
            $facet: {
                totalCounts: [
                    {
                        $group: {
                            _id: null , //null means we are not grouping by any field
                            count: { $sum: 1 },
                        },
                    },
                ],
                statusCounts: [
                    {
                        $group: {
                            _id: '$status',
                            count: { $sum: 1 },
                        },
                    },
                ],
                priorityCounts: [
                    {
                        $group: {
                            _id: '$priority',
                            count: { $sum: 1 },
                        },
                    },
                ],
            },
        },

        //sort in descending order
        {$sort:{count:-1}} //-1 means descending order
    ]);

    if(!stats?.length)
    {
        return res.status(404).json({message:"No Task Stats available"})
    }
    
    // Format the response to match frontend expectations
    const result = stats[0];
    const statusCounts = result.statusCounts || [];
    const totalCounts = result.totalCounts || [];
    
    // Initialize counters
    let completed = 0;
    let inProgress = 0;
    let pending = 0;
    let overdue = 0;
    
    // Count by status
    statusCounts.forEach(status => {
        if (status._id === 'completed') completed = status.count;
        else if (status._id === 'in-progress') inProgress = status.count;
        else if (status._id === 'pending') pending = status.count;
    });
    
    // Calculate overdue tasks (you may need to adjust this logic)
    const currentDate = new Date();
    const overdueTasks = await Task.countDocuments({
        owner: userId,
        status: { $ne: 'completed' },
        dueDate: { $lt: currentDate }
    });
    
    const formattedStats = {
        total: totalCounts[0]?.count || 0,
        completed,
        inProgress,
        pending,
        overdue: overdueTasks
    };
    
    return res.status(200).json(formattedStats);
    
})

//a pipeline for the upcoming due tasks for next 7 days
const getUpcomingTasks = asyncHandler(async (req , res) =>{
    const today = new Date();
    const nextweek = new Date();
    nextweek.setDate(today.getDate() + 7);

    const tasks = await Task.aggregate([
        {$match:
            {
                owner : req.user._id,
                status:{$ne : "completed"},
                dueDate : {$gte:today,$lte:nextweek}
            }
        },
        {
            $sort:{dueDate:1}
        },
        {
            $project:{
                title:1,
                dueDate : 1,
                status: 1,
                priority: 1,
                // Exclude _id field
                _id: 0
            }
        }
    ]);

    if(!tasks?.length)
    {
       return res.status(200).json({ tasks: [], message:"No Tasks Due"})
    }

    return res.status(200).json({ tasks: tasks })
})


export {createTask , updateTask , deleteTask , getAllTasks , getTaskById , getTaskStats , getUpcomingTasks}