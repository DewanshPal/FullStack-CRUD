import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    title : 
    {
        type:String,
        unique:true,
        required:[true,'Task titl is required']
    },
    description : {
        type:String,
        default:'',
        lowercase : true
    },
    status : {
        type : String, 
        enum:['pending' , 'in-progress', 'completed'], 
        default : 'pending',
        required : true
    },
    priority : {
        type : String , 
        enum:['low','medium','high','urgent'],
        default:'medium'
    },
    dueDate : {
        type:Date
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    tags : [
        {
            type:String,
            trim:true
        }
    ]
},{timestamps:true});

const Task = mongoose.model('Task',taskSchema);
export default Task;