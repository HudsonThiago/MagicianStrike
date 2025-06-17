import { useEffect, useState, type ComponentProps, type Dispatch, type SetStateAction } from "react";
import { FiAlertTriangle, FiAlertCircle, FiInfo  } from "react-icons/fi";
import { VscVerified } from "react-icons/vsc";
import { tv, type VariantProps } from "tailwind-variants";

export type AlertType = 'info' | 'success' | 'alert' | 'danger' | undefined

const alert = tv({
  base: 'absolute right-0 w-[90%] mt-4 mx-auto sm:w-[500px] sm:mt-8 sm:mx-4  min-h-20 border-l-8 p-2 pl-6 box-border rounded-sm grid grid-cols-[30px_calc(100%_-_30px)] items-center cursor-pointer',
  variants: {
    visible: {
      true: 'visible',
      false: 'hidden'
    },
    type: {
      info: 'border-blue-300 bg-linear-to-r from-blue-50/10 to-blue-100/60',
      success: 'border-green-300 bg-linear-to-r from-green-50/10 to-green-100/60',
      alert: 'border-amber-200 bg-linear-to-r from-amber-50/10 to-amber-100/60',
      danger: 'border-red-300 bg-linear-to-r from-red-50/10 to-red-100/60',
    }
  },
  defaultVariants: {
    visible: false,
    type: 'info',
  },
})

const alertTitle= tv({
  base: 'col-start-2 font-bold text-lg',
  variants: {
    type: {
      info: 'text-blue-300',
      success: 'text-green-300',
      alert: 'text-amber-200',
      danger: 'text-red-300',
    }
  },
  defaultVariants: {
    type: 'info',
  },
})

const alertMessage= tv({
  base: 'col-start-2 text-sm',
  variants: {
    type: {
      info: 'text-amber-50',
      success: 'text-green-50',
      alert: 'text-amber-50',
      danger: 'text-red-50',
    }
  },
  defaultVariants: {
    type: 'info',
  },
})

export type alertProps = ComponentProps<'div'> & VariantProps<typeof alert> & {
  title?:string
  message?:string
  setVisible: Dispatch<SetStateAction<boolean>>
}

export default function Alert({title, message, type, visible, setVisible, children, ...props}:alertProps) {

  useEffect(()=>{
    setTimeout(()=>{
      if(visible){
        setVisible(false)
      }
    }, 3000)
  }, [visible])



  const getTitle=(type:"info" | "success" | "alert" | "danger" | undefined)=>{
    if(type==='info'){
      return "Informação"
    } else if(type==='success'){
      return "Sucesso"
    } else if(type==='alert'){
      return "Atenção"
    } else if(type==='danger'){
      return "Erro"
    } else {
      return "Informação"
    }
  }

  const getIcon=(type:"info" | "success" | "alert" | "danger" | undefined)=>{
    if(type==='info'){
      return <FiInfo className=" text-lg text-blue-300 col-span-1 " />
    } else if(type==='success'){
      return <VscVerified className=" text-lg text-green-300 col-span-1 " />
    } else if(type==='alert'){
      return <FiAlertTriangle className=" text-lg text-amber-200 col-span-1 " />
    } else if(type==='danger'){
      return <FiAlertCircle className=" text-lg text-red-300 col-span-1 " />
    } else {
      return <FiInfo className=" text-lg text-blue-300 col-span-1 " />
    }
  }

  const alertBar=()=>{
    return (
      <div
        onClick={()=>{
          setVisible(false)
          setTimeout(()=>{
            setVisible(false)
          },300)
        }}
        className={alert({type, visible})}
      >
        {getIcon(type)}
        <p className={alertTitle({type})}>{title?title:getTitle(type)}</p>
        <p className={alertMessage({type})}>{message?message:"Nenhuma mensagem"}</p>
      </div>
    )
  }

  return (
    alertBar()
  )
}