import { IsNotEmpty } from "class-validator"

export class CreateCompanyDto {
  @IsNotEmpty()
  name:string

  description:string

  @IsNotEmpty()
  address:string
  
  logo:string
}