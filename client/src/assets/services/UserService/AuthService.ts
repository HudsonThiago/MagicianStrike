import type { AxiosResponse } from "axios"
import { Api } from "../Api"
import type { AuthDto } from "../../models/User"

class AuthService {
    protected readonly urlBase = '/auth'

    async auth(data:AuthDto): Promise<AxiosResponse<any>> {
        return Api.post(`${this.urlBase}/`, data)
    }
}

export const authService = new AuthService()
