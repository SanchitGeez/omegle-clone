 import React,{createContext, useContext, useMemo} from 'react'
import {io} from 'socket.io-client'


const SocketContext = createContext(null);


//whenever we want to create new socket use this wrapper method
export const useSocket = () =>{
    const socket = useContext(SocketContext);
    return socket;
}


export const SocketProvider = (props) =>{

    const socket = useMemo(() => io("http://localhost:3000"),[]);

    return(
        <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>
    )
}