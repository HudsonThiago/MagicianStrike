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

export default function Main(){
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useUser();
    const { socket, isConnected } = useSocket();
    const [game, setGame] = useState<Game>()

    useEffect(() => {
        if (!socket) return;

        if(!isNaN(Number(id))) {
            gameService.findById(Number(id))
            .then((data:AxiosResponse<Game>)=>{
                console.log(data.data)
                setGame(data.data)
            })
        }
    }, [socket]);
    
    const lobbyDisconnect= async ()=>{
        if(game){
            await gameService.disconnectPlayer({gameId: game.id, playerId: user.user?.id} as Player)
                .then((data)=>{
                    navigate("/dashboard")
                })
        }
    }
    
    return (
        <>
            <div className=" w-[100%] ml-20 mr-20 flex flex-col">
                <h1 className="font-bold text-white text-[1.6rem]">Lobby</h1>
                <div className="my-8 pr-4 h-full flex gap-8 ">
                    {
                        game && game.players?.map((p:Player)=> {
                            if(p.owner === true){
                                return <LobbyCard username={p.user?.username} leader active />
                            } else {
                                return <LobbyCard username={p.user?.username} active  />
                            }
                        })
                    }
                    {
                        game &&
                        game.playerAmount &&
                        game.players &&
                        [...Array(game.playerAmount - game.players.length).keys()].map((n:number)=>{
                            return <LobbyCard username={`Player ${game.players?game.players.length+n+1:0}`} />
                        })
                    }
                    {/* {game && game.playerAmount && game.players && [...Array(game.playerAmount - game.players.length).keys()].map((d:number, j:number)=>{
                        
                    })} */}
                </div>
                <div className='mb-[40px] flex gap-8'>
                    <Button
                        variant="dashboard"
                        className="mt-0 h-12 rounded-[50px]"
                        // onClick={()=>lobbyConnect(g.id)}
                    >
                        Encontrar partida
                    </Button>
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
