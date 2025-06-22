import UserProfile from "../../imgs/userProfile.png"

interface ChatProps {
    username:string
    msg:string
    owner:boolean
}

export default function Chat(props:ChatProps){
    return (
        <div className='w-[calc(100% - 10px)] mr-[10px] flex'>
            <div className='w-16 h-full flex items-start'>
                <img
                    className=" w-12 h-12 p-2 mt-1 select-none bg-white rounded-[50%] flex justify-center items-center border-stone-400 border-2"
                    src={UserProfile}
                    alt="fotoPerfil"
                />
            </div>
            <div className='w-full'>
                <p className={`${props.owner?'text-orange-400 font-bold':'text-yellow-200'} mb-1`}>
                    {props.username}
                </p>
                <p className='text-white break-all'>
                    {props.msg}
                </p>
            </div>
        </div>
    )
}