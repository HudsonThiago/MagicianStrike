import type { Socket } from "socket.io-client";
import type { chat } from "../../pages/dashboard/main";
import type { Dispatch, SetStateAction } from "react";

class SocketService {

    emit=(socket:Socket, key:string, value:any)=>{
        socket.emit(key, value);
    }

    getChat=(socket:Socket, setMessageList:Dispatch<SetStateAction<chat[]>>)=>{
        socket.on("chat", (value:chat) => {
            if(value !== undefined){
                setMessageList((prev) => [...prev, value])
            }
        });
    }
}

export const socketService = new SocketService()
