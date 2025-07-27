import mongoose from "mongoose";

const activityLog = mongoose.Schema({
    task:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Task',
        required:false //not every activity must be task-related
    },
    description:{
        type:String,
        required:true
    },
    action:
    {
        type: String,
        required:true,
        enum:['created','updated','deleted','completed','logged_in','logged_out','custom']
    },
    Assignedby:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true});

const Activity = mongoose.model('Activity',activityLog)
export default Activity;