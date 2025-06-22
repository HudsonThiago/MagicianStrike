import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class GameRepository {

    save = async (data) => {
        return await prisma.game.create({
            data: {
                ownerId: data.ownerId,
                active: true
            },
        });
    };

    update = async (id, data) => {
        return await prisma.game.update({
            where: {
                id: id
            },
            data: {
                ownerId: data.ownerId,
                active: data.active
            },
        });
    }

    disable = async (id) => {
        return await prisma.game.update({
            where: {
                id: id
            },
            data: {
                active: false
            },
        });
    }

    list = async () => {
        return await prisma.game.findMany({
            include: {
                players: true
            }
        });
    }

    delete = async (id) => {
        return await prisma.game.delete({
            where: {
                id: id
            }
        })
    }

    findById = async (id) => {
        return await prisma.game.findFirst({
            where: {
                id: id,
            },
            include: {
                players: true
            }
        });
    }

    findByIsActive = async (ownerId) => {
        return await prisma.game.findFirst({
            where: {
                ownerId: ownerId,
                active: true,
            },
        });
    }
}