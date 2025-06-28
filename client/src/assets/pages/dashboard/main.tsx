import { useNavigate } from 'react-router-dom';
import { FaRegUser, FaUser } from 'react-icons/fa';
import { Button } from '../../components/button';
import Chat from '../../components/chat';
import { useSocket } from '../../context/socketContext';
import { useEffect, useState } from 'react';
import { socketService } from '../../services/socket/socketService';
import { useUser } from '../../context/UserContext';
import { gameService } from '../../services/GameService/GameService';
import type { AxiosResponse } from 'axios';
import type { Game } from '../../models/Game';
import type { Player } from '../../models/Player';
import { useAlert } from '../../context/AlertContext';
import Alert from '../../components/alert/alert';
import { useMatrix } from '../../context/matrixContext';

export interface chat {
    username:string
    message:string
}

export default function Main(){
    const {visible, setVisible, message, setMessage, type, setType} = useAlert()
    const {matrix, setMatrix} = useMatrix()
    const user = useUser()
    const { socket } = useSocket();
    const navigate = useNavigate();
    const [chatMessage, setChatMessage] = useState<string>('')
    const [messageList, setMessageList] = useState<Array<chat>>(new Array())
    const [gameList, setGameList] = useState<Array<Game>>(new Array())
    const [selectedGame, setSelectedGame] = useState<Game>()

    useEffect(() => {
        if (!socket) return;
        socketService.getChat(socket, setMessageList)
        socketService.getGames(socket, loadGames)
        if(selectedGame) socketService.gameStart(socket, Number(selectedGame.ownerId), (id:number, matrix:number[][]) => saveEnviroment(id, matrix));
        
        // return () => {
        //     socket.off('message');
        // };
        
    }, [socket]);

    const saveEnviroment=(id:number, matrix:number[][])=>{
        navigate(`/dashboard/lobby/game/${id}`)
        setMatrix(matrix)
    }

    useEffect(()=>{
        loadGames()
        const fetchData = async () => {
            try {
                await gameService.getGameByPlayerId(user.user?.id)
                .then((data)=>{
                    setSelectedGame(data.data)
                })
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData();
    }, [])

    const lobbyConnect= async (gameId:number)=>{
        
        await gameService.getGameByPlayerId(user.user?.id)
        .then(async (data:AxiosResponse<Game>)=>{
            if(data.data !== null){
                if(socket) {
                    socketService.emit(socket,"joinGameLobby",{room:`game-${data.data.ownerId}`})
                }
                navigate(`/dashboard/lobby/${data.data.id}`)
            } else {
                await gameService.connectPlayer({gameId: gameId, playerId: user.user?.id} as Player)
                .then((d)=>{
                    if(socket) {
                        socketService.emit(socket,"joinGameLobby",{room:`game-${d.data.ownerId}`})
                    }
                    navigate(`/dashboard/lobby/${gameId}`)
                })
                .catch((error)=>{
                    setVisible(true)
                    setMessage(error.response.data.message)
                    setType(error.response.data.status)
                })
                // .finally(()=>{
                //     if(socket) socketService.emit(socket,"joinMainLobby",{join:"geral"})
                // })
            }
        })
    }

    const loadGames = ()=>{
        gameService.find().then((data:AxiosResponse<Game[]>)=>{
            setGameList(data.data)
        })
    }
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

                    {gameList.map((g:Game, i:number)=>{
                        return (
                            <div key={`game-${i}`} className="w-full border-l-orange-300 border-l-8 bg-white/10 h-26 rounded-[100px] flex ">
                                <div className=" h-26 ml-8 pb-4 w-full flex flex-col justify-center">
                                    <h3 className="text-[1.4rem] font-bold text-orange-200">{g.owner?.username}</h3>
                                    <div className="mt-2 flex gap-1">
                                        {g.players?.map((p:Player, j:number)=>{
                                            return <FaUser key={`playerOn-${j}`} className="text-white" />
                                        })}
                                        {g.playerAmount && g.players && [...Array(g.playerAmount - g.players.length).keys()].map((d:number, j:number)=>{
                                            return <FaRegUser key={`playerOff-${j}`} className="text-white" />
                                        })}
                                    </div>
                                </div>
                                {(selectedGame === null || (selectedGame && selectedGame.id===g.id)) && ( //g.ownerId !== user.user?.id
                                    <div className=" h-26 w-40 mr-8 flex flex-col justify-center">
                                        <Button
                                            variant="dashboard"
                                            className="mt-0 h-12 rounded-[50px]"
                                            onClick={()=>lobbyConnect(g.id)}
                                        >
                                            {selectedGame !== null?"Voltar para a sala":"Entrar na sala"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
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
