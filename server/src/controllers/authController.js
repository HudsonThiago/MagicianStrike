import { Router } from 'express'
import { UserRepository } from '../repositories/userRepository.js';
import { compare, hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config()

export const authController = Router();
const userRepository = new UserRepository()


authController.post('/', async (req, res) => {
  try {
    let user = req.body
    let foundedUser = await userRepository.findByUserName(user.username).then(data=>{return data})
    const checkPassword = foundedUser != undefined ? await compare(user.password, foundedUser.password) : false

    if(user === undefined){
      throw new Error('NOT_FOUND');
    }

    let errors = {}
    if(!user.username){
      errors['username']=("Nome de usuário não pode estar vazio")
    }
    if(!user.password){
      errors['password']=("Senha não pode estar vazio")
    }
    if(user.username && user.password){
      if(!foundedUser || !checkPassword){
        errors['username']=("nome de usuario ou senha inválida")
      }
    }

    if(Object.keys(errors).length > 0){
      throw new Error('BAD_REQUEST', {cause: errors});
    }

    const secret = process.env.SECRET_KEY
    const token = jwt.sign({
        id: user.id
    }, secret)
    // let newUser = await userRepository.save(user).then(data=>{return data})
    
    const sendUser = {
      id: foundedUser.id,
      username: foundedUser.username,
      email: foundedUser.email
    }
    res.status(200).json({message: "usuário authenticado com sucesso!", status: 'success', token: token, user: sendUser});

  } catch (error) {
    if(error.message === 'BAD_REQUEST'){
      res.status(400).json({message: 'informações incorretas, tente novamente!', status: 'alert', detail: error.cause});
    } 
    if(error.message === 'NOT_FOUND'){
      res.status(404).json({message: 'Usuário não encontrado', status: 'danger'});
    }
    res.status(400).json({message: 'Erro ao fazer login', status: 'danger'});
  }
})

export const checkToken=(req, res, next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
      res.status(401).json({message: 'Acesso negado', status: 'alert'});
    }

    try {
        const secret = process.env.SECRET_KEY
        jwt.verify(token, secret)
        next()
    } catch(error){
      res.status(400).json({message: 'token inválido', status: 'alert'});
    }
}