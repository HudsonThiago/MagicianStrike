import type { Socket } from "socket.io-client";
import type { chat } from "../../pages/dashboard/main";
import type { Dispatch, SetStateAction } from "react";
import type { NavigateFunction } from "react-router-dom";

class SocketService {

    emit=(socket:Socket, key:string, value?:any)=>{
        if(value) socket.emit(key, value);
        else socket.emit(key);
    }

    getChat=(socket:Socket, setMessageList:Dispatch<SetStateAction<chat[]>>)=>{
        socket.on("chat", (value:chat) => {
            if(value !== undefined){
                setMessageList((prev) => [...prev, value])
            }
        });
    }

    getGames=(socket:Socket, loadGames: () => void)=>{
        socket.on("getGames", () => {
            loadGames()
        });
    }

    getGame=(socket:Socket, id:number, loadGame: (id:number) => void)=>{
        socket.on("getGame", () => {
            loadGame(id)
        });
    }

    gameStart = (socket: Socket, ownerId: number, saveEnviroment: (id:number, matrix:number[][]) => void) => {
        socket.on("gameStart", (value) => {
            saveEnviroment(ownerId, value.matrix);
        })
    }
}

export const socketService = new SocketService()
