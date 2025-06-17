import React, { useState, useRef, useEffect, type ComponentProps } from 'react';
import './style.css';
import { FiArrowRight } from 'react-icons/fi';
import { tv, type VariantProps } from 'tailwind-variants'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const button = tv({
  base: 'flex items-center justify-between text-sm p-2 px-4 mt-6 min-w-36 rounded-[50px] text-white font-bold cursor-pointer',
  variants: {
    disabled: {
      true: 'bg-gray-500 cursor-default ',
      false: 'hover:bg-orange-300 [&:not(:hover)]:bg-linear-50 [&:not(:hover)]:from-orange-300 [&:not(:hover)]:to-red-400'
    },
    variant: {
      default: '',
      dashboard: '[&:not(:hover)]:bg-none text-stone-950 bg-white hover:bg-linear-50 hover:from-orange-300 hover:to-red-400 hover:text-white rounded-none hover:scale-110 duration-200 ease-out justify-center'
    }
  },
  defaultVariants: {
    disabled: false,
    variant: 'default',
  },
})

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof button>

export const Button = ({disabled, variant, className, ...props}: ButtonProps) => {
  const [loadingMessage, setLoadingMessage] = useState<string>("Aguarde.");
  // const [ripples, setRipples] = useState<Ripple[]>([]);
  // const buttonRef = useRef<HTMLButtonElement | null>(null);

  // const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   if (!buttonRef.current) return;

  //   const rect = buttonRef.current.getBoundingClientRect();
  //   const rippleSize = 80; // tamanho do span em pixels

  //   const rippleX = e.clientX - rect.left - rippleSize / 2;
  //   const rippleY = e.clientY - rect.top - rippleSize / 2;
  //   const newRipple: Ripple = { x: rippleX, y: rippleY, id: Date.now() };

  //   setRipples((prevRipples) => [...prevRipples, newRipple]);

  //   const handleMouseUp = () => {
  //     setRipples((currentRipples) =>
  //       currentRipples.filter((ripple) => ripple.id !== newRipple.id)
  //     );
  //   };

  //   document.addEventListener('mouseup', handleMouseUp, { once: true });
  // };

  // useEffect(() => {
  //   const timeouts = ripples.map((ripple) =>
  //     setTimeout(() => {
  //       setRipples((currentRipples) =>
  //         currentRipples.filter((r) => r.id !== ripple.id)
  //       );
  //     }, 500)
  //   );

  //   return () => {
  //     timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
  //   };
  // }, [ripples]);

  const loadingMessageUpdate =()=>{
    if(loadingMessage.length < 11) {
      setTimeout(()=>{
        setLoadingMessage(loadingMessage+".")
      }, 500)
    } else {
        setLoadingMessage("Aguarde.")
    }
  }

  useEffect(() => {
    loadingMessageUpdate()
  }, [loadingMessage])

  return (
    <button
        className={button({disabled, className, variant})}
        {...props}
    >
        
        {!disabled
          ? <>
            {props.children}
            
            {!variant && <FiArrowRight className=" text-lg "/>}
          </>
          :  <>
            {loadingMessage}
            {!variant && <AiOutlineLoading3Quarters className=" ml-4 text-lg animate-spin "/>}
          </>
        }
        
    </button>
  );
};
