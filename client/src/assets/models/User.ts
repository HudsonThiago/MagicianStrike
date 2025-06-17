import type { Entity } from "./Entity"

export interface UserRegisterDto extends Entity {
    username: string
    email: string
    password: string
    confirmPassword: string
}

export interface User extends Entity {
    username: string
    email: string
}

export interface AuthDto {
    username: string
    password: string
}