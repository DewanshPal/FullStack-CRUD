import {app} from "./app.js"
import connect_db from "./src/db/db.js";
import http from "http";
import {Server} from "socket.io"
import bcrypt from "bcryptjs";
//getting the PORT
const PORT = process.env.PORT || 8000;
console.log('Server will run on port:', PORT)
//create a http server(needed for socket.io)
const server  = http.createServer(app);

//setup socket.io server

const io  = new Server(server,{
    cors: {
        origin:"https://full-stack-crud-hudg-rf1mh40px-dewanshpals-projects.vercel.app",//frontend
        methods: ["GET","POST", "PUT", "DELETE"],
        credentials:true
    },
    transports: ['polling', 'websocket'], // Start with polling first
    allowEIO3: true
});

//handle socket connection

//1.A new socket is created when a client (browser/app) connects to your server.This socket stays alive — like a phone call between the client and server.
//2. Database Changes
//If someone adds a new message or updates data in the DB, your server should:Detect the DB change Use the existing socket(s) to emit updates to connected clients You don’t create a new socket for each change — instead, you use the existing socket.
//3.Only when the client leaves, closes the browser, or loses internet, the socket is disconnected.


io.on("connection",(socket) =>{
    console.log("Client connected:",socket.id);

    // Handle user joining their personal room
    socket.on('join-user-room', (userId) => {
        if (userId) {
            socket.join(`user_${userId}`);
            console.log(`✅ User ${userId} joined room user_${userId} with socket ${socket.id}`);
            
            // Send confirmation back to client
            socket.emit('room-joined', { userId, room: `user_${userId}` });
        } else {
            console.error('❌ No userId provided for room join');
        }
    });

    // Handle disconnection
    socket.on("disconnect",(reason)=>{
        console.log("Client disconnected:",socket.id, "Reason:", reason);
    });

    // Handle connection errors
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
})

//connecting db
connect_db().
then(()=>{

    app.set('setSocketIO')(io); // Inject io into app

    server.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🌐 Frontend should connect to: http://localhost:${PORT}`);
    });
  
    server.on("error", (error) => {
      console.error("Server Error:", error);
      throw error;
    });
}).catch((error)=>{
    console.log("MongoDB connection failed!!" , error)
})




