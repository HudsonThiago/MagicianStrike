import { useNavigate } from 'react-router-dom';
import LobbyCard from '../../components/lobbyCard';
import { useUser } from '../../context/UserContext';
import { useEffect } from 'react';
import { useSocket } from '../../context/socketContext';

export default function Main(){
    const navigate = useNavigate();
    const user = useUser();
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.emit('joinRoom', 'general');
        socket.on('message', (msg:any) => {
        console.log('New message:', msg);
        });

        return () => {
        socket.off('message');
        };
    }, [socket]);
    
    return (
        <>
            <div className=" w-[100%] ml-20 mr-20 flex flex-col">
                <h1 className="font-bold text-white text-[1.6rem]">Lobby</h1>
                <div className="my-8 pr-4 h-full flex gap-8 ">
                    <LobbyCard username={user.user?.username} leader active />
                    <LobbyCard username='Player 2' />
                    <LobbyCard username='Player 3' />
                    <LobbyCard username='Player 4' />
                </div>
            </div>
        </>
    )
}
