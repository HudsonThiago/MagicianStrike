import { useNavigate } from 'react-router-dom';
import UserProfile from "../../../../public/userProfile.png"
import Div from "../../../../public/div.svg"
import type { ReactNode } from 'react';
import { Button } from '../button';
import { useUser } from '../../context/UserContext';

interface NavProps {
    children?:ReactNode
}

export default function Nav({children}:NavProps){
    const navigate = useNavigate();
    const user = useUser()

    const logOut = () => {
        user.setToken(undefined)
        navigate("/")
    }

    return (
        <>
            <div className="absolute z-30 left-0 ml-20 w-50 h-[100vh] bg-secondary flex items-center flex-col">
                <div className="absolute z-30 h-full w-46 bg-radial-[at_50%_-10%] from-white/10 to-black/40 from-10% to-100% ">

                </div>
                <div className="absolute z-30 h-3/4 w-20 bg-linear-to-b from-black/40 from-50% to-black/0">

                </div>
                <div className="relative z-30 w-full h-[100vh] flex items-center flex-col ">
                    <div className=" mt-8 w-30 h-30 bg-white rounded-[50%] flex justify-center items-center border-stone-400 border-6">
                        <img
                            className="w-3/4 h-3/4 contrast-20 select-none"
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
                        <Button variant="dashboard">
                            JOGAR
                        </Button>
                        <Button variant="dashboard">
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
