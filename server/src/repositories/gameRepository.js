import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class GameRepository {

    save = async (data) => {
        return await prisma.game.create({
            data: {
                ownerId: data.ownerId,
                playerAmount: data.playerAmount,
                active: true,
            },
            include: {
                players: {
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        }
                    }
                },
                owner: true
            }
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
            include: {
                players: {
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        }
                    }
                },
                owner: true
            }
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
            include: {
                players: {
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        }
                    }
                },
                owner: true
            }
        });
    }

    list = async () => {
        return await prisma.game.findMany({
            where: {
                active: true
            },
            include: {
                players: {
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        }
                    }
                },
                owner: true
            }
        });
    }

    delete = async (id) => {
        return await prisma.game.delete({
            where: {
                id: id
            },
            include: {
                players: {
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        }
                    }
                },
                owner: true
            }
        })
    }

    findById = async (id) => {
        return await prisma.game.findFirst({
            where: {
                id: id,
            },
            include: {
                players: {
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        }
                    }
                },
                owner: true
            }
        });
    }

    findByPlayerId = async (id) => {
        return await prisma.game.findFirst({
            where: {
                active: true,
                players: {
                    some: {
                        playerId: id
                    }
                }
            },
            include: {
                players: {
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        }
                    }
                },
                owner: true
            }
        });
    }

    findByIsActive = async (ownerId) => {
        return await prisma.game.findFirst({
            where: {
                ownerId: ownerId,
                active: true,
            }
        });
    }
}