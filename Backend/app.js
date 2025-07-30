import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
//socket.io is used for real-time communication or real-time updates // example real-time chat application
//setting the path of env file
dotenv.config()

const app = express();

//middleware

// console.log(process.env.CORS);
app.use(cors(
    {
        origin : `${process.env.FRONTEND_ORIGIN}`,
        credentials: true //allows cookies
    }
));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())

//all routes
import router from "./src/routes/user.route.js";
import taskRoutes from './src/routes/task.routes.js';
import activityRoutes from './src/routes/activity.routes.js'

app.use("/api/auth",router)
app.use('/api/tasks',taskRoutes);
app.use("/api/activities", activityRoutes);
 
//store socket.io instance (will be attached in index.js)
let ioInstance = null;

app.set('setSocketIO',(io)=>{ioInstance=io});
app.set('getSocketIO', ()=> ioInstance);

export {app};