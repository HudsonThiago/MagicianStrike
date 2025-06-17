import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/button';
import UserProfile from "../../../../public/userProfile.png"
import LobbyCard from '../../components/lobbyCard';
import { useUser } from '../../context/UserContext';

export default function Main(){
    const navigate = useNavigate();
    const user = useUser();

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
