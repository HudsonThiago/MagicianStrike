import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class PlayerRepository {

    save = async (gameId, playerId, owner) => {
        return await prisma.player.create({
            data: {
                gameId: gameId,
                playerId: playerId,
                owner: owner,
            },
        });
    };

    list = async () => {
        return await prisma.player.findMany()
    }

    checkPlayerInLobby = async (gameId, playerId) => {
        const player = await prisma.player.findFirst({
            where: {
                gameId: gameId,
                playerId: playerId
            }
        });
        return !!player;
    }

    getPlayerInList = async (gameId, playerId) => {
        return  await prisma.player.findFirst({
            where: {
                gameId: gameId,
                playerId: playerId
            }
        });
    }

    delete = async (id) => {
        return await prisma.player.deleteMany({
            where: {
                id: id
            }
        })
    }

    deleteMany = async (id) => {
        return await prisma.player.deleteMany({
            where: {
                gameId: id
            }
        });
    }
    

    findByGameId = async (id) => {
        return await prisma.player.findMany({
            where: {
                gameId: id,
            },
        });
    }
}