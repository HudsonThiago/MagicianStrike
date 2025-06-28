import { MdAlternateEmail, MdLockOutline, MdOutlinePersonOutline  } from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/button";
import Alert from "../components/alert/alert";
import type { AuthDto } from "../models/User";
import { FormikProvider, useFormik, type FieldConfig, type FieldHelperProps, type FieldInputProps, type FieldMetaProps, type FormikErrors, type FormikState, type FormikTouched } from "formik";
import { useState, type SetStateAction } from "react";
import { authService } from "../services/UserService/AuthService";
import { setErrors } from "../utils/errorHandling";
import { useUser } from "../context/UserContext";
import { useAlert } from "../context/AlertContext";
import { useSocket } from "../context/socketContext";
import { socketService } from "../services/socket/socketService";

export default function Login(){
    const {visible, setVisible, message, setMessage, type, setType} = useAlert()
    const { socket } = useSocket();
    const navigate = useNavigate();
    const {setToken, setUser} = useUser()
    const [loading, setLoading] = useState<boolean>(false)
    
    const formik = useFormik<AuthDto>({
        initialValues: {
            username: '',
            password: ''
        },
        onSubmit: async (values:AuthDto) => {
            await submit(values)
        },
    });

    const submit = async (values:AuthDto)=>{
        setLoading(true)
        
        setTimeout( async () => {
            await authService.auth(values).then((data)=>{
                if(data){
                    setUser(data.data.user)
                    setToken(data.data.token)
                    
                    if(socket) socketService.emit(socket,"joinMainLobby",{room:"geral"})
                    navigate("/dashboard")
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
                        <div className="mb-8">
                            <h2 className=" text-[2rem] text-stone-700 font-bold">
                                Sign in
                            </h2>
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
                        <div className="flex flex-col items-end justify-end ">
                            <Button
                                onClick={()=> formik.submitForm()}
                                disabled={loading}
                            >
                                Entrar
                            </Button>
                            <p className="m-auto mt-16 text-stone-500 ">
                                Não possui uma conta? <span onClick={()=>navigate("/register")} className="text-red-400 font-bold cursor-pointer">criar agora</span>
                            </p>
                        </div>
                    </div>
                </FormikProvider>
            </div>
        </>
    )
}
