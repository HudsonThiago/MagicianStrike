import { useNavigate } from 'react-router-dom';
import UserProfile from "../../imgs/userProfile.png"
import Div from "../../imgs/div.svg"
import type { ReactNode } from 'react';
import { Button } from '../button';
import { useUser } from '../../context/UserContext';
import { gameService } from '../../services/GameService/GameService';
import type { Game } from '../../models/Game';
import type { AxiosResponse } from 'axios';
import Alert from '../alert/alert';
import { useAlert } from '../../context/AlertContext';
import { useSocket } from '../../context/socketContext';
import { socketService } from '../../services/socket/socketService';

interface NavProps {
    children?:ReactNode
}

export default function Nav({children}:NavProps){
    
    const {visible, setVisible, message, setMessage, type, setType} = useAlert()
    const { socket } = useSocket();
    const navigate = useNavigate();
    const user = useUser()

    const logOut = () => {
        user.setToken(undefined)
        if(socket) {
            socketService.emit(socket,"leaveRooms")
        }
        navigate("/")
    }

    const createLobby= async ()=>{
        await gameService.getGameByPlayerId(user.user?.id)
        .then((data)=>{
            if(data.data !== null){
                if(socket) {
                    socketService.emit(socket,"joinGameLobby",{room:`game-${data.data.ownerId}`})
                }
                navigate(`/dashboard/lobby/${data.data.id}`)
            } else {
                gameService.save({ownerId: user.user?.id})
                .then((data:AxiosResponse<Game>)=>{
                    if(socket) {
                        socketService.emit(socket,"joinGameLobby",{room:`game-${data.data.ownerId}`})
                    }
                    navigate(`/dashboard/lobby/${data.data.id}`)
                })
                .catch((error)=>{
                    setVisible(true)
                    setMessage(error.response.data.message)
                    setType(error.response.data.status)
                })
            }
        })
    }

    return (
        <>
            <Alert
                message={message}
                type={type}
                visible={visible}
                setVisible={setVisible}
            />
            <div className="absolute z-30 left-0 ml-20 w-50 h-[100vh] bg-secondary flex items-center flex-col">
                <div className="absolute z-30 h-full w-46 bg-radial-[at_50%_-10%] from-white/10 to-black/40 from-10% to-100% ">

                </div>
                <div className="relative z-30 w-full h-[100vh] flex items-center flex-col ">
                    <div className=" mt-8 w-30 h-30 bg-white rounded-[50%] flex justify-center items-center border-stone-400 border-6">
                        <img
                            className="w-3/4 h-3/4 select-none"
                            src={UserProfile}
                            alt="fotoPerfil"
                        />
                    </div>
                    <h2 className=" mt-4 text-lg font-bold text-orange-300">
                        {user.user?.username}
                    </h2>
                    <img
                        className=" mt-4 w-3/4 h-auto select-none"
                        src={Div}
                        alt="divisor"
                    />
                    <div className="mt-16 w-full flex flex-col items-center">
                        <Button variant="dashboard" onClick={createLobby}>
                            JOGAR
                        </Button>
                        <Button variant="dashboard" onClick={()=> navigate("/dashboard")}>
                            DASHBOARD
                        </Button>
                        <Button
                            variant="dashboard"
                            onClick={()=> logOut()}
                        >
                            SAIR
                        </Button>
                    </div>
                </div>

            </div>
            <div className=" absolute z-10 w-full h-24 bg-white/5 border-b-2 border-white/10">
                
            </div>
            <div className=" absolute z-0 pl-70 pt-40 w-full h-[100vh] flex ">
                {children}
            </div>
        </>
    )
}
