
import type { Entity } from "./Entity"
import type { Player } from "./Player"
import type { User } from "./User"

export interface Game extends Entity {
    ownerId: number
    owner?: User
    active?: boolean
    playerAmount?: number
    players?: Player[]
}