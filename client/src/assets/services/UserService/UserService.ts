import type { UserRegisterDto } from "../../models/User"
import { CrudService } from "../CrudService"

class UserService extends CrudService<UserRegisterDto> {
  constructor() {
    super('/user')
  }

  // logout(): Promise<AxiosResponse<any>> {
  //   return Api.get(`${this.getURL()}/`, filtro)
  // }
}

export const userService = new UserService()
