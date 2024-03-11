import React from 'react'
import { useEffect,useCallback,useState} from 'react'
import ReactPlayer from 'react-player';
import { useSocket } from '../context/SocketProvider'
import peer from '../service/peer';

const Room = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream , setRemoteStream] = useState();

    const handleUserJoined = useCallback(async ({Username,id}) => {
        console.log("New User Joined:",Username);
        await setRemoteSocketId(id);
      },
      [])
    

    const handleCallUser = useCallback(async() => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true
        });
        const offer = await peer.getOffer();
        socket.emit("user-call",{to: remoteSocketId, offer });
        setMyStream(stream);
    },[remoteSocketId, socket])

    const handleIncommingCall = useCallback(async ({from,offer}) => {
        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true
        });
        setMyStream(stream);
        console.log("Incomming call",from,offer);
        const ans = await peer.getAnswer(offer);
        socket.emit("call-accepted",{to:from , ans});
      },
      [])
    
    const handleCallAccepted = useCallback(async({from,ans}) => {
        await peer.setLocalDescription(ans);
        console.log("Call Accepted!");
        for(const track of myStream.getTracks()){
            peer.peer.addTrack(track,myStream)
        }
      },[myStream]);
    

    useEffect(()=>{
        peer.peer.addEventListener('track',async ev =>{
            const remoteStream = ev.streams;
            setRemoteStream(remoteStream);
        })
    },[])

    useEffect(()=>{
        socket.on("user-joined", handleUserJoined);
        socket.on("incomming-call", handleIncommingCall);
        socket.on("call-accepted",handleCallAccepted);
        return () =>{
            socket.off("user-joined", handleUserJoined);
            socket.off("incomming-call", handleIncommingCall);
            socket.off("call-accepted",handleCallAccepted);
        }
    },[socket, handleUserJoined,handleIncommingCall,handleCallAccepted])


    return (
    <div>
        Room
        <h4>{remoteSocketId?"other people exist":"no one in room"}</h4>
        {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
        {
            myStream && <ReactPlayer url={myStream} width="300px" height="300px" playing muted/>
        }
        {
            remoteStream && <ReactPlayer url={remoteStream} width="300px" height="300px" playing muted/>
        }
    </div>
    )
}

export default Room