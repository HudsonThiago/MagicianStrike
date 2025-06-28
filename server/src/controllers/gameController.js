import { Router } from 'express'
import { GameRepository } from '../repositories/gameRepository.js';
import { PlayerRepository } from '../repositories/playerRepository.js';
import { checkToken } from './authController.js';

export const MAX_PLAYER_IN_LOBBY = 4;

export const gameController = Router();
const gameRepository = new GameRepository()
const playerRepository = new PlayerRepository()


gameController.get('/', async (req,res) => {
  await gameRepository.list().then(async (data)=>{
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

gameController.get('/player/:id', async (req,res) => {
  const playerId = Number(req.params.id);
  await gameRepository.findByPlayerId(playerId).then(async data=>{
    res.status(200).json(data)
  }).catch (error=>{
    res.status(200).json(null);
  })
});

gameController.post('/', async (req, res) => {
  try {
    let game = req.body
    game['playerAmount'] = MAX_PLAYER_IN_LOBBY
    let gameIsActive = await gameRepository.findByIsActive(game.ownerId).then(data=>{return data})

    if(gameIsActive !== null){
      throw new Error('BAD_REQUEST');
    }

    let newGame = await gameRepository.save(game).then(data=>{return data})
    let player = await playerRepository.save(newGame.id, newGame.ownerId, true).then(data=>{return data})
    
    await gameRepository.findById(newGame.id).then(data=>{
      res.status(201).json(data);
    })
  } catch (error) {
    if(error.message === 'BAD_REQUEST'){
      res.status(400).json({message: 'Erro ao criar uma nova sala', status: 'danger', detail: error.cause});
    }
    res.status(400).json({message: 'Erro ao criar uma nova sala', status: 'danger'});
  }
})

gameController.post('/playerConnect', async (req, res) => {
  try {
    let player = req.body
    let foundGame = await gameRepository.findById(player.gameId).then(data=>{return data})
    let connectedPlayer = await playerRepository.checkPlayerInLobby(foundGame.id, player.playerId)
    if(connectedPlayer){
      throw new Error('PLAYER_ALREADY_REGISTERED');
    }

    if(foundGame.players.length >= MAX_PLAYER_IN_LOBBY){
      throw new Error('LIMIT_EXCEEDED');
    }

    await playerRepository.save(player.gameId, player.playerId, false).then(data=>{return data})
    
    await gameRepository.findById(player.gameId).then(data=>{
      res.status(200).json(data)
    })
  } catch (error) {
    if(error.message === 'BAD_REQUEST'){
      res.status(400).json({message: 'A sala não foi cadastrada', status: 'alert', detail: error.cause});
    }
    if(error.message === 'LIMIT_EXCEEDED'){
      res.status(400).json({message: 'A sala já atingiu o número máximo de jogadores', status: 'alert'});
    }
    if(error.message === 'PLAYER_ALREADY_REGISTERED'){
      res.status(400).json({message: 'Este jogador já está na sala', status: 'alert'});
    }
    res.status(400).json({message: 'Erro ao criar a sala', status: 'danger'});
  }
})

gameController.patch('/disable/:id', async (req, res) => {
  const gameId = Number(req.params.id);

  await gameRepository.disable(gameId).then(u=>{
    res.status(200).json({message: 'Sala desativada com sucesso!'})
  }).catch (error=>{
    res.status(400).json({message: 'Sala não encontrada'});
  })
});

gameController.patch('/playerDisconnect', async (req, res) => {
  try {
    let player = req.body
    let connectedPlayer = await playerRepository.getPlayerInList(player.gameId, player.playerId).then(data=>{return data})
    let game = await gameRepository.findById(player.gameId).then(data=>{return data})
    
    if(connectedPlayer === null){
      throw new Error('PLAYER_NOT_REGISTERED');
    }

    if(player.playerId === game.ownerId){
      await playerRepository.deleteMany(player.gameId)
      await gameRepository.disable(player.gameId)
    } else {
      await playerRepository.delete(connectedPlayer.id)
    }
    
    res.status(200).json("FOI")
  } catch (error) {
    if(error.message === 'PLAYER_NOT_REGISTERED'){
      res.status(400).json({message: 'Este jogador não está na sala', status: 'alert'});
    }
    res.status(400).json({message: 'Sala não encontrada'});
  }
})

gameController.delete('/player/:id', async (req, res) => {
  const playerId = Number(req.params.id);
  await playerRepository.delete(playerId)
  res.status(200).json("Player deletado")
})
