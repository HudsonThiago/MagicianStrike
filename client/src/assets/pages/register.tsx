import { MdAlternateEmail, MdLockOutline  } from "react-icons/md";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { MdOutlinePersonOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FormikProvider, useFormik, type FormikProps } from 'formik'; 
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import type { UserRegisterDto } from "../models/User";
import { userService } from "../services/UserService/UserService";
import { Button } from "../components/button";
import Alert, { type AlertType } from "../components/alert/alert";
import { useAlert } from "../context/AlertContext";
import { setErrors } from "../utils/errorHandling";
export default function Register(){

    const navigate = useNavigate();
    const {visible, setVisible, message, setMessage, type, setType} = useAlert()
    const [loading, setLoading] = useState<boolean>(false)

    const formik = useFormik<UserRegisterDto>({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        onSubmit: async (values:UserRegisterDto) => {
            await submit(values)
        },
    });

    const submit = async (values:UserRegisterDto)=>{
        setLoading(true)
        
        setTimeout( async () => {
            await userService.save(values).then((data)=>{
                if(data){
                    setVisible(true)
                    setMessage("usuário cadastrado com sucesso!")
                    setType('success')
                    navigate("/")
                }
            }).catch((error)=>{
                setVisible(true)
                setMessage(error.response.data.message)
                setType(error.response.data.status)

                setErrors(formik, error)
            }).finally(()=>{
                setLoading(false)
            })
        }, 1000)
    }

    return (
        <>
            <Alert
                message={message}
                type={type}
                visible={visible}
                setVisible={setVisible}
            />
            <div className="w-full h-full flex justify-center items-center">
                <FormikProvider value={formik}>
                    <div className="bg-white w-[90%] min-h-[500px] py-16 px-8 mx-auto sm:w-96 flex flex-col gap-4 rounded-sm">
                        <div className=" mb-8 ">
                            <h2 className=" text-[2rem] text-stone-700 font-bold">
                                Criar conta
                            </h2>
                            <div onClick={()=>navigate("/")} className=" flex items-center gap-2 absolute ">
                                <FiArrowLeft className=" text-stone-500 "/>
                                <p className=" text-stone-500 cursor-pointer ">
                                    Voltar
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className=" flex items-center border-b-2 border-stone-300 ">
                                <MdOutlinePersonOutline className=" text-stone-500"/>
                                <input
                                    className=" w-ful w-full rounded-sm p-2 text-stone-500 focus:outline-hidden"
                                    maxLength={256}
                                    type="text"
                                    placeholder="Nome de usuário"
                                    name="username"
                                    id="username"
                                    onChange={(e)=>formik.setFieldValue("username", e.target.value)}
                                />
                            </div>
                            {formik.errors.username && <p className="text-red-500 mt-1">{formik.errors.username}</p>}
                        </div>
                        <div className="flex flex-col">
                            <div className=" flex items-center border-b-2 border-stone-300 ">
                                <MdAlternateEmail className=" text-stone-500"/>
                                <input
                                    className=" w-ful w-full rounded-sm p-2 text-stone-500 focus:outline-hidden"
                                    maxLength={256}
                                    type="text"
                                    placeholder="E-mail"
                                    name="email"
                                    id="email"
                                    onChange={(e)=>formik.setFieldValue("email", e.target.value)}
                                />
                            </div>
                            {formik.errors.email && <p className="text-red-500 mt-1">{formik.errors.email}</p>}
                        </div>
                        <div className="flex flex-col">
                            <div className=" flex items-center border-b-2 border-stone-300 focus:outline-hidden">
                                <MdLockOutline className=" text-stone-500"/>
                                <input
                                    className=" w-ful w-full rounded-sm p-2 text-stone-500 focus:outline-hidden"
                                    maxLength={256}
                                    type="password"
                                    placeholder="Senha"
                                    name="password"
                                    id="password"
                                    onChange={(e)=>formik.setFieldValue("password", e.target.value)}
                                />
                            </div>
                            {formik.errors.password && <p className="text-red-500 mt-1">{formik.errors.password}</p>}
                        </div>
                        <div className="flex flex-col">
                            <div className=" flex items-center border-b-2 border-stone-300 focus:outline-hidden">
                                <MdLockOutline className=" text-stone-500"/>
                                <input
                                    className=" w-ful w-full rounded-sm p-2 text-stone-500 focus:outline-hidden"
                                    maxLength={256}
                                    type="password"
                                    placeholder="Confirmação de senha"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    onChange={(e)=>formik.setFieldValue("confirmPassword", e.target.value)}
                                />
                            </div>
                            {formik.errors.confirmPassword && <p className="text-red-500 mt-1">{formik.errors.confirmPassword}</p>}
                        </div>
                        <div className="flex flex-col items-end justify-end ">
                            <Button
                                onClick={()=> formik.submitForm()}
                                disabled={loading}
                            >
                                Criar conta
                            </Button>
                        </div>
                    </div>
                </FormikProvider>
            </div>
        </>
    )
}