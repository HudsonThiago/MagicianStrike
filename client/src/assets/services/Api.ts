import axios, { type AxiosResponse } from 'axios'

const apiUrl = 'http://localhost:3000/api';
const instanceAxios = axios.create({
  timeout: 240000,
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'x-origem': 'WEB'
  }
})

class ApiAxios {
  // setToken(token: string | null): void {
  //   instanceAxios.defaults.headers.Authorization = `${token}`
  // }

  // getToken() {
  //   return instanceAxios.defaults.headers.Authorization
  // }

  get(url: string, data?: any): Promise<AxiosResponse> {
    return instanceAxios.get(url)
  }

  post(url: string, data: any, options = {}): Promise<AxiosResponse> {
    return instanceAxios.post(url, data, options)
  }

  postFile(url: string, data: any): Promise<AxiosResponse> {
    return instanceAxios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  postFileJson(url: string, data: any): Promise<AxiosResponse> {
    return instanceAxios.post(url, data, {
      responseType: 'blob' as 'json'
    })
  }
  patchFile(url: string, data: any): Promise<AxiosResponse> {
    return instanceAxios.patch(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  getFile(url: string): Promise<AxiosResponse> {
    return instanceAxios.get(url, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'blob' as 'json'
    })
  }

  patch(url: string, data: any): Promise<AxiosResponse> {
    return instanceAxios.patch(url, data)
  }

  delete(url: string): Promise<AxiosResponse> {
    return instanceAxios.delete(url)
  }
}

export const Api = new ApiAxios()
