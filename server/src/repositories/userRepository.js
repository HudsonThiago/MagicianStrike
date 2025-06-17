import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class UserRepository {

    save = async (data) => {
        return await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: data.password,
            },
        });
    };

    update = async (id, data) => {
        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                username: data.username,
                email: data.email,
                password: data.password,
            },
        });
    }

    list = async () => {
        return await prisma.user.findMany()
    }

    delete = async (id) => {
        return await prisma.user.delete({
            where: {
                id: id
            }
        })
    }

    findById = async (id) => {
        return await prisma.user.findFirst({
            where: {
                id: id,
            },
        });
    }

    findByEmail = async (email) => {
        return await prisma.user.findFirst({
            where: {
                email: email,
            },
        });
    }

    findByUserName = async (username) => {
        return await prisma.user.findFirst({
            where: {
                username: username,
            },
        });
    }
}