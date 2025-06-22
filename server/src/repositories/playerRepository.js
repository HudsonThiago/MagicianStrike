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

    delete = async (id) => {
        return await prisma.player.delete({
            where: {
                id: id
            }
        })
    }

    findById = async (id) => {
        return await prisma.player.findFirst({
            where: {
                id: id,
            },
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