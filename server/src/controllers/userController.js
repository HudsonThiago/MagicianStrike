import { Router } from 'express'
import { UserRepository } from '../repositories/userRepository.js';
import { hash } from 'bcrypt'
import { checkToken } from './authController.js';

export const userController = Router();
const userRepository = new UserRepository()
  
userController.get('/', async (req,res) => {
  await userRepository.list().then(u=>{
    res.status(200).json(u)
  }).catch(error=>{
    res.status(200).json([])
  })
});

userController.get('/:id', checkToken, async (req,res) => {
  const userId = Number(req.params.id);

  await userRepository.findById(userId).then(u=>{
    const user = {
      id: u.id,
      username: u.username,
      email: u.email
    }

    res.status(200).json(user)
  }).catch (error=>{
    res.status(400).json({message: 'Usuário não foi encontrado'});
  })
});

userController.post('/', async (req, res) => {
  try {
    let user = req.body
    let registeredEmail = await userRepository.findByEmail(user.email).then(data=>{return data})
    let registeredUsername = await userRepository.findByUserName(user.username).then(data=>{return data})
    
    if(user === undefined){
      throw new Error('NOT_FOUND');
    }

    let errors = {}
    if(!user.username){
      errors['username']=("Nome de usuário não pode estar vazio")
    }
    if(!user.email){
      errors['email']=("Email não pode estar vazio")
    }
    if(!user.password){
      errors['password']=("Senha não pode estar vazio")
    }
    if(user.password !== user.confirmPassword){
      errors['password']=("As senhas não são iguais")
    }
    if(registeredEmail) {
      errors['email']=("Usuário com este email já foi cadastrado")
    }
    if(registeredUsername) {
      errors['username']=("Usuário com este nome já foi cadastrado")
    }
    
    if(Object.keys(errors).length > 0){
      throw new Error('BAD_REQUEST', {cause: errors});
    }
 
    user.password = await hash(user.password, 10)

    let newUser = await userRepository.save(user).then(data=>{return data})
    
    res.status(201).json(newUser);

  } catch (error) {
    if(error.message === 'BAD_REQUEST'){
      res.status(400).json({message: 'O usuário não foi cadastrado', status: 'alert', detail: error.cause});
    } 
    if(error.message === 'NOT_FOUND'){
      res.status(404).json({message: 'Usuário não encontrado', status: 'danger'});
    }
    res.status(400).json({message: 'Erro ao criar usuário', status: 'danger'});
  }
})

userController.delete('/:id', async (req, res) => {
  const userId = Number(req.params.id);

  await userRepository.delete(userId).then(u=>{
    res.status(200).json({message: 'Usuário apagado com sucesso!'})
  }).catch (error=>{
    res.status(400).json({message: 'Usuário não encontrado'});
  })
});