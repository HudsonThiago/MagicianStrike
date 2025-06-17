import type { ComponentProps, ReactNode } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaRegUser, FaUser } from 'react-icons/fa';
import { tv, type VariantProps } from 'tailwind-variants';

const lobbyCard = tv({
  base: 'w-40 h-60 border-2 rounded-lg flex flex-col justify-center items-center select-none',
  variants: {
    active: {
      true: ' bg-white/20 border-orange-300 text-white ',
      false: ' w-40 h-60 border-white/40 border-dashed border-2 bg-white/8 animate-pulse text-white/40 '
    }
  },
  defaultVariants: {
    active: false,
  },
})

const lobbyCardTitle= tv({
  base: 'mt-2 font-bold ',
  variants: {
    active: {
      true: 'text-orange-200 text-[1.2rem]',
      false: 'text-white/40'
    }
  },
  defaultVariants: {
    active: false,
  },
})

export type lobbyCardProps = ComponentProps<'div'> & VariantProps<typeof lobbyCard> & {
  username?:string
  leader?:boolean
}

export default function LobbyCard({active, username, leader, ...props}:lobbyCardProps){

    return (
        <div className={lobbyCard({active})}>
            {active ? <FaUser className="text-white text-[1.8rem]" /> : <AiOutlineLoading3Quarters className=" text-white/40 text-[1.8rem] animate-spin "/>}
            <h3 className={lobbyCardTitle({active})}>{username?username:"Username"}</h3>
            {leader && <p className='text-orange-400 text-[0.8rem]'>Owner</p>}
        </div>
    )
}
