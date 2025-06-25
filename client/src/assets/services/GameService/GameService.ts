import type { AxiosResponse } from "axios"
import { CrudService } from "../CrudService"
import type { Game } from "../../models/Game"
import { Api } from "../Api"
import type { Player } from "../../models/Player"

class GameService extends CrudService<Game> {
    constructor() {
        super('/game')
    }

    async getGameByPlayerId(id:number): Promise<AxiosResponse<Game>> {
        return Api.get(`${this.urlBase}/player/${id}`)
    }

    async connectPlayer(data:Player): Promise<AxiosResponse<Game>> {
        return Api.post(`${this.urlBase}/playerConnect/`, data)
    }

    async disconnectPlayer(data:Player): Promise<AxiosResponse<Game>> {
        return Api.patch(`${this.urlBase}/playerDisconnect`, data)
    }
}

export const gameService = new GameService()
