import type { Game } from '../../models/Game';
import { useMatrix } from '../../context/matrixContext';
import { useEffect, useState, type Dispatch, type JSX, type SetStateAction } from 'react';
import { enviromentMatrix } from '../../utils/enviromentMatrix';
import { gameService } from '../../services/GameService/GameService';
import type { AxiosResponse } from 'axios';
import { useParams } from 'react-router-dom';
import type { Player } from '../../models/Player';
import { useUser } from '../../context/UserContext';
import { socketService } from '../../services/socket/socketService';
import { useSocket } from '../../context/socketContext';
import type { Socket } from 'socket.io-client';

export interface chat {
    username:string
    message:string
}
const pos = [
    {x: 1, y: 1},
    {x: 15, y: 1},
    {x: 1, y: 15},
    {x: 15, y: 15},
]

export const setElementInMatrix = (matrix:number[][], col: number, row: number, value: number) => {
    const novaMatriz = matrix.map((x, i) => 
        i === row
        ? x.map((y, j) => (j === col ? value : y))
        : x
    );

    return novaMatriz;
};

export default function Game(){
    const {matrix, setMatrix} = useMatrix()
    const user = useUser();
    const [coords, setCoords] = useState({ x: 1, y: 1 });
    const [playerCoords, setPlayerCoords] = useState<any[]>([]);
    const [game, setGame] = useState<Game>();
    const { id } = useParams();
    const [runes, setRunes] = useState<number>(1);
    const [runesInMap, setRunesInMap] = useState<any[]>([]);
    const { socket } = useSocket();
    const [ power, setPower ] = useState<number>(1)
    const [ isAlive, setIsAlive ] = useState<boolean>(true)
    const [ toggle, setToggle ] = useState<boolean>(true)
    const [playersAlive, setPlayersAlive] = useState<{id:number}[]>([]);
    const [defeatPanel, setDefeatPanel] = useState<number|undefined>(undefined);
    const [winner, setWinner] = useState<Player|undefined>(undefined);
    
    useEffect(()=>{
        if (!socket) return;
        if(!isNaN(Number(id))) {
            loadGame(Number(id))
            updateGame(socket)
            rune(socket)
            removeRune(socket)
            killPlayer(socket)
            removeDamageBlocks(socket)
        }
    }, [socket])

    useEffect(()=>{
        if(playersAlive.length == 1) {
            if(socket) socketService.emit(socket,"winner",{room:`game-${game?.ownerId}`, playerId: playersAlive[0].id})
            let playerUser = game?.players?.find(p=>p.playerId === playersAlive[0].id)
            setWinner(playerUser)
        }
    }, [playersAlive])

    const updateGame = (socket: Socket) => {
        socket.on("updateGame", (value) => {
            setPlayerCoords(prev=>{
                let a = prev.map((p)=>{
                    if(p.id === value.id){
                        return {id:p.id, x: value.x, y:value.y}
                    } else {
                        return {id:p.id, x: p.x, y:p.y}
                    }
                })
                return a
            })
        })
    }
    
    const rune = (socket: Socket) => {
        socket.on("putRune", (value) => {
            setMatrix(value.matrix)
            setRunesInMap(prev => [...prev, {id: value.id, x: value.x, y: value.y}])
        })
    }
    
    const removeRune = (socket: Socket) => {
        socket.on("removeRune", (value) => {
            setMatrix(value.matrix)
            //setRunesInMap(prev => prev.filter(r=>!(r.x === value.x && r.y === value.y)))
            if(value.id === user.user?.id) {
                setRunes(prev=>prev++)
            }
            setTimeout(()=>{
                setToggle(!toggle)
            }, 10)
            setTimeout(()=>{
                if(socket) socketService.emit(socket,"removeDamageBlocks",{room: value.room, matrix: value.matrix, damageBlocks: value.damageBlocks})
            }, 500)
        })
    }
    
    const killPlayer = (socket: Socket) => {
        socket.on("killPlayer", (value) => {
            setMatrix(value.matrix)
            setPlayerCoords(prev=> {return prev.filter(p=>p.id !== value.playerId)})
            if(playersAlive != undefined) {
                setPlayersAlive(playersAlive.filter(p=>p.id !== value.playerId))
            }
        })
    }
    
    const removeDamageBlocks = (socket: Socket) => {
        socket.on("removeDamageBlocks", (value) => {
            setMatrix(value.matrix)
        })
    }

    const loadGame = (id:number)=>{
        gameService.findById(id)
        .then((data:AxiosResponse<Game>)=>{
            if(socket) socketService.emit(socket,"joinGameLobby",{room:`game-${data.data.ownerId}`})
            if(data.data.matrix) setMatrix(JSON.parse(data.data.matrix) as number[][])
            let game:Game = data.data
            const pCoords:any[] = []
            game.players?.forEach((p:Player, i:number)=>{
                let playersAliveAux = playersAlive
                playersAliveAux?.push({id:p.playerId})
                setPlayersAlive(playersAliveAux)
                if(p.playerId === user.user?.id){
                    setCoords(pos[i])
                } else {
                    pCoords.push({id: p.playerId, x: pos[i].x, y: pos[i].y})
                }
            })
            setPlayerCoords(pCoords)
            setGame(game)
        })
    }

    let move = true

    useEffect(() => {
        if(isAlive){
            if(matrix[coords.y][coords.x]===11) {
                setIsAlive(false)
                setDefeatPanel(user.user?.id)
                if(socket) socketService.emit(socket,"killPlayer",{room:`game-${game?.ownerId}`, playerId: user.user?.id})
            }
            const handleKeyDown = (event: KeyboardEvent) => {

                if(move===true && matrix){
                    move = false
                    setCoords((prev) => {
                        let x = prev.x;
                        let y = prev.y;
                        if (event.key === 'a' || event.key === 'A') {

                            if(matrix[y][x-1] === 0 || matrix[y][x-1] === 11){
                                x -= 1;
                            }
                        }
                        if (event.key === 'w' || event.key === 'W') {
                            if(matrix[y-1][x] === 0 || matrix[y-1][x] === 11){
                                y -= 1;
                            }
                        }
                        if (event.key === 'd' || event.key === 'D') {
                            if(matrix[y][x+1] === 0 || matrix[y][x+1] === 11){
                                x += 1;
                            }
                        }
                        if (event.key === 's' || event.key === 'S') {
                            if(matrix[y+1][x] === 0 || matrix[y+1][x] === 11){
                                y += 1;
                            }
                        }

                        setTimeout(()=>{
                            move = true
                        }, 200)
                        if(socket) socketService.emit(socket,"updateGame", {room:`game-${game?.ownerId}`, id: user.user?.id, x: x, y: y})
                    
                        return { x, y };
                    });
                }


                if (event.key === 'e' || event.key === 'E') {
                    if(matrix[coords.y][coords.x] === 0 || matrix[coords.y][coords.x] === 11){
                        if(runes > 0){
                            addRune(coords.x, coords.y)
                        }
                    }
                }

            };
        
            window.addEventListener("keydown", handleKeyDown);

            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }        
    }, [coords, runes, toggle]);


    const getField=(x:number, y:number)=>{
        if(matrix[x][y] === 1) {
            return <div
                key={`spot-${x}-${y}`}
                className="bg-[url('/public/wallBrick.svg')] bg-cover w-[50px] h-[50px]"
            >
            </div>
        } if(matrix[x][y] === 2) {
            return <div
                key={`spot-${x}-${y}`}
                className="bg-[url('/public/wallBrick.svg')] bg-cover w-[50px] h-[50px]"
            >
            </div>
        } if(matrix[x][y] === 3) {
            return <div
                key={`spot-${x}-${y}`}
                className="bg-[url('/public/brick.svg')] bg-cover w-[50px] h-[50px]"
            >
            </div>
        } if(matrix[x][y] === 11) {
            return <div
                key={`spot-${x}-${y}`}
                className="bg-red-300 w-[50px] h-[50px]"
            >
            </div>
        } else {
            return <div
                key={`spot-${x}-${y}`}
                className="w-[50px] h-[50px]"
            >
            </div>
        }
    }

    const addRune = (row:number, col:number) => {
        const newRune = {id: user.user?.id, x: coords.x, y: coords.y};
        setRunesInMap((prev) => {
            if(socket) socketService.emit(socket,"putRune", {room:`game-${game?.ownerId}`, matrix: matrix, id: user.user?.id, x: coords.x, y: coords.y})

            return [...prev, newRune]
        });
    };

    return (
        <div className="w-full h-full flex justify-center items-center">
            {
                winner !== undefined
                ?
                    (
                        <div className=' bg-white/70 absolute z-50 w-[500px] h-[250px] rounded flex justify-center items-center'>
                            <p className='text-blue-500 m-0 font-bold text-[2rem]'>{winner.user?.username.toUpperCase()} GANHOU O JOGO</p>
                        </div>
                    )
                : defeatPanel === user.user?.id && 
                    (
                    <div className=' bg-white/70 absolute z-50 w-[500px] h-[250px] rounded flex justify-center items-center'>
                        <p className='text-orange-500 m-0 font-bold text-[2rem]'>VOCÊ FOI DERROTADO</p>
                    </div>
                    )
            }
            {}
            <div className='relative w-[850px] h-[850px]'>
                {coords && isAlive && (
                    <div className='absolute z-20 bg-red-400 w-[50px] h-[50px] transition-all duration-200 ease-linear' 
                        style={{
                        position: "absolute",
                        top: `${coords.y*50}px`,
                        left: `${coords.x*50}px`,
                        }}>
                    </div>
                )}
                {playerCoords?.map((p)=>{
                    return (
                        <div className='absolute z-20 bg-blue-200 w-[50px] h-[50px] transition-all duration-200 ease-linear'
                            style={{
                            position: "absolute",
                            top: `${p.y*50}px`,
                            left: `${p.x*50}px`,
                            }}>
                        </div>
                    )
                })}
        
                <div className='absolute z-10'>
                    {runesInMap.map((r)=> {
                        if(game)
                        return (
                            <Rune
                                ownerId={game?.ownerId}
                                socket={socket}
                                setRunes={setRunesInMap}
                                runes={runesInMap}
                                rune={r}
                                power={power}
                            />
                        )
                    })}
                </div>

                <div className="absolute z-0 bg-lime-500 grayscale-30 mx-auto grid grid-rows-17 grid-cols-1">
                    {matrix && matrix.map((row, x) => (
                        <div key={`row-${x}`} className="flex">
                            {row.map((col, y) => {
                                return getField(x, y)
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

interface RuneProps {
    runes:any[]
    ownerId:number
    setRunes:Dispatch<SetStateAction<any[]>>
    rune:any
    socket:Socket|null
    power:number
}

function Rune({ownerId, socket, setRunes, runes, rune, power}:RuneProps){

    const {matrix, setMatrix} = useMatrix()
    const [id,setId] = useState<string>(String(new Date()))

    useEffect(()=>{
        setTimeout(()=>{
            setRunes((prev)=>prev.filter((r)=>!(r.x === rune.x && r.y === rune.y)))
            if(socket) socketService.emit(socket,"removeRune", {room:`game-${ownerId}`, matrix: matrix, id: rune.id, x: rune.x, y: rune.y, power: power})
        }, 3000)
        setTimeout(()=>{
            const explosion = document.getElementById(id)
            explosion?.classList.add('animate-ripple1')
        }, 2500)
    }, [])

    return(
        <div
            className="bg-[url('/public/rune.svg')] bg-cover absolute w-[50px] h-[50px] animate-rune flex justify-center items-center"
            style={{ top: `${rune.y*50}px`, left: `${rune.x*50}px` }}
        >
            <div 
                id={id}
                className='absolute z-30 bg-violet-300'
                style={{ top: `${rune.y*50-(50*power)}px`, left: `${rune.x*50-(50*power)}px`, width: `${50*(power*2+1)}`, height: `${50*(power*2+1)}`, borderRadius: "50%" }}
            >
            </div>
        </div>
    )
}