import type { AxiosResponse } from "axios";
import type { Entity } from "../models/Entity";
import { Api } from "./Api";

export class CrudService<T extends Entity> {
  protected readonly urlBase

  constructor(urlBase: string) {
    this.urlBase = urlBase
  }


  getURL(): string {
    return this.urlBase;
  }

  find(): Promise<AxiosResponse<T[]>> {
    return Api.get(`${this.urlBase}`)
  }

  findById(id: number): Promise<AxiosResponse<T>> {
    return Api.get(`${this.urlBase}/${id}`)
  }

  async save(data: T) {
    if (data.id) {
        return await Api.patch(`${this.urlBase}/${data.id}`, data)
    }
    return await Api.post(`${this.urlBase}`, data)
  }


}