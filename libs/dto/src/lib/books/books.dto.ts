import { ApiProperty } from "@nestjs/swagger"
import { Genre } from "./book.genre.enum"
import { IsEnum } from "class-validator"

export class BooksDto{
    @ApiProperty()
    title!: string

    @ApiProperty()
    publisher!: string

    @ApiProperty()
    publishedDate!: string

    @ApiProperty({ enum: Genre })
    @IsEnum(Genre)
    genres!: Genre[]
}