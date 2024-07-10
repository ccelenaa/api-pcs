import { IsEmail, IsEmpty, IsNotEmpty, IsString } from "class-validator"

export class SigninDto {
    @IsString()
    @IsNotEmpty()
    login: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    service: string
}
