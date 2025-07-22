import { useNavigate, useParams } from 'react-router-dom';
import LobbyCard from '../../components/lobbyCard';
import { useUser } from '../../context/UserContext';
import { useEffect, useState } from 'react';
import { useSocket } from '../../context/socketContext';
import { Button } from '../../components/button';
import { gameService } from '../../services/GameService/GameService';
import type { Player } from '../../models/Player';
import type { Game } from '../../models/Game';
import type { AxiosResponse } from 'axios';
import { socketService } from '../../services/socket/socketService';
import { useAlert } from '../../context/AlertContext';
import { useMatrix } from '../../context/matrixContext';

export default function Main(){
    
    const {visible, setVisible, message, setMessage, type, setType} = useAlert()
    const {matrix, setMatrix} = useMatrix()
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useUser();
    const { socket } = useSocket();
    const [game, setGame] = useState<Game>()

    useEffect(() => {
        if (!socket) return;
        if(!isNaN(Number(id))) {
            loadGame(Number(id))
            socketService.getGame(socket, Number(id), ()=>loadGame(Number(id)))
            socketService.gameStart(socket, Number(id), (id:number, matrix:number[][]) => saveEnviroment(id, matrix));
        }
    }, [socket]);

    useEffect(()=>{
        gameService.findById(Number(id))
        .then((data:AxiosResponse<Game>)=>{
            setGame(data.data)
            if(socket) socketService.emit(socket,"joinGameLobby",{room:`game-${data.data.ownerId}`})
        })
    }, [])

    const saveEnviroment=(id:number, matrix:number[][])=>{
        gameService.updateMatrix(Number(id), {matrix: JSON.stringify(matrix)})
        navigate(`/dashboard/lobby/game/${id}`)
        setMatrix(matrix)
    }

    const loadGame = (id:number)=>{
        gameService.findById(id)
        .then((data:AxiosResponse<Game>)=>{
            setGame(data.data)
        })
    }
    
    const lobbyDisconnect= async ()=>{
        if(game){
            await gameService.disconnectPlayer({gameId: game.id, playerId: user.user?.id} as Player)
                .then(()=>{
                    if(socket) {
                        socketService.emit(socket,"leaveGameLobby", {room:`game-${game.ownerId}`})
                    }
                    navigate("/dashboard")
                })
        }
    }

    const startGame=()=>{
        if(game){
            if(game.players && game.players?.length>1 && game.players?.length<=4){
                if(socket) {
                    socketService.emit(socket,"gameStart", {room:`game-${game.ownerId}`})
                }
            }else {
                setVisible(true)
                setMessage("O jogo precisa ter de 2 a 4 jogadores")
                setType("alert")
            }
        }
    }
    
    return (
        <>
            <div className=" w-[100%] ml-20 mr-20 flex flex-col">
                <h1 className="font-bold text-white text-[1.6rem]">Lobby</h1>
                <div className="my-8 pr-4 h-full flex gap-8 ">
                    {
                        game && game.players?.map((p:Player, i:number)=> {
                            if(p.owner === true){
                                return <LobbyCard key={`lobbyCard-${i}`} username={p.user?.username} leader active />
                            } else {
                                return <LobbyCard key={`lobbyCard-${i}`} username={p.user?.username} active  />
                            }
                        })
                    }
                    {
                        game &&
                        game.playerAmount &&
                        game.players &&
                        [...Array(game.playerAmount - game.players.length).keys()].map((n:number)=>{
                            return <LobbyCard key={`lobbyCardEmpty-${n}`} username={`Player ${game.players?game.players.length+n+1:0}`} />
                        })
                    }
                    {/* {game && game.playerAmount && game.players && [...Array(game.playerAmount - game.players.length).keys()].map((d:number, j:number)=>{
                        
                    })} */}
                </div>
                <div className='mb-[40px] flex gap-8'>
                    {game?.ownerId === user.user?.id && (
                        <Button
                            variant="dashboard"
                            className="mt-0 h-12 rounded-[50px]"
                            onClick={game && (()=>startGame())}
                        >
                            Começar partida
                        </Button>
                    )}
                    <Button
                        variant="dashboard"
                        className="mt-0 h-12 rounded-[50px]"
                        onClick={lobbyDisconnect}
                    >
                        Sair
                    </Button>
                </div>
            </div>
        </>
    )
}
