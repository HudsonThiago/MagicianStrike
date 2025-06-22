import { useNavigate } from 'react-router-dom';
import { FaRegUser, FaUser } from 'react-icons/fa';
import { Button } from '../../components/button';
import Chat from '../../components/chat';
import { useSocket } from '../../context/socketContext';
import { useEffect, useState } from 'react';
import { socketService } from '../../services/socket/socketService';
import { useUser } from '../../context/UserContext';

export interface chat {
    username:string
    message:string
}

export default function Main(){
    const user = useUser()
    const { socket, isConnected } = useSocket();
    const navigate = useNavigate();
    const [chatMessage, setChatMessage] = useState<string>('')
    const [messageList, setMessageList] = useState<Array<chat>>(new Array())

    useEffect(() => {
        if (!socket) return;

        socketService.emit(socket,"joinMainLobby",{join:"geral"})

        socketService.getChat(socket, setMessageList)

        // return () => {
        //     socket.off('message');
        // };
        
    }, [socket]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if(socket && chatMessage.trim() !== '') {
                socketService.emit(socket,"sendMessage",{username: user.user?.username, message:chatMessage})
                setChatMessage('')
                setTimeout(()=>{
                    const chatContent = document.getElementById("chatContent")
                    if(chatContent){
                        chatContent.scrollTop = chatContent.scrollHeight + 100
                    }
                }, 100)
            }
        }
    };

    return (
        <>
            <div className=" w-[60%] ml-20 mr-20 flex flex-col">
                <h1 className="font-bold text-white text-[1.6rem]">DashBoard</h1>
                <div className="my-8 pr-4 h-[80%] flex flex-col gap-4 overflow-auto max-h-full overflow-y-auto [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar]:w-2.5 dark:[&::-webkit-scrollbar-track]:bg-white/5 dark:[&::-webkit-scrollbar-thumb]:bg-white">

                    <div className="w-full border-l-orange-300 border-l-8 bg-white/10 h-26 rounded-[100px] flex ">
                        <div className=" h-26 ml-8 pb-4 w-full flex flex-col justify-center">
                            <h3 className="text-[1.4rem] font-bold text-orange-200">Username</h3>
                            <div className="mt-2 flex gap-1">
                                <FaUser className="text-white" />
                                <FaUser className="text-white" />
                                <FaUser className="text-white" />
                                <FaRegUser className="text-white" />
                            </div>
                        </div>
                        <div className=" h-26 w-40 mr-8 flex flex-col justify-center">
                            <Button variant="dashboard" className="mt-0 h-12 rounded-[50px]">
                                Entrar na partida
                            </Button>
                        </div>
                    </div>
                    
                    <div className="w-full border-l-orange-300 border-l-8 bg-white/10 h-26 rounded-[100px] flex ">
                        <div className=" h-26 ml-8 pb-4 w-full flex flex-col justify-center">
                            <h3 className="text-[1.4rem] font-bold text-orange-200">Username</h3>
                            <div className="mt-2 flex gap-1">
                                <FaUser className="text-white" />
                                <FaRegUser className="text-white" />
                                <FaRegUser className="text-white" />
                                <FaRegUser className="text-white" />
                            </div>
                        </div>
                        <div className=" h-26 w-40 mr-8 flex flex-col justify-center">
                            <Button variant="dashboard" className="mt-0 h-12 rounded-[50px]">
                                Entrar na partida
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" w-[40%] mr-20 flex flex-col">
                <h1 className="font-bold text-white text-[1.6rem]">Chat</h1>
                <div className="mt-8 mb-8 flex flex-col h-[80%]">
                    <div className="w-full h-full bg-gradient-to-t from-white/10 to-95% to-white/0 mb-4 rounded-[20px] p-4 flex flex-col-reverse">
                        <div id="chatContent" className='w-full max-h-full flex flex-col gap-4 overflow-y-auto'>
                            {messageList.map((c:chat, i:number)=>{
                                return <Chat key={`msg-${i}`} username={c.username} msg={c.message} owner={c.username===user.user?.username?true:false}/>
                            })}
                        </div>
                    </div>
                    <div className="w-full">
                        <input
                            className=" rounded-[50px] border-0 p-2 px-4 w-full h-10 bg-white/20 text-white"
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
