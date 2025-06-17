import { useNavigate } from 'react-router-dom';
import { FaRegUser, FaUser } from 'react-icons/fa';
import { Button } from '../../components/button';

export default function Main(){
    const navigate = useNavigate();

    return (
        <>
            <div className=" w-[60%] ml-20 mr-20 flex flex-col">
                <h1 className="font-bold text-white text-[1.6rem]">DashBoard</h1>
                <div className="my-8 pr-4 h-full flex flex-col gap-4 overflow-auto max-h-full overflow-y-auto [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar]:w-2.5 dark:[&::-webkit-scrollbar-track]:bg-white/5 dark:[&::-webkit-scrollbar-thumb]:bg-white">

                    <div className="w-full border-l-orange-300 border-l-8 bg-white/20 h-26 rounded-[100px] flex ">
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
                    
                    <div className="w-full border-l-orange-300 border-l-8 bg-white/20 h-26 rounded-[100px] flex ">
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
                <div className="mt-8 mb-8 h-full bg-amber-300 flex flex-col">
                    <div className="w-full h-full">

                    </div>
                    <div className="w-full">
                        <input className="w-full h-10 bg-amber-100" type="text" />
                    </div>
                </div>
            </div>
        </>
    )
}
