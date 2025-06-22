import { Router } from 'express'
import { GameRepository } from '../repositories/gameRepository.js';
import { PlayerRepository } from '../repositories/playerRepository.js';
import { checkToken } from './authController.js';

export const gameController = Router();
const gameRepository = new GameRepository()
const playerRepository = new PlayerRepository()
  
gameController.get('/', async (req,res) => {
  await gameRepository.list().then(data=>{
    console.log(data)
    res.status(200).json(data)
  }).catch(error=>{
    res.status(200).json([])
  })
});

gameController.get('/:id', async (req,res) => {
  const gameId = Number(req.params.id);

  await gameRepository.findById(gameId).then(data=>{

    res.status(200).json(data)
  }).catch (error=>{
    res.status(400).json({message: 'Sala não foi encontrada'});
  })
});

gameController.post('/', async (req, res) => {
  try {
    let game = req.body
    let gameIsActive = await gameRepository.findByIsActive(game.ownerId).then(data=>{return data})

    if(gameIsActive){
      throw new Error('BAD_REQUEST');
    }

    let newGame = await gameRepository.save(game).then(data=>{return data})
    let player = await playerRepository.save(newGame.id, newGame.ownerId, true).then(data=>{return data})
    newGame['players'] = [player]
    res.status(201).json(newGame);
  } catch (error) {
    if(error.message === 'BAD_REQUEST'){
      res.status(400).json({message: 'A sala não foi cadastrada', status: 'alert', detail: error.cause});
    }
    res.status(400).json({message: 'Erro ao criar a sala', status: 'danger'});
  }
})

gameController.post('/playerConnect', async (req, res) => {
  try {
    let game = req.body
    let foundGame = await gameRepository.findById(game.gameId).then(data=>{return data})


    //VERIFICAR SE O PLAYER JÁ FOI CADASTRADO
    console.log(foundGame)

    if(foundGame.players.length >= 4){
      throw new Error('LIMIT_EXCEEDED');
    }

    let player = await playerRepository.save(game.gameId, game.playerId, false).then(data=>{return data})
    foundGame.players.push(player)
    res.status(201).json(foundGame);
  } catch (error) {
    if(error.message === 'BAD_REQUEST'){
      res.status(400).json({message: 'A sala não foi cadastrada', status: 'alert', detail: error.cause});
    }
    if(error.message === 'LIMIT_EXCEEDED'){
      res.status(400).json({message: 'A sala já atingiu o número máximo de jogadores', status: 'alert'});
    }
    res.status(400).json({message: 'Erro ao criar a sala', status: 'danger'});
  }
})

gameController.patch('/:id', async (req, res) => {
  const gameId = Number(req.params.id);

  await gameRepository.disable(gameId).then(u=>{
    res.status(200).json({message: 'Sala desativada com sucesso!'})
  }).catch (error=>{
    res.status(400).json({message: 'Sala não encontrada'});
  })
});

gameController.delete('/:id', async (req, res) => {
  const gameId = Number(req.params.id);

  await gameRepository.delete(gameId).then(u=>{
    res.status(200).json({message: 'Sala apagada com sucesso!'})
  }).catch (error=>{
    res.status(400).json({message: 'Sala não encontrada'});
  })
});