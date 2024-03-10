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

    //new user joins
    console.log("New User , SocketId = ", socket.id);

    //user clicks join button
    socket.on("room-join", data=>{

        //extract data
        console.log(data);
        const {Username} = data;
        //create map
        nameToSocketId.set(Username, socket.id);
        socketIdToName.set(socket.id,Username);

        io.to("roomid").emit("user-joined", {Username, id:socket.id})
        socket.join("roomid")


        io.to(socket.id).emit("room-join",data);
    })
})


app.get('/',(req,res)=>{
    res.send("Server Home")
})

server.listen(4000, () =>{
    console.log("server started on port 4000....")
})