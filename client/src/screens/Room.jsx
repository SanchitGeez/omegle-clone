import React from 'react'
import { useEffect,useCallback,useState} from 'react'
import { useSocket } from '../context/SocketProvider'

const Room = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null)
    const handleUserJoined = useCallback(({Username,id}) => {
        console.log("New User Joined:",Username);
        setRemoteSocketId(id);
      },
      [])
    

    useEffect(()=>{
        socket.on("user-joined", handleUserJoined);

        return () =>{
            socket.off("user-joined", handleUserJoined);
        }
    },[socket, handleUserJoined])


    return (
    <div>
        Room
        <h4>{remoteSocketId?"other people exist":"no one in room"}</h4>
    </div>
    )
}

export default Room