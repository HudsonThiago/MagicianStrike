import type { Entity } from "./Entity"
import type { User } from "./User"

export interface Player {
    playerId: number
    gameId: number
    owner?: boolean
    user?: User
}