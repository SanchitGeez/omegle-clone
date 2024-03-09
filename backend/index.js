import express from "express";
import { Server } from "socket.io";
import {createServer} from "http";


const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:['GET','POST'],
        credentials:true
    }
});

const nameToSocketId = new Map();
const socketIdToName = new Map();

io.on("connection", (socket) => {
    console.log("New User , SocketId = ", socket.id);
    socket.on("room-join", data=>{
        console.log(data);
        const {Username} = data;
        nameToSocketId.set(Username, socket.id);
        socketIdToName.set(socket.id,Username);
        io.to(socket.id).emit("room-join",data);
    })
})


app.get('/',(req,res)=>{
    res.send("Server Home")
})

server.listen(3000, () =>{
    console.log("server started on port 3000....")
})