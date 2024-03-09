import React from 'react'
import { useState, useCallback,useEffect } from 'react';   
import "./Lobby.css"
import { useSocket } from '../context/SocketProvider';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {
    const socket = useSocket();
    const navigate = useNavigate(); 
    const [Username, setUsername] = useState("");

    const handleJoin = useCallback((e) =>{
        e.preventDefault();
        socket.emit("room-join",{Username})
    },[Username,socket])

    const handleJoinRoom = useCallback((data)=>{
        const {Username} = data;
        console.log(Username);
        navigate("/room")
    },[])

    useEffect(() => {
        socket.on("room-join", handleJoinRoom);
        return ()=>{
            socket.off("room-join",handleJoinRoom);
        }
    }, [socket, handleJoinRoom])
    
    return (
    <>
        <h1>LOBBY</h1>
        <form onSubmit={handleJoin}>
            <input type="text" placeholder='Enter Username' value={Username} onChange={(e)=>{setUsername(e.target.value)}}/>
            <button type='submit'>JOIN</button>
        </form>
    </>
    )
}

export default Lobby